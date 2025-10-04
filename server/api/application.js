import express from "express";
import passport from "passport";
import mongoose from "mongoose";
import Application from "../schema/applications.js";
import Groups from "../schema/groups.js";

const appRouter = express.Router();

appRouter.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const {
        q,
        status, // bisa "applied" atau "applied,interview"
        page = "1",
        limit = "20",
        sort = "-createdAt", // mis: "status position" atau "-appliedAt"
        groupId, // Tambahkan groupId untuk filtering
      } = req.query;

      // PERBAIKAN KEAMANAN: Selalu filter berdasarkan user yang sedang login dari token JWT.
      const filter = { user: req.user.id };

      if (q) filter.$text = { $search: q };
      if (status) {
        filter.status = { $in: String(status).split(",") };
      }

      // Logika filtering berdasarkan groupId
      if (groupId) {
        if (groupId === "none") {
          // Jika groupId adalah 'none', cari aplikasi yang TIDAK ada di grup manapun.
          // 1. Ambil semua ID aplikasi yang ada di dalam semua grup milik user.
          const userGroups = await Groups.find({ user: req.user.id }).select("applications").lean();
          const appIdsInGroups = userGroups.reduce((acc, group) => {
            if (group.applications) {
              acc.push(...Object.keys(group.applications));
            }
            return acc;
          }, []);
          // 2. Filter aplikasi dengan _id yang tidak ada ($nin) di dalam daftar tersebut.
          filter._id = { $nin: appIdsInGroups };
        } else {
          // Jika groupId spesifik diberikan, cari aplikasi yang ada DI DALAM grup itu.
          const group = await Groups.findOne({ _id: groupId, user: req.user.id }).lean();
          const appIds = group && group.applications ? Object.keys(group.applications) : [];
          filter._id = { $in: appIds };
        }
      }
      const pageNum = Math.max(parseInt(String(page), 10) || 1, 1);
      const limitNum = Math.min(
        Math.max(parseInt(String(limit), 10) || 20, 1),
        100
      );

      const [items, total] = await Promise.all([
        Application.find(filter)
          .sort(String(sort))
          .skip((pageNum - 1) * limitNum)
          .limit(limitNum)
          .lean(),
        Application.countDocuments(filter),
      ]);

      res.status(200).json({
        items,
        page: pageNum,
        limit: limitNum,
        total,
        hasMore: pageNum * limitNum < total,
      });
    } catch (error) {
      res.status(500).json({ message: "Server Error" });
    }
  }
);

appRouter.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    // Gunakan transaksi untuk memastikan konsistensi data
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const { groupId, ...appData } = req.body;

      // 1. Buat dokumen Application baru
      const newApplicationArray = await Application.create(
        [
          {
            ...appData,
            user: req.user.id, // Selalu kaitkan dengan user yang sedang login
          },
        ],
        { session }
      );
      const newApplication = newApplicationArray[0];

      // 2. Jika groupId diberikan, tambahkan aplikasi ke grup tersebut
      if (groupId) {
        const group = await Groups.findOne({
          _id: groupId,
          user: req.user.id, // Pastikan user memiliki grup ini
        }).session(session);

        if (!group) {
          // Jika grup tidak ditemukan, batalkan transaksi
          throw new Error("Group not found or permission denied");
        }

        // Tambahkan ID aplikasi baru ke map di dalam grup
        group.applications.set(newApplication._id.toString(), newApplication._id);
        await group.save({ session });
      }

      // Jika semua berhasil, commit transaksi
      await session.commitTransaction();
      res.status(201).json(newApplication);
    } catch (error) {
      await session.abortTransaction();
      res.status(500).json({ message: error.message || "Failed to create application" });
    } finally {
      session.endSession();
    }
  }
);

appRouter.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const doc = await Application.findOne({
        _id: req.params.id,
        user: req.user.id, // <-- PERBAIKAN: Gunakan ID dari token
      }).lean();
      if (!doc) {
        return res.status(404).json({ message: "Not Found" });
      }
      res.status(200).json(doc);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

appRouter.patch(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      // Jangan biarkan user mengubah 'user' field secara manual
      const { user, ...updateData } = req.body;
      const doc = await Application.findOneAndUpdate(
        { _id: req.params.id, user: req.user.id }, // <-- PERBAIKAN: Gunakan ID dari token
        { $set: updateData }, // <-- BUG FIX: Ini adalah data update yang sebenarnya
        {
          new: true,
          runValidators: true,
        }
      ).lean();
      if (!doc) {
        return res.status(404).json({ message: "Not Found" });
      }
      res.status(200).json(doc);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

appRouter.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const doc = await Application.findOneAndDelete({
        _id: req.params.id,
        user: req.user.id, // <-- PERBAIKAN: Gunakan ID dari token
      }).lean();
      if (!doc) {
        return res.status(404).json({ message: "Not Found" });
      }
      res.status(200).json({ message: "Deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// Reorder/move: terima batch update dari drag-and-drop
appRouter.post(
  "/reorder",
  passport.authenticate("jwt", { session: false }), // Tambahkan autentikasi
  async (req, res) => {
    try {
      const updates = Array.isArray(req.body?.updates) ? req.body.updates : [];
      // PERBAIKAN: Jika tidak ada update, anggap saja berhasil (No-Op).
      // Ini mencegah error saat kolom terakhir dikosongkan.
      if (!updates.length) {
        return res.status(204).send();
      }

      const ops = updates.map(({ id, status, position }) => ({
        updateOne: {
          // Pastikan setiap operasi update hanya untuk aplikasi milik user ini
          filter: { _id: id, user: req.user.id },
          update: { $set: { status, position } },
        },
      }));

      await Application.bulkWrite(ops, { ordered: false });
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

export default appRouter;

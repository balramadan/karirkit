import express from "express";
import passport from "passport";
import Application from "../schema/applications.js";

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
        userId,
      } = req.query;

      const filter = {};
      if (q) filter.$text = { $search: q };
      if (status) {
        filter.status = { $in: String(status).split(",") };
      }
      if (userId) filter.user = req.user.id;

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
    try {
      const doc = await Application.create({
        ...req.body,
        user: req.user.id, // Selalu kaitkan dengan user yang sedang login
      });
      res.status(201).json(doc);
    } catch (error) {
      res.status(500).json({ message: error.message });
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
      if (!updates.length)
        return res.status(400).json({ message: "No updates" });

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

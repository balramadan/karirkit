import express from "express";
import passport from "passport";
import mongoose from "mongoose";
import Groups from "../schema/groups.js";
import Application from "../schema/applications.js"; // Pastikan path ini benar

const groupRouter = express.Router();

// GET semua grup milik user yang sedang login
groupRouter.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      // 1. Ambil semua grup milik user
      const rawGroups = await Groups.find({ user: req.user.id })
        .sort("createdAt")
        .lean();

      // 2. Kumpulkan semua ID aplikasi dari semua grup
      const allApplicationIds = rawGroups.reduce((acc, group) => {
        if (group.applications && group.applications.size > 0) {
          acc.push(...Array.from(group.applications.keys()));
        }
        return acc;
      }, []);

      // 3. Ambil semua data aplikasi dalam satu query
      let applicationMap = new Map();
      if (allApplicationIds.length > 0) {
        const applications = await Application.find({
          _id: { $in: allApplicationIds },
        }).lean();
        applicationMap = new Map(
          applications.map((app) => [app._id.toString(), app])
        );
      }

      // 4. Gabungkan (populate) data aplikasi ke dalam grup masing-masing
      const populatedGroups = rawGroups.map((group) => {
        const populatedApplications = {};
        if (group.applications && typeof group.applications.keys === 'function') {
          for (const appId of group.applications.keys()) {
            if (applicationMap.has(appId)) {
              populatedApplications[appId] = applicationMap.get(appId);
            }
          }
        }
        return { ...group, applications: populatedApplications };
      });

      res.status(200).json(populatedGroups);
    } catch (err) {
      res.status(500).json({ message: err.message || "Failed to get groups" });
    }
  }
);

// POST membuat grup baru
groupRouter.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const { name } = req.body;
      if (!name) {
        return res.status(400).json({ message: "Group name is required" });
      }

      const newGroup = await Groups.create({
        name,
        user: req.user.id, // Langsung kaitkan dengan user
        applications: new Map(),
      });

      res.status(201).json(newGroup);
    } catch (err) {
      res.status(500).json({ message: err.message || "Failed to create group" });
    }
  }
);

// PATCH/update nama grup
groupRouter.patch(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const { name } = req.body;
      if (!name) {
        return res.status(400).json({ message: "Group name is required" });
      }

      const updatedGroup = await Groups.findOneAndUpdate(
        { _id: req.params.id, user: req.user.id }, // Cek kepemilikan di query
        { $set: { name } },
        { new: true, runValidators: true }
      ).lean();

      if (!updatedGroup) {
        return res
          .status(404)
          .json({ message: "Group not found or you don't have permission" });
      }

      res.status(200).json(updatedGroup);
    } catch (err) {
      res.status(500).json({ message: err.message || "Failed to update group" });
    }
  }
);

// DELETE sebuah grup (dan semua aplikasi di dalamnya)
groupRouter.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const groupId = req.params.id;
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Cari grup dan verifikasi kepemilikan
      const groupToDelete = await Groups.findOne({
        _id: groupId,
        user: req.user.id,
      }).session(session);

      if (!groupToDelete) {
        throw new Error("Not Found");
      }

      // Hapus semua aplikasi yang ada di dalam grup ini
      const applicationIds = Array.from(groupToDelete.applications.keys());
      if (applicationIds.length > 0) {
        await Application.deleteMany({ _id: { $in: applicationIds } }).session(
          session
        );
      }

      // Hapus grup itu sendiri
      await groupToDelete.deleteOne({ session });

      await session.commitTransaction();
      res
        .status(200)
        .json({ message: "Group and its applications deleted successfully." });
    } catch (err) {
      await session.abortTransaction();
      if (err.message === "Not Found") {
        return res
          .status(404)
          .json({ message: "Group not found or you don't have permission" });
      }
      res.status(500).json({ message: err.message || "Failed to delete group" });
    } finally {
      session.endSession();
    }
  }
);

export default groupRouter;

import express from "express";
import passport from "passport";
import Users from "../schema/users.js";

const userRouter = express.Router();

userRouter.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const userId = req.user.id;

      const userData = await Users.findById(userId).lean();

      if (!userData) {
        return res.status(401).json({ message: "User is not found" });
      }

      const { password, ...data } = userData;

      res.status(200).json({ data });
    } catch (err) {
      res
        .status(500)
        .json({ message: err.message || "Failed to get profile user" });
    }
  }
);

userRouter.patch(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const userId = req.user.id;
      const { groups, ...updateUser } = req.body;

      const doc = await Users.findOneAndUpdate(
        { _id: userId },
        { $set: updateUser },
        { new: true, runValidators: true }
      ).lean();
      if (!doc) {
        return res.status(404).json({ message: "Not Found" });
      }

      res.status(200).json(doc);
    } catch (err) {
      res
        .status(500)
        .json({ messsage: err.message || "Failed to update user" });
    }
  }
);

export default userRouter;

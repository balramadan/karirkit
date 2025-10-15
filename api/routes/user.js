import { sendVerificationChangePassword } from "../lib/email.js";
import express from "express";
import passport from "passport";
import Users from "../schema/users.js";
import Otp from "../schema/otp.js";
import bcrypt from "bcryptjs";

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

userRouter.post(
  "/send-verification",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const userId = req.user.id;

      const existingUser = await Users.findById(userId).lean();

      if (!existingUser) {
        return res.status(404).json({ message: "User not found" });
      }

      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      const newOtpEntry = new Otp({
        email: existingUser.email,
        otp,
        userData: {
          name: existingUser.name,
          password: existingUser.password,
        },
      });

      await newOtpEntry.save();

      await sendVerificationChangePassword(existingUser.email, otp);

      res.status(201).json({
        message:
          "Verification code sent to your email. Please verify to change password.",
        email: existingUser.email,
      });
    } catch (error) {
      console.error("Signup error:", error);
      res.status(500).json({
        message: "Failed to send verification email. " + error.message,
      });
    }
  }
);

userRouter.post(
  "/verify-otp",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const { email, otp } = req.body;

      const otpEntry = await Otp.findOne({ email });

      if (!otpEntry) {
        return res
          .status(400)
          .json({ message: "Invalid or expired OTP. Please try again." });
      }

      if (otpEntry.otp !== otp) {
        return res.status(400).json({ message: "Invalid OTP code." });
      }

      return res.status(200).json({ message: "OTP verified successfully." });
    } catch (error) {
      console.error("OTP Verification error:", error);
      res.status(500).json({ message: error.message });
    }
  }
);

userRouter.patch(
  "/change-password",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const userId = req.user.id;
      const { newPassword } = req.body;

      const user = await Users.findById(userId);
      const hashNewPassword = bcrypt.hash(newPassword, 10);

      user.password = hashNewPassword;

      await user.save();

      res.status(200).json({ message: "Password changed successfully." });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

userRouter.post(
  "/resend-otp",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const { email } = req.body;
      const lowercasedEmail = email.toLowerCase();

      // Cari apakah ada proses pendaftaran yang belum selesai untuk email ini
      const otpEntry = await Otp.findOne({ email: lowercasedEmail });
      if (!otpEntry) {
        return res.status(404).json({
          message: "Failed to resend OTP. Try again!",
        });
      }

      const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
      otpEntry.otp = newOtp;
      otpEntry.createdAt = new Date(); // Reset waktu kedaluwarsa
      await otpEntry.save();

      await sendVerificationChangePassword(lowercasedEmail, newOtp);

      res.status(200).json({
        message: "A new verification code has been sent to your email.",
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Failed to resend OTP. " + error.message });
    }
  }
);

export default userRouter;

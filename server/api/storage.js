import express from "express";
import passport from "passport";
import { v2 as cloudinary } from "cloudinary";
import { upload, handleUpload } from "../lib/cloudinary.js";
import Users from "../schema/users.js"; // Pastikan path ke model User benar

const storageRouter = express.Router();

// Curriculum Vitae
/* The `storageRouter.post` route is handling the POST request to upload a CV file. Here's a breakdown
of what the route is doing: */
storageRouter.post(
  "/cvs",
  passport.authenticate("jwt", { session: false }),
  upload.single("file"), // Menggunakan 'file' sebagai nama field
  handleUpload("cv_uploads"), // Memanggil middleware dengan nama folder
  async (req, res) => {
    try {
      // User sudah ada di req.user dari middleware passport
      const user = req.user;
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }

      // Pastikan user.cvs adalah array sebelum melakukan push
      if (!user.cvs) {
        user.cvs = [];
      }

      // Buat objek CV baru
      const newCv = {
        url: req.cloudinary.secure_url,
        public_id: req.cloudinary.public_id,
        filename: req.file.originalname,
        resource_type: req.cloudinary.resource_type, // Simpan resource_type
      };

      // Tambahkan ke array CV user dan simpan
      user.cvs.push(newCv);
      await user.save();

      // Kirim kembali CV yang baru dibuat agar frontend bisa update list
      const createdCv = user.cvs[user.cvs.length - 1];
      res.status(201).json({
        message: "File uploaded and saved successfully",
        cv: createdCv,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error while saving CV." });
    }
  }
);

/* The `storageRouter.get` route is handling a GET request to fetch and return the CVs (Curriculum
Vitae) of a specific user. Here's a breakdown of what the route is doing: */
storageRouter.get(
  "/cvs",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const user = await Users.findById(req.user.id).select("cvs");
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }
      // Pastikan cvs adalah array sebelum diurutkan, dan urutkan berdasarkan tanggal
      const sortedCvs = (user.cvs || []).sort(
        (a, b) =>
          new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
      );
      res.status(200).json({ cvs: sortedCvs });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error while fetching CVs." });
    }
  }
);

/* The `storageRouter.delete` route is handling a DELETE request to delete a specific CV (Curriculum
Vitae) belonging to the authenticated user. Here's a breakdown of what the route is doing: */
storageRouter.delete(
  "/cvs/:cvId",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const user = await Users.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }

      const cvId = req.params.cvId;
      const cvToDelete = user.cvs.id(cvId); // Cari sub-dokumen berdasarkan ID

      if (!cvToDelete) {
        return res.status(404).json({ message: "CV not found." });
      }

      // Hapus dari Cloudinary menggunakan public_id
      await cloudinary.uploader.destroy(cvToDelete.public_id, {
        resource_type: cvToDelete.resource_type,
      });

      // Hapus dari array di database
      user.cvs.pull(cvToDelete); // Cara yang lebih aman untuk menghapus sub-dokumen
      await user.save();

      res.status(200).json({ message: "CV deleted successfully." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error while deleting CV." });
    }
  }
);

// Cover Letter
storageRouter.post(
  "/cover-letters",
  passport.authenticate("jwt", { session: false }),
  upload.single("file"),
  handleUpload("coverletter_uploads"),
  async (req, res) => {
    try {
      const user = req.user;
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }

      if (!user.coverLetters) {
        user.coverLetters = [];
      }

      const newCoverLetter = {
        url: req.cloudinary.secure_url,
        public_id: req.cloudinary.public_id,
        filename: req.file.originalname,
        resource_type: req.cloudinary.resource_type,
      };

      user.coverLetters.push(newCoverLetter);
      await user.save();

      const createdCoverLetter = user.coverLetters[user.coverLetters.length - 1];
      res.status(201).json({
        message: "Cover letter uploaded successfully",
        coverLetter: createdCoverLetter,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error while saving cover letter." });
    }
  }
);

storageRouter.get(
  "/cover-letters",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const user = await Users.findById(req.user.id).select("coverLetters");
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }
      // Pastikan cvs adalah array sebelum diurutkan, dan urutkan berdasarkan tanggal
      const sortedCoverLetter = (user.coverLetters || []).sort(
        (a, b) =>
          new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
      );
      res.status(200).json({ coverLetters: sortedCoverLetter });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error while fetching Cover Letters." });
    }
  }
);

storageRouter.delete(
  "/cover-letters/:coverLetterId",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const user = await Users.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }

      const coverLetterId = req.params.coverLetterId;
      const coverLetterToDelete = user.coverLetters.id(coverLetterId); // Cari sub-dokumen berdasarkan ID

      if (!coverLetterToDelete) {
        return res.status(404).json({ message: "Cover letter not found." });
      }

      // Hapus dari Cloudinary menggunakan public_id
      await cloudinary.uploader.destroy(coverLetterToDelete.public_id, {
        resource_type: coverLetterToDelete.resource_type,
      });

      // Hapus dari array di database
      user.coverLetters.pull(coverLetterToDelete); // Metode baru di Mongoose v6+
      await user.save();

      res.status(200).json({ message: "Cover letter deleted successfully." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error while deleting Cover Letter." });
    }
  }
);

export default storageRouter;

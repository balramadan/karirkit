import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import streamifier from "streamifier";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure multer to use memory storage so we can stream the file to Cloudinary
const storage = multer.memoryStorage();

export const upload = multer({ storage });

// Middleware to handle the upload to Cloudinary
export const handleUpload = (folderName) => (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded." });
  }

  const uploadStream = cloudinary.uploader.upload_stream(
    { folder: folderName, resource_type: "auto" },
    (error, result) => {
      if (error)
        return res
          .status(500)
          .json({ message: "Upload to Cloudinary failed", error });
      req.cloudinary = result;
      next();
    }
  );

  streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
};

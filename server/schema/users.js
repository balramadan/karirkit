import { Schema, model } from "mongoose";

const documentSchema = new Schema({
  url: { type: String, required: true },
  public_id: { type: String, required: true }, // ID dari Cloudinary untuk proses hapus
  filename: { type: String, required: true },
  resource_type: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
});

const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    photoUrl: { type: String },
    cvs: [documentSchema],
    coverLetters: [documentSchema],
  },
  { timestamps: true }
);

userSchema.index({ email: "text" });

const Users = model("Users", userSchema);

export default Users;

import { Schema, model } from "mongoose";

const otpSchema = new Schema({
  email: { type: String, required: true, unique: true },
  otp: { type: String, required: true },
  // Data pendaftaran yang akan disimpan sementara
  userData: {
    name: { type: String, required: false },
    password: { type: String, required: false }, // Ini adalah password yang sudah di-hash
  },
  createdAt: {
    type: Date,
    default: Date.now,
    // Dokumen akan otomatis terhapus dari database setelah 10 menit
    expires: 600, // 600 detik = 10 menit
  },
});

const Otp = model("Otp", otpSchema);

export default Otp;

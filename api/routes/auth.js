import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import passport from "passport";
import Users from "../schema/users.js";
import Otp from "../schema/otp.js"; // Impor model Otp
import { sendVerificationEmail } from "../lib/email.js"; // Impor fungsi email
import { sessionMiddleware } from "../lib/session.js"; // Impor dari file session

const authRouter = express.Router();

// Pendaftaran baru dengan verifikasi email
authRouter.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const lowercasedEmail = email.toLowerCase();

    // 1. Cek apakah email sudah terdaftar dan terverifikasi di koleksi Users
    const existingUser = await Users.findOne({ email: lowercasedEmail });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // 2. Hapus OTP lama jika ada untuk email yang sama, untuk memulai proses baru
    await Otp.deleteOne({ email: lowercasedEmail });

    // 3. Buat kode OTP (6 digit angka)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // 4. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5. Simpan data pendaftaran sementara dan OTP ke koleksi Otp
    const newOtpEntry = new Otp({
      email: lowercasedEmail,
      otp,
      userData: {
        name,
        password: hashedPassword,
      },
    });
    await newOtpEntry.save();

    // 6. Kirim email verifikasi
    await sendVerificationEmail(lowercasedEmail, otp);

    res.status(201).json({
      message:
        "Verification code sent to your email. Please verify to complete registration.",
      email: lowercasedEmail, // Kirim kembali email untuk UI
    });
  } catch (error) {
    console.error("Signup error:", error);
    res
      .status(500)
      .json({ message: "Failed to send verification email. " + error.message });
  }
});

// Endpoint untuk verifikasi OTP
authRouter.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;
    const lowercasedEmail = email.toLowerCase();

    // 1. Cari entri OTP di database
    const otpEntry = await Otp.findOne({ email: lowercasedEmail });

    if (!otpEntry) {
      return res.status(400).json({
        message: "Invalid or expired OTP. Please try signing up again.",
      });
    }

    // 2. Bandingkan OTP yang diberikan dengan yang ada di database
    if (otpEntry.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP code." });
    }

    // 3. Jika OTP benar, buat pengguna baru dari data yang disimpan
    const newUser = new Users({
      name: otpEntry.userData.name,
      email: otpEntry.email,
      password: otpEntry.userData.password,
    });
    await newUser.save();

    // 4. Hapus entri OTP dari database setelah berhasil
    await Otp.deleteOne({ email: lowercasedEmail });

    res
      .status(201)
      .json({ message: "User registered successfully. You can now sign in." });
  } catch (error) {
    console.error("OTP Verification error:", error);
    res.status(500).json({ message: error.message });
  }
});

authRouter.post("/signin", (req, res, next) => {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err || !user) {
      return res
        .status(400)
        .json({ message: info ? info.message : "Login failed", user });
    }

    req.login(user, { session: false }, (err) => {
      if (err) {
        res.send(err);
      }

      const payload = { id: user._id, name: user.name, email: user.email };
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });

      return res.json({
        success: true,
        user_id: user._id,
        name: user.name,
        photoUrl: user.photoUrl,
        token: `${token}`,
      });
    });
  })(req, res, next);
});

// --- Rute untuk Auth0 SSO ---

// Rute untuk memulai login dengan Google via Auth0
// Frontend akan mengarahkan pengguna ke GET /api/auth/google
authRouter.get(
  "/google",
  sessionMiddleware, // Terapkan session di sini
  passport.authenticate("auth0", {
    scope: "openid email profile", // Meminta informasi dasar pengguna
    connection: "google-oauth2", // Memaksa untuk menggunakan koneksi Google
  })
);

// Rute callback yang akan dipanggil oleh Auth0 setelah login berhasil
authRouter.get(
  "/callback",
  sessionMiddleware, // Terapkan session di sini juga
  passport.authenticate("auth0", {
    failureRedirect: "/login-failed", // URL di frontend jika login gagal
    session: false,
  }),
  (req, res) => {
    // Jika otentikasi berhasil, 'req.user' akan berisi data pengguna dari database kita
    const user = req.user;
    const payload = {
      id: user._id,
      name: user.name,
      email: user.email,
      photoUrl: user.photoUrl,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // Alihkan pengguna kembali ke frontend dengan token sebagai query parameter.
    // Frontend akan menangani penyimpanan token dan mengarahkan ke dasbor.
    const clientURL = process.env.CLIENT_URL || "http://localhost:5173";
    res.redirect(`${clientURL}/auth/callback?token=${token}`);
  }
);

// --- Rute untuk Logout ---
authRouter.get("/logout", sessionMiddleware, (req, res, next) => {
  // URL untuk redirect setelah logout dari Auth0.
  // HARUS terdaftar di "Allowed Logout URLs" di dasbor Auth0.
  const returnTo = process.env.CLIENT_URL
    ? `${process.env.CLIENT_URL}/login`
    : "http://localhost:5173/login";

  // Parameter yang diperlukan untuk logout dari Auth0
  const logoutURL = new URL(`https://${process.env.AUTH0_DOMAIN}/v2/logout`);
  logoutURL.searchParams.set("client_id", process.env.AUTH0_CLIENT_ID);
  logoutURL.searchParams.set("returnTo", returnTo);

  // Hapus session di server (jika ada) dan redirect ke Auth0
  req.session.destroy((err) => {
    if (err) {
      return next(err); // Teruskan error jika ada
    }
    res.redirect(logoutURL.toString());
  });
});

// (Opsional) Endpoint untuk mengirim ulang OTP
authRouter.post("/resend-otp", async (req, res) => {
  try {
    const { email } = req.body;
    const lowercasedEmail = email.toLowerCase();

    // Cari apakah ada proses pendaftaran yang belum selesai untuk email ini
    const otpEntry = await Otp.findOne({ email: lowercasedEmail });
    if (!otpEntry) {
      return res.status(404).json({
        message:
          "No pending registration found for this email. Please sign up first.",
      });
    }

    // Buat OTP baru dan perbarui entri yang ada
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    otpEntry.otp = newOtp;
    otpEntry.createdAt = new Date(); // Reset waktu kedaluwarsa
    await otpEntry.save();

    // Kirim ulang email
    await sendVerificationEmail(lowercasedEmail, newOtp);

    res.status(200).json({
      message: "A new verification code has been sent to your email.",
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to resend OTP. " + error.message });
  }
});

export default authRouter;

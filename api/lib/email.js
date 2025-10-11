import nodemailer from "nodemailer";

// Konfigurasi transporter menggunakan variabel lingkungan
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || "587", 10),
  secure: parseInt(process.env.EMAIL_PORT || "587", 10) === 465, // true untuk 465, false untuk lainnya
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Mengirim email verifikasi OTP
 * @param {string} to - Alamat email penerima
 * @param {string} otp - Kode OTP yang akan dikirim
 */
export const sendVerificationEmail = async (to, otp) => {
  const mailOptions = {
    from: {
      name: "KarirKit",
      address: process.env.SENDER_EMAIL,
    },
    to: to,
    subject: "Your Verification Code for KarirKit",
    html: `<p>Hi there,</p>
           <p>Thank you for registering at KarirKit. Use the following code to verify your email address:</p>
           <h2 style="text-align:center; letter-spacing: 2px;"><b>${otp}</b></h2>
           <p>This code will expire in 10 minutes.</p>`,
  };
  await transporter.sendMail(mailOptions);
};

export const sendVerificationChangePassword = async (to, otp) => {
  const mailOptions = {
    from: {
      name: "KarirKit",
      address: process.env.SENDER_EMAIL,
    },
    to: to,
    subject: "Your Verification Code to Change Password for KarirKit",
    html: `<p>Hi there,</p>
           <p>You requested to change your password at KarirKit. Use the following code to verify your email address:</p>
           <h2 style="text-align:center; letter-spacing: 2px;"><b>${otp}</b></h2>
           <p>This code will expire in 10 minutes.</p>`,
  };
  await transporter.sendMail(mailOptions);
};

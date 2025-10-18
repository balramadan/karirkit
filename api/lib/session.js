import session from "express-session";
import MongoStore from "connect-mongo";

// Konfigurasi session middleware.
// Ini HANYA akan digunakan untuk alur otentikasi Auth0.
export const sessionMiddleware = session({
  // Tambahkan 'proxy: true' agar express-session mempercayai header
  // yang diatur oleh proxy Vercel (seperti X-Forwarded-Proto)
  // untuk menentukan apakah koneksi aman (secure).
  proxy: true,
  secret: process.env.SESSION_SECRET || "a-very-secret-key-for-sso",
  resave: false,
  saveUninitialized: false,
  cookie: {
    // Di produksi (Vercel), kita perlu cookie lintas situs (cross-site)
    // karena API dan frontend mungkin berada di domain/subdomain yang berbeda.
    // SameSite=None memerlukan Secure=true.
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    httpOnly: true, // Praktik keamanan yang baik
    maxAge: 600000, // 10 menit, cukup untuk alur login
  },
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    ttl: 14 * 24 * 60 * 60, // 14 days
    autoRemove: "native",
  }),
});

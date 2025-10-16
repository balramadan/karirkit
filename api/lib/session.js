import session from "express-session";
import MongoStore from "connect-mongo";

// Konfigurasi session middleware.
// Ini HANYA akan digunakan untuk alur otentikasi Auth0.
export const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET || "a-very-secret-key-for-sso", // Ganti dengan secret acak di .env
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === "production" },
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    ttl: 14 * 24 * 60 * 60, // 14 days
    autoRemove: "native",
  }),
});

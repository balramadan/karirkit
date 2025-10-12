import express from "express";
import cors from "cors";
import passport from "passport";
import connectDB from "./lib/db.js";
import appRouter from "./routes/application.js";
import scrapeRouter from "./routes/scrape.js";
import passportConfig from "./lib/passport.js";
import authRouter from "./routes/auth.js";
import storageRouter from "./routes/storage.js";
import userRouter from "./routes/user.js";
import groupRouter from "./routes/group.js";

connectDB();

const app = express();
// const port = 3000;

// Daftar origin yang diizinkan
const allowedOrigins = ["http://localhost:5173", "https://karirkit.vercel.app"];

// Middleware
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(passport.initialize());
passportConfig(passport);

// App Router
app.use("/api/application", appRouter);
app.use("/api/scrape", scrapeRouter);
app.use("/api/auth", authRouter);
app.use("/api/storage", storageRouter);
app.use("/api/user", userRouter);
app.use("/api/group", groupRouter);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// connectDB(process.env.MONGODB_URI)
//   .then(() => {
//     app.listen(port, () => {
//       console.log(`Server is running on http://localhost:${port}`);
//     });
//   })
//   .catch((err) => {
//     console.error("Failed to connect to MongoDB", err);
//     process.exit(1);
//   });

export default app;

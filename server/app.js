import express from "express";
import cors from "cors";
import passport from "passport";
import connectDB from "./lib/db.js";
import appRouter from "./api/application.js";
import scrapeRouter from "./api/scrape.js";
import passportConfig from "./lib/passport.js";
import authRouter from "./api/auth.js";
import storageRouter from "./api/storage.js";
import userRouter from "./api/user.js";
import groupRouter from "./api/group.js";

const app = express();
const port = 3000;

// Middleware
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(passport.initialize());
passportConfig(passport);

// App Router
app.use("/v1/application", appRouter);
app.use("/v1/scrape", scrapeRouter);
app.use("/v1/auth", authRouter);
app.use("/v1/storage", storageRouter);
app.use("/v1/user", userRouter);
app.use("/v1/group", groupRouter)

app.get("/", (req, res) => {
  res.send("Hello World!");
});

connectDB(process.env.MONGODB_URI)
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1);
  });

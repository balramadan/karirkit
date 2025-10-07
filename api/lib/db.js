import mongoose from "mongoose";

async function connectDB() {
  await mongoose.connect(process.env.MONGODB_URI, { dbName: "karirkit" });
  console.log("MongoDB connected");
}

export default connectDB;

import mongoose from "mongoose";

async function connectDB(uri) {
  await mongoose.connect(uri, { dbName: "karirkit" });
  console.log("MongoDB connected");
}

export default connectDB;

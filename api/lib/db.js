import mongoose from "mongoose";

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections from growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    console.log("MongoDB using cached connection");
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGODB_URI, { dbName: "karirkit", bufferCommands: false }).then((mongoose) => mongoose);
  }
  cached.conn = await cached.promise;
  console.log("MongoDB connected (new connection)");
  return cached.conn;
}

export default connectDB;

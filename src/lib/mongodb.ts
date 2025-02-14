import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://kta6161:kta6161@spc.fpaza.mongodb.net/?retryWrites=true&w=majority&appName=spc";

if (!MONGODB_URI) {
  throw new Error("MongoDB URI is required");
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

let cached: MongooseCache = globalThis.mongoose || { conn: null, promise: null };

if (!cached) {
  cached = globalThis.mongoose = { conn: null, promise: null };
}

const connectToDatabase = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => mongoose);
  }

  cached.conn = await cached.promise;
  return cached.conn;
};

export default connectToDatabase;

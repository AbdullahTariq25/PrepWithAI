// ===========================================
// PrepWithAI — MongoDB Connection
// Production-grade connection pooling with
// graceful build-time and runtime behavior.
// ===========================================

import mongoose from "mongoose";

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongoose || {
  conn: null,
  promise: null,
};

if (!global.mongoose) {
  global.mongoose = cached;
}

const connectionOptions: mongoose.ConnectOptions = {
  bufferCommands: false,
  maxPoolSize: 10,
  minPoolSize: 0,
  socketTimeoutMS: 45000,
  serverSelectionTimeoutMS: 10000,
  heartbeatFrequencyMS: 10000,
};

async function dbConnect(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  const uri = process.env.MONGODB_URI?.trim();
  if (!uri) {
    throw new Error(
      "Database is not configured. Set MONGODB_URI in the deployment environment before using database-backed features."
    );
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(uri, connectionOptions).then((mongooseInstance) => {
      if (process.env.NODE_ENV !== "production") {
        console.info("MongoDB connected successfully");
      }
      return mongooseInstance;
    });

    mongoose.connection.on("error", (error) => {
      console.error("MongoDB connection error:", error);
    });

    mongoose.connection.on("disconnected", () => {
      cached.conn = null;
      cached.promise = null;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    cached.conn = null;
    throw error;
  }

  return cached.conn;
}

export default dbConnect;

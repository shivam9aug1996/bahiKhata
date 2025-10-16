import { isTokenVerified } from "@/json";
import { MongoClient } from "mongodb";
import AsyncLock from "async-lock";
import { dbUrl } from "./keys";

const uri = dbUrl;

// Async lock to prevent multiple simultaneous connections
const lock = new AsyncLock();

// Global caches — safe for local dev, and will re-initialize automatically on Vercel cold start
let cachedClient = null;
let cachedDb = null;

// ✅ Always create a new MongoClient on Vercel cold starts
const createClient = async () => {
  const client = new MongoClient(uri, {
    maxPoolSize: 10,
  });
  await client.connect();
  console.log("✅ MongoDB client connected");
  return client;
};

// ✅ Get a connected client (reconnects if undefined)
export const getClient = async () => {
  if (cachedClient) return cachedClient;
  cachedClient = await createClient();
  return cachedClient;
};

// ✅ Get a database connection (safe for both local & Vercel)
export const connectDB = async (req) => {
  try {
    let isToken = true;
    if (req) {
      isToken = await isTokenVerified(req);
      if (!isToken) {
        console.log("⛔ Token verification failed");
        return null;
      }
    }

    return await lock.acquire("connection", async () => {
      if (cachedDb) return cachedDb;

      const client = await getClient();
      cachedDb = client.db("basic-crud");
      console.log("✅ Database connected");
      return cachedDb;
    });
  } catch (error) {
    console.error("❌ Error in connectDB:", error);
    return null;
  }
};

//
// ✅ Transaction helpers (auto-connect + safe error handling)
//

// Start a transaction
export const startTransaction = async () => {
  try {
    const client = await getClient();
    if (!client) throw new Error("MongoDB client not connected");

    const session = client.startSession();
    await session.startTransaction();
    console.log("✅ Transaction started");
    return session;
  } catch (error) {
    console.error("❌ Error starting transaction:", error);
    return null;
  }
};

// Commit a transaction
export const commitTransaction = async (session) => {
  if (!session) return;
  try {
    await session.commitTransaction();
    console.log("✅ Transaction committed");
  } catch (error) {
    console.error("❌ Error committing transaction:", error);
  } finally {
    await session.endSession();
    console.log("🧹 Session closed");
  }
};

// Abort a transaction
export const abortTransaction = async (session) => {
  if (!session) return;
  try {
    await session.abortTransaction();
    console.log("⚠️ Transaction aborted");
  } catch (error) {
    console.error("❌ Error aborting transaction:", error);
  } finally {
    await session.endSession();
    console.log("🧹 Session closed");
  }
};

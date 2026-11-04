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
  const client = await getClient();
  if (!client) throw new Error("MongoDB client not connected");

  const session = client.startSession();
  try {
    session.startTransaction();
    return session;
  } catch (error) {
    await session.endSession();
    throw error;
  }
};

// Commit failures must reach the route handler; never report a successful write
// when MongoDB did not confirm the commit.
export const commitTransaction = async (session) => {
  if (!session) throw new Error("Cannot commit without a MongoDB session");
  try {
    await session.commitTransaction();
  } catch (error) {
    try {
      if (session.inTransaction()) await session.abortTransaction();
    } catch (abortError) {
      console.error("Error aborting failed transaction:", abortError);
    }
    throw error;
  } finally {
    await session.endSession();
  }
};

// Abort is best-effort so it does not hide the original route error.
export const abortTransaction = async (session) => {
  if (!session) return;
  try {
    if (session.inTransaction()) await session.abortTransaction();
  } catch (error) {
    console.error("Error aborting transaction:", error);
  } finally {
    await session.endSession();
  }
};

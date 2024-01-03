import { isTokenVerified } from "@/json";
import { MongoClient, ObjectId } from "mongodb";

import { dbUrl } from "./keys";

let cachedClient;
let db;
let cachedSession;
const uri = dbUrl;

export const connectDB = async (req) => {
  try {
    let isToken;
    if (req) {
      isToken = await isTokenVerified(req);

      if (!isToken) {
        return;
      }
    }
    console.log("123456789 connectDB starting");
    let client = await connectCluster();
    let res = await connectDatabase(client);
    console.log("123456789 connectDB started");
    return res;
  } catch (error) {
    console.log("123456789 error in connectDB");
    throw error;
  }
};

const connectCluster = async () => {
  if (cachedClient) {
    console.log("123456789 client already connected");
    return cachedClient;
  }

  const client = new MongoClient(uri, {
    // useNewUrlParser: false,
    // useUnifiedTopology: true,
  });

  try {
    console.log("123456789 client connecting");
    await client.connect();
    db = null;
    console.log("123456789 client connected");
    cachedClient = client;
    return client;
  } catch (error) {
    console.log("123456789 error in connectCluster");
    throw error;
  }
};

const connectDatabase = async (client) => {
  try {
    if (db) {
      return db;
    } else {
      if (client?.db) {
        console.log("123456789 db connecting");
        db = await client.db("basic-crud");
        console.log("123456789 db connected");
        return db;
      } else {
        console.log("123456789 error in connectDatabase");
        throw new Error("MongoDB client not connected.");
      }
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const startSession = async () => {
  try {
    if (cachedSession) {
      return cachedSession;
    } else {
      if (cachedClient) {
        cachedSession = cachedClient.startSession();
        return cachedSession;
      } else {
        throw new Error("MongoDB client not connected.");
      }
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

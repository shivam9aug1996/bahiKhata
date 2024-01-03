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

    await connectCluster();
    let res = await connectDatabase();
    return res;
  } catch (error) {
    console.log("error in connectDB");
    throw error;
  }
};

const connectCluster = async () => {
  if (cachedClient) {
    return cachedClient;
  }

  const client = new MongoClient(uri, {
    // useNewUrlParser: false,
    // useUnifiedTopology: true,
  });

  try {
    console.log("cluster connecting");
    await client.connect();
    console.log("cluster connected");
    cachedClient = client;
    return client;
  } catch (error) {
    console.error("cluster error while connecting");
    throw error;
  }
};

const connectDatabase = async () => {
  try {
    if (db) {
      console.log("db already connected");
      return db;
    } else {
      if (cachedClient?.db) {
        console.log("db connecting");
        db = await cachedClient.db("basic-crud");
        console.log("db connected");
        return db;
      } else {
        console.log("db error while connecting");
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

import { MongoClient, ObjectId } from "mongodb";

let cachedClient;
let db;
let cachedSession;
const uri =
  "mongodb+srv://shivam9aug1996:1SxbXxQuhwx1qTKI@bahikhatacluster.mcviyfo.mongodb.net/";

export const connectDB = async () => {
  try {
    await connectCluster();
    let res = await connectDatabase();
    return res;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const connectCluster = async () => {
  if (cachedClient) {
    return cachedClient;
  }

  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    await client.connect();
    cachedClient = client;
    return client;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const connectDatabase = async () => {
  try {
    if (db) {
      return db;
    } else {
      if (cachedClient?.db) {
        db = await cachedClient.db("basic-crud");
        return db;
      } else {
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

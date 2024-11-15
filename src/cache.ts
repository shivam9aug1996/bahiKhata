import { ObjectId } from "mongodb";
import { connectDB } from "./app/api/lib/dbconnection";
import redisClient from "./app/api/lib/redisClient";

async function setCache(cacheId, data) {
  // const db = await connectDB();
  // const createdAt = new Date();

  // try {
  //   const cacheData = await db.collection("cache").findOne({ cacheId });

  //   if (cacheData) {
  //     const updatedResult = await db
  //       .collection("cache")
  //       .updateOne({ _id: cacheData?._id }, { $set: { data } });
  //     return {
  //       message: "Cache updated successfully",
  //       data: updatedResult,
  //     };
  //   } else {
  //     const result = await db.collection("cache").insertOne({ cacheId, data });
  //     return {
  //       message: "Cache created successfully",
  //       data: {
  //         _id: new ObjectId(result?.insertedId),
  //         cacheId,
  //         data,
  //         createdAt,
  //       },
  //     };
  //   }
  // } catch (error) {
  //   throw new Error("Something went wrong");
  // }
  const createdAt = new Date();
  try {
    // Store data as a string, with an expiration time of 5 minutes (300 seconds)
    await redisClient.set(
      cacheId,
      JSON.stringify({ data, createdAt }),
      "EX",
      3600
    );
    return {
      message: "Cache created successfully",
      data: {
        cacheId,
        data,
        createdAt,
      },
    };
  } catch (error) {
    throw new Error("Error setting cache");
  }
}

async function getCache(cacheId) {
  // const db = await connectDB();

  // try {
  //   const cacheData = await db.collection("cache").findOne({ cacheId });

  //   if (!cacheData) {
  //     return null;
  //   }

  //   return { data: cacheData };
  // } catch (error) {
  //   throw new Error("Something went wrong");
  // }
  try {
    const cacheData = await redisClient.get(cacheId);
    if (cacheData) {
      return {
        data: JSON.parse(cacheData),
      };
    }
    return null;
  } catch (error) {
    throw new Error("Error getting cache");
  }
}

async function deleteCache(cacheId) {
  // const db = await connectDB();

  // try {
  //   const cacheData = await db.collection("cache").findOne({ cacheId });

  //   if (cacheData) {
  //     const deleteCustomerResult = await db
  //       .collection("cache")
  //       .deleteOne({ cacheId });
  //   }

  //   return { message: "Deleted successfully" };
  // } catch (error) {
  //   throw new Error("Something went wrong");
  // }
  try {
    await redisClient.del(cacheId);
    return { message: "Cache deleted successfully" };
  } catch (error) {
    throw new Error("Error deleting cache");
  }
}

export { setCache, getCache, deleteCache };

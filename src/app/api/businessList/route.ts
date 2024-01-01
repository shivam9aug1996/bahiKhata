import { deleteCache, getCache, setCache } from "@/cache";
import { isTokenVerified } from "@/json";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import { connectDB, startSession } from "../lib/dbconnection";
import { deleteImage } from "../lib/global";

export async function POST(req, res) {
  if (req.method === "POST") {
    // Create a new business
    const { name, primaryKey, userId } = await req.json();

    const db = await connectDB(req);
    if (
      !name ||
      typeof primaryKey !== "boolean" ||
      typeof name !== "string" ||
      !userId
    ) {
      return NextResponse.json(
        { message: "Invalid data format" },
        { status: 400 }
      );
    }

    try {
      await deleteCache(userId);
      const user = await db
        .collection("users")
        .findOne({ _id: new ObjectId(userId) });
      if (!user) {
        return NextResponse.json(
          { message: "User not found" },
          { status: 404 }
        );
      }

      if (primaryKey) {
        // Check if there's an existing primary business
        const existingPrimary = await db
          .collection("businesses")
          .findOne({ primaryKey: true, userId });

        if (existingPrimary) {
          // If an existing primary business is found, update its primaryKey to false
          await db
            .collection("businesses")
            .updateOne(
              { _id: new ObjectId(existingPrimary._id), userId },
              { $set: { primaryKey: false } }
            );
        }
      }
      const result = await db
        .collection("businesses")
        .insertOne({ name, primaryKey, userId });
      return NextResponse.json(
        {
          message: "Business created successfully",
          data: { _id: result?.insertedId, name, primaryKey, userId },
        },
        { status: 201 }
      );
    } catch (error) {
      return NextResponse.json(
        { message: "Something went wrong" },
        { status: 500 }
      );
    }
  } else {
    return NextResponse.json(
      { message: "Method Not Allowed" },
      { status: 405 }
    );
  }
}

export async function GET(req, res) {
  if (req.method === "GET") {
    const userId = new URL(req.url)?.searchParams?.get("userId");
    if (!userId) {
      return NextResponse.json(
        { message: "Invalid data format" },
        { status: 400 }
      );
    }
    // Retrieve all businesses

    try {
      const db = await connectDB(req);
      let cacheData = await getCache(userId);
      if (cacheData) {
        return NextResponse.json(
          {
            data: cacheData?.data?.data,
            cache: true,
          },
          { status: 200 }
        );
      }
      const businesses = await db
        .collection("businesses")
        .find({
          userId,
        })
        .toArray();
      await setCache(userId, businesses);
      return NextResponse.json({ data: businesses }, { status: 200 });
    } catch (error) {
      return NextResponse.json(
        { message: "Something went wrong" },
        { status: 500 }
      );
    }
  } else {
    return NextResponse.json(
      { message: "Method Not Allowed" },
      { status: 405 }
    );
  }
}

export async function PUT(req, res) {
  if (req.method === "PUT") {
    // Update a business
    const { id, name, primaryKey, userId } = await req.json();
    const db = await connectDB(req);

    if (!id || !name || primaryKey === undefined || !userId) {
      return NextResponse.json(
        { message: "Invalid data format" },
        { status: 400 }
      );
    }

    try {
      await deleteCache(userId);
      if (primaryKey) {
        // Check if there's an existing primary business
        const existingPrimary = await db
          .collection("businesses")
          .findOne({ primaryKey: true, userId });

        if (existingPrimary) {
          // If an existing primary business is found, update its primaryKey to false
          await db
            .collection("businesses")
            .updateOne(
              { _id: new ObjectId(existingPrimary._id), userId },
              { $set: { primaryKey: false } }
            );
        }
      }
      const result = await db
        .collection("businesses")
        .updateOne(
          { _id: new ObjectId(id), userId },
          { $set: { name, primaryKey } }
        );
      return NextResponse.json(
        {
          message: "Business updated successfully",
          data: { name, primaryKey, _id: id, userId },
        },
        { status: 200 }
      );
    } catch (error) {
      return NextResponse.json(
        { message: "Something went wrong" },
        { status: 500 }
      );
    }
  } else {
    return NextResponse.json(
      { message: "Method Not Allowed" },
      { status: 405 }
    );
  }
}

export async function DELETE(req, res) {
  if (req.method === "DELETE") {
    const { id, userId } = await req.json();
    const db = await connectDB(req);

    if (!id || !userId) {
      return NextResponse.json(
        { message: "Invalid data format" },
        { status: 400 }
      );
    }

    try {
      await deleteCache(userId);
      const businessToDelete = await db
        .collection("businesses")
        .findOne({ _id: new ObjectId(id), userId });

      if (!businessToDelete) {
        return NextResponse.json(
          { message: "Business not found" },
          { status: 404 }
        );
      }
      const isPrimary = businessToDelete?.primaryKey;
      const session = await startSession();
      session.startTransaction();

      try {
        const transactions = await db
          .collection("transactions")
          .find({ businessId: id })
          .toArray();
        const transactionImageUrls = transactions.flatMap(
          (transaction) => transaction.imageUrl
        );

        for (let i = 0; i < transactionImageUrls?.length; i++) {
          try {
            await deleteImage(transactionImageUrls[i]);
          } catch (error) {
            console.error(`Error deleting image`);
          }
        }

        // Delete the business and its associated data in a transaction
        // return NextResponse.json(
        //   { message: "Business not found" },
        //   { status: 404 }
        // );
        await db
          .collection("businesses")
          .deleteOne({ _id: new ObjectId(id), userId });
        await db.collection("customers").deleteMany({ businessId: id });
        await db.collection("suppliers").deleteMany({ businessId: id });
        await db.collection("transactions").deleteMany({ businessId: id });

        // Commit the transaction
        await session.commitTransaction();
        session.endSession();
        if (isPrimary) {
          // If the deleted business was primary, find another business and set it as primary
          const updatedBusiness = await db
            .collection("businesses")
            .findOneAndUpdate(
              { _id: { $ne: new ObjectId(id) }, userId }, // Exclude the deleted business
              { $set: { primaryKey: true } },
              { returnDocument: "after" } // Sort to select the first business
            );

          // if (!updatedBusiness) {
          //   return NextResponse.json(
          //     { message: "No other business to set as primary" },
          //     { status: 404 }
          //   );
          // }
        }

        return NextResponse.json(
          {
            message: "Business and its associated data deleted successfully",
            data: { _id: id, userId },
          },
          { status: 200 }
        );
      } catch (error) {
        console.log(error);
        // If any error occurs during the transaction, rollback changes
        await session.abortTransaction();
        session.endSession();

        throw error;
      }
    } catch (error) {
      console.log(error);
      return NextResponse.json(
        { message: "Something went wrong" },
        { status: 500 }
      );
    }
  } else {
    return NextResponse.json(
      { message: "Method Not Allowed" },
      { status: 405 }
    );
  }
}

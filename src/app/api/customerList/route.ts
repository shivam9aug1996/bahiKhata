import { deleteCache } from "@/cache";
import { ObjectId } from "mongodb";

import { NextResponse } from "next/server";

import {
  abortTransaction,
  commitTransaction,
  connectDB,
  getClient,
  startTransaction,
} from "../lib/dbconnection";
import { deleteImage } from "../lib/global";

// Force dynamic rendering since we use cookies
export const dynamic = 'force-dynamic';

export async function POST(req, res) {
  if (req.method === "POST") {
    // Create a new business
    const { businessId, name, mobileNumber } = await req.json();
    const db = await connectDB(req);

    if (!businessId || !name || !mobileNumber) {
      return NextResponse.json(
        { message: "Invalid data format" },
        { status: 400 }
      );
    }
    let balance = 0;
    const createdAt = new Date();
    try {
      //await deleteCache(businessId);
      // await db
      //   .collection("customers")
      //   .dropIndex("businessId_1_name_1_mobileNumber_1_createdAt_-1");

      const latestCreditTransaction = null;
      const latestDebitTransaction = null;
      const result = await db.collection("customers").insertOne({
        businessId,
        name,
        mobileNumber,
        balance,
        createdAt,
        latestCreditTransaction,
        latestDebitTransaction,
      });
      return NextResponse.json(
        {
          message: "Customer created successfully",
          data: {
            _id: new ObjectId(result?.insertedId),
            businessId,
            name,
            mobileNumber,
            balance,
            createdAt,
            latestCreditTransaction,
            latestDebitTransaction,
          },
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
    // Retrieve all businesses
    const businessId = new URL(req.url)?.searchParams?.get("businessId");
    const searchQuery = new URL(req.url)?.searchParams?.get("searchQuery");
    const page = parseInt(new URL(req.url)?.searchParams?.get("page") || "1");

    const limit = parseInt(
      new URL(req.url)?.searchParams?.get("limit") || "10"
    );
    const skip = (page - 1) * limit;
    if (!businessId) {
      return NextResponse.json(
        { message: "Invalid data format" },
        { status: 400 }
      );
    }
    // const { businessId } = await req.json();
    const db = await connectDB(req);

    try {
      let customers;
      let totalCustomers;
      // const indexesExist = await db
      //   .collection("customers")
      //   .indexExists("businessId_1_name_1_mobileNumber_1_createdAt_-1");
      // if (!indexesExist) {
      //   // await db
      //   //   .collection("customers")
      //   //   .createIndex({ name: 1, mobileNumber: 1 });
      //   await db.collection("customers").createIndex({
      //     businessId: 1, // Add businessId as the first field
      //     name: 1,
      //     mobileNumber: 1,
      //     createdAt: -1,
      //   });
      // }

      const business = await db
        .collection("businesses")
        .findOne({ _id: new ObjectId(businessId) });

      if (!business) {
        return NextResponse.json(
          { message: "Business not found", data: [] },
          { status: 200 }
        );
      }
      if (searchQuery) {
        customers = await db
          .collection("customers")
          .find({
            businessId,
            $or: [
              { name: { $regex: searchQuery, $options: "i" } },
              { mobileNumber: { $regex: searchQuery, $options: "i" } },
              // Case-insensitive search for customer name
              // Add more fields if needed for the search
            ],
          })
          // .hint({ name: 1, mobileNumber: 1 })
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .toArray();
        totalCustomers = await db
          .collection("customers")
          .find({
            businessId,
            $or: [
              { name: { $regex: searchQuery, $options: "i" } },
              { mobileNumber: { $regex: searchQuery, $options: "i" } },
            ],
          })
          // .hint({ name: 1, mobileNumber: 1 })
          .count();
      } else {
        customers = await db
          .collection("customers")
          .find({ businessId })
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .toArray();
        totalCustomers = await db
          .collection("customers")
          .find({ businessId })
          .count();
      }

      const totalPages = Math.ceil(totalCustomers / limit); // Calculate total pages

      return NextResponse.json(
        { data: customers, totalPages, currentPage: page },
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

export async function PUT(req, res) {
  if (req.method === "PUT") {
    const { customerId, businessId, updatedFields } = await req.json();
    const db = await connectDB(req);

    if (!customerId || !businessId || !updatedFields) {
      return NextResponse.json(
        { message: "Invalid data format" },
        { status: 400 }
      );
    }

    try {
      // await db
      //   .collection("customers")
      //   .dropIndex("businessId_1_name_1_mobileNumber_1_createdAt_-1");
      const customer = await db.collection("customers").findOne({
        _id: new ObjectId(customerId),
        businessId,
      });

      if (!customer) {
        return NextResponse.json(
          { message: "Customer not found" },
          { status: 404 }
        );
      }

      // Update fields based on the provided updatedFields object
      const updatedValues = {};

      if (updatedFields.hasOwnProperty("balance")) {
        updatedValues.balance = updatedFields.balance;
      }

      if (updatedFields.hasOwnProperty("name")) {
        updatedValues.name = updatedFields.name;
      }

      if (updatedFields.hasOwnProperty("mobileNumber")) {
        updatedValues.mobileNumber = updatedFields.mobileNumber;
      }

      const updatedResult = await db
        .collection("customers")
        .updateOne(
          { _id: new ObjectId(customerId), businessId },
          { $set: updatedValues }
        );

      if (updatedResult.modifiedCount === 1) {
        return NextResponse.json(
          {
            message: "Customer updated successfully",
            modifiedCount: updatedResult.modifiedCount,
          },
          { status: 200 }
        );
      } else {
        return NextResponse.json(
          {
            message: "No updates were made or changes were found",
            modifiedCount: updatedResult.modifiedCount,
          },
          { status: 404 }
        );
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

export async function DELETE(req, res) {
  if (req.method === "DELETE") {
    const { customerId, businessId } = await req.json();

    if (!customerId || !businessId) {
      return NextResponse.json(
        { message: "Invalid data format" },
        { status: 400 }
      );
    }
    let session;
    try {
      const db = await connectDB(req);
      const client = await getClient();
      // await db
      //   .collection("customers")
      //   .dropIndex("businessId_1_name_1_mobileNumber_1_createdAt_-1");
      // Check if the customer exists
      const customer = await db.collection("customers").findOne({
        _id: new ObjectId(customerId),
        businessId,
      });

      if (!customer) {
        return NextResponse.json(
          { message: "Customer not found" },
          { status: 404 }
        );
      }
      //await deleteCache(businessId);

      // Delete customer and their corresponding transactions
      session = await startTransaction(client);
      const transactions = await db
        .collection("transactions")
        .find({ partyId: customerId, businessId }, { session })
        .toArray();

      const deleteTransactionsResult = await db
        .collection("transactions")
        .deleteMany({ partyId: customerId, businessId }, { session });

      const deleteCustomerResult = await db
        .collection("customers")
        .deleteOne({ _id: new ObjectId(customerId), businessId }, { session });

      if (transactions && transactions.length > 0) {
        try {
          for (const transaction of transactions) {
            const { imageUrl } = transaction;

            for (let i = 0; i < imageUrl?.length; i++) {
              try {
                await deleteImage(imageUrl[i]);
              } catch (error) {
                console.error(`Error deleting image`);
              }
            }
          }
        } catch (error) {
          console.error("Error deleting images:", error);
        }
      }
      await commitTransaction(session);
      return NextResponse.json(
        {
          message:
            "Customer and corresponding transactions deleted successfully",
          deletedCustomerCount: deleteCustomerResult.deletedCount,
          deletedTransactionsCount: deleteTransactionsResult.deletedCount,
        },
        { status: 200 }
      );
    } catch (error) {
      console.log(error);
      await abortTransaction(session);
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

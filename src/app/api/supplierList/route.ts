import { deleteCache } from "@/cache";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

import { connectDB } from "../lib/dbconnection";

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
    const latestCreditTransaction = null;
    const latestDebitTransaction = null;
    const createdAt = new Date();
    try {
      await deleteCache(businessId);
      const result = await db
        .collection("suppliers")
        .insertOne({
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
          message: "Supplier created successfully",
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

    // const { businessId } = await req.json();
    const db = await connectDB(req);

    try {
      let result;
      let totalSuppliers;
      if (searchQuery) {
        result = await db
          .collection("suppliers")
          .find({
            businessId,
            $or: [
              { name: { $regex: searchQuery, $options: "i" } },
              { mobileNumber: { $regex: searchQuery, $options: "i" } },
              // Case-insensitive search for customer name
              // Add more fields if needed for the search
            ],
          })
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .toArray();
        totalSuppliers = await db
          .collection("suppliers")
          .find({
            businessId,
            $or: [
              { name: { $regex: searchQuery, $options: "i" } },
              { mobileNumber: { $regex: searchQuery, $options: "i" } },
            ],
          })
          .count();
      } else {
        result = await db
          .collection("suppliers")
          .find({ businessId })
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .toArray();
        totalSuppliers = await db
          .collection("suppliers")
          .find({ businessId })
          .count();
      }

      const totalPages = Math.ceil(totalSuppliers / limit);
      return NextResponse.json(
        { data: result, totalPages, currentPage: page },
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
    const { supplierId, businessId, updatedFields } = await req.json();
    const db = await connectDB(req);

    if (!supplierId || !businessId || !updatedFields) {
      return NextResponse.json(
        { message: "Invalid data format" },
        { status: 400 }
      );
    }

    try {
      const result = await db.collection("suppliers").findOne({
        _id: new ObjectId(supplierId),
        businessId,
      });

      if (!result) {
        return NextResponse.json(
          { message: "Supplier not found" },
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
        .collection("suppliers")
        .updateOne(
          { _id: new ObjectId(supplierId), businessId },
          { $set: updatedValues }
        );

      if (updatedResult.modifiedCount === 1) {
        return NextResponse.json(
          {
            message: "Supplier updated successfully",
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
    const { supplierId, businessId } = await req.json();
    const db = await connectDB(req);

    if (!supplierId || !businessId) {
      return NextResponse.json(
        { message: "Invalid data format" },
        { status: 400 }
      );
    }

    try {
      // Check if the customer exists
      const result = await db.collection("suppliers").findOne({
        _id: new ObjectId(supplierId),
        businessId,
      });

      if (!result) {
        return NextResponse.json(
          { message: "Supplier not found" },
          { status: 404 }
        );
      }
      await deleteCache(businessId);
      // Delete customer and their corresponding transactions
      const deleteSupplierResult = await db
        .collection("suppliers")
        .deleteOne({ _id: new ObjectId(supplierId), businessId });

      const deleteTransactionsResult = await db
        .collection("transactions")
        .deleteMany({ partyId: supplierId, businessId });

      if (deleteSupplierResult.deletedCount === 1) {
        return NextResponse.json(
          {
            message:
              "Supplier and corresponding transactions deleted successfully",
            deletedSupplierCount: deleteSupplierResult.deletedCount,
            deletedTransactionsCount: deleteTransactionsResult.deletedCount,
          },
          { status: 200 }
        );
      } else {
        return NextResponse.json(
          {
            message: "Supplier not deleted or not found",
            deletedSupplierCount: deleteSupplierResult.deletedCount,
            deletedTransactionsCount: deleteTransactionsResult.deletedCount,
          },
          { status: 200 }
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

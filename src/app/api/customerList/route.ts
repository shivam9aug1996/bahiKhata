import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import { connectDB } from "../lib/dbconnection";

export async function POST(req, res) {
  if (req.method === "POST") {
    // Create a new business
    const { businessId, name, mobileNumber } = await req.json();
    const db = await connectDB();
    // console.log(!name, !primaryKey, typeof primaryKey, typeof name);
    if (!businessId || !name || !mobileNumber) {
      return NextResponse.json(
        { message: "Invalid data format" },
        { status: 400 }
      );
    }
    let balance = 0;

    try {
      const result = await db
        .collection("customers")
        .insertOne({ businessId, name, mobileNumber, balance });

      return NextResponse.json(
        {
          message: "Customer created successfully",
          data: {
            _id: new ObjectId(result?.insertedId),
            businessId,
            name,
            mobileNumber,
            balance,
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

    // const { businessId } = await req.json();
    const db = await connectDB();
    console.log("mjhgf", businessId);
    try {
      let customers;
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
          .toArray();
      } else {
        customers = await db
          .collection("customers")
          .find({ businessId })
          .toArray();
      }
      console.log(customers);

      return NextResponse.json({ data: customers }, { status: 200 });
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
    const db = await connectDB();

    if (!customerId || !businessId || !updatedFields) {
      return NextResponse.json(
        { message: "Invalid data format" },
        { status: 400 }
      );
    }

    try {
      const customer = await db.collection("customers").findOne({
        _id: new ObjectId(customerId),
        businessId,
      });
      console.log(customer);
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
      console.log(updatedResult);
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
    const db = await connectDB();

    if (!customerId || !businessId) {
      return NextResponse.json(
        { message: "Invalid data format" },
        { status: 400 }
      );
    }

    try {
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

      // Delete customer and their corresponding transactions
      const deleteCustomerResult = await db
        .collection("customers")
        .deleteOne({ _id: new ObjectId(customerId), businessId });

      const deleteTransactionsResult = await db
        .collection("transactions")
        .deleteMany({ partyId: customerId, businessId });

      if (deleteCustomerResult.deletedCount === 1) {
        return NextResponse.json(
          {
            message:
              "Customer and corresponding transactions deleted successfully",
            deletedCustomerCount: deleteCustomerResult.deletedCount,
            deletedTransactionsCount: deleteTransactionsResult.deletedCount,
          },
          { status: 200 }
        );
      } else {
        return NextResponse.json(
          {
            message: "Customer not deleted or not found",
            deletedCustomerCount: deleteCustomerResult.deletedCount,
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

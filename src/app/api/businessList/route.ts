import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import { connectDB } from "../lib/dbconnection";

export async function POST(req, res) {
  if (req.method === "POST") {
    // Create a new business
    const { name, primaryKey } = await req.json();
    const db = await connectDB();
    console.log(!name, !primaryKey, typeof primaryKey, typeof name);
    if (!name || typeof primaryKey !== "boolean" || typeof name !== "string") {
      return NextResponse.json(
        { message: "Invalid data format" },
        { status: 400 }
      );
    }

    try {
      if (primaryKey) {
        // Check if there's an existing primary business
        const existingPrimary = await db
          .collection("businesses")
          .findOne({ primaryKey: true });

        if (existingPrimary) {
          // If an existing primary business is found, update its primaryKey to false
          await db
            .collection("businesses")
            .updateOne(
              { _id: new ObjectId(existingPrimary._id) },
              { $set: { primaryKey: false } }
            );
        }
      }
      const result = await db
        .collection("businesses")
        .insertOne({ name, primaryKey });
      return NextResponse.json(
        {
          message: "Business created successfully",
          data: { _id: result?.insertedId, name, primaryKey },
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
    const db = await connectDB();

    try {
      const businesses = await db.collection("businesses").find({}).toArray();

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
    const { id, name, primaryKey } = await req.json();
    const db = await connectDB();

    if (!id || !name || primaryKey === undefined) {
      return NextResponse.json(
        { message: "Invalid data format" },
        { status: 400 }
      );
    }

    try {
      if (primaryKey) {
        // Check if there's an existing primary business
        const existingPrimary = await db
          .collection("businesses")
          .findOne({ primaryKey: true });

        if (existingPrimary) {
          // If an existing primary business is found, update its primaryKey to false
          await db
            .collection("businesses")
            .updateOne(
              { _id: new ObjectId(existingPrimary._id) },
              { $set: { primaryKey: false } }
            );
        }
      }
      const result = await db
        .collection("businesses")
        .updateOne({ _id: new ObjectId(id) }, { $set: { name, primaryKey } });
      return NextResponse.json(
        {
          message: "Business updated successfully",
          data: { name, primaryKey, _id: id },
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
    // Delete a business
    const { id } = await req.json();
    const db = await connectDB();

    if (!id) {
      return NextResponse.json(
        { message: "Invalid data format" },
        { status: 400 }
      );
    }

    try {
      const businessToDelete = await db
        .collection("businesses")
        .findOne({ _id: new ObjectId(id) });

      if (!businessToDelete) {
        return NextResponse.json(
          { message: "Business not found" },
          { status: 404 }
        );
      }

      const isPrimary = businessToDelete?.primaryKey;

      const result = await db
        .collection("businesses")
        .deleteOne({ _id: new ObjectId(id) });

      if (isPrimary) {
        // If the deleted business was primary, find another business and set it as primary
        const updatedBusiness = await db
          .collection("businesses")
          .findOneAndUpdate(
            { _id: { $ne: new ObjectId(id) } }, // Exclude the deleted business
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
        { message: "Business deleted successfully", data: { _id: id } },
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

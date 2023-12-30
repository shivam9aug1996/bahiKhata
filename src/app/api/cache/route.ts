import { ObjectId } from "mongodb";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { connectDB } from "../lib/dbconnection";

export async function POST(req, res) {
  if (req.method === "POST") {
    // Create a new business
    const { cacheId, data } = await req.json();
    const db = await connectDB();
    // console.log(!name, !primaryKey, typeof primaryKey, typeof name);
    if (!cacheId || !data) {
      return NextResponse.json(
        { message: "Invalid data format" },
        { status: 400 }
      );
    }
    const createdAt = new Date();
    try {
      const cacheData = await db.collection("cache").findOne({
        cacheId: cacheId,
      });
      console.log("kjhgfdfghjk", cacheData);
      if (cacheData) {
        const updatedResult = await db
          .collection("cache")
          .updateOne({ _id: cacheData?._id }, { $set: { data } });
        return NextResponse.json(
          {
            message: "Cache updated successfully",
            data: updatedResult,
          },
          { status: 200 }
        );
      } else {
        const result = await db
          .collection("cache")
          .insertOne({ cacheId, data });
        return NextResponse.json(
          {
            message: "Cache created successfully",
            data: {
              _id: new ObjectId(result?.insertedId),
              cacheId,
              data,
              createdAt,
            },
          },
          { status: 201 }
        );
      }
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
    const cacheId = new URL(req.url)?.searchParams?.get("cacheId");

    if (!cacheId) {
      return NextResponse.json(
        { message: "Invalid data format" },
        { status: 400 }
      );
    }
    // const { businessId } = await req.json();
    const db = await connectDB();

    try {
      const cacheData = await db.collection("cache").findOne({ cacheId });

      if (!cacheData) {
        return NextResponse.json(
          { message: "Cache data not found", data: [] },
          { status: 200 }
        );
      }

      return NextResponse.json({ data: cacheData }, { status: 200 });
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
    const { cacheId } = await req.json();
    const db = await connectDB();

    if (!cacheId) {
      return NextResponse.json(
        { message: "Invalid data format" },
        { status: 400 }
      );
    }

    try {
      const cacheData = await db.collection("cache").findOne({
        cacheId: cacheId,
      });
      if (cacheData) {
        console.log("jhgfghjk", cacheData);
        const deleteCustomerResult = await db
          .collection("cache")
          .deleteOne({ cacheId });
      }

      return NextResponse.json(
        {
          message: "Deleted successfully",
        },
        { status: 200 }
      );
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

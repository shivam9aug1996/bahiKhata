import { deleteCache } from "@/cache";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import {
  abortTransaction,
  commitTransaction,
  connectDB,
  getClient,
  startTransaction,
} from "../../lib/dbconnection";
import { deleteImage, uploadImage } from "../../lib/global";
import {
  deleteMultipleImages,
  uploadMultipleImages,
} from "../../lib/globalFun";

export async function GET(req, res) {
  if (req.method === "GET") {
    console.log("kuyfdf");
    // Retrieve all businesses
    const businessId = new URL(req.url).searchParams.get("businessId");
    const partyId = new URL(req.url).searchParams.get("partyId");
    const partyType = new URL(req.url).searchParams.get("partyType");
    const page = parseInt(new URL(req.url)?.searchParams?.get("page") || "1");
    const limit = parseInt(
      new URL(req.url)?.searchParams?.get("limit") || "10"
    );
    const startDate = new URL(req.url)?.searchParams?.get("startDate");
    const endDate = new URL(req.url)?.searchParams?.get("endDate");
    const type = new URL(req.url)?.searchParams?.get("type");
    if (!businessId || !partyId) {
      return NextResponse.json(
        { message: "Invalid data format" },
        { status: 400 }
      );
    }
    let data = {
      businessId,
      partyId,
    };
    if (startDate && !endDate) {
      data = {
        ...data,
        date: {
          $gte: startDate,
        },
      };
    }
    if (endDate && !startDate) {
      data = {
        ...data,
        date: {
          $lte: endDate,
        },
      };
    }
    if (startDate && endDate) {
      data = {
        ...data,
        date: {
          $gte: startDate,
          $lte: endDate,
        },
      };
    }
    if (type) {
      data = {
        ...data,
        type: type,
      };
    }

    // const { businessId } = await req.json();
    const db = await connectDB(req);

    const skip = (page - 1) * limit;
    try {
      let totalTransactions;
      const transactions = await db
        .collection("transactions")
        .find(data)
        .sort({ date: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray();
      totalTransactions = await db
        .collection("transactions")
        .find(data)
        .count();
      const totalPages = Math.ceil(totalTransactions / limit);
      let f;
      console.log("uytrdfghjk", partyType);
      if (partyType == "customer") {
        f = await db
          .collection("customers")
          .findOne({ businessId, _id: new ObjectId(partyId) });
      } else {
        f = await db
          .collection("suppliers")
          .findOne({ businessId, _id: new ObjectId(partyId) });
      }
      let h = await db
        .collection("businesses")
        .findOne({ _id: new ObjectId(businessId) });
      console.log(f);

      return NextResponse.json(
        {
          data: transactions,
          totalPages,
          currentPage: page,
          partyData: f,
          businessData: h,
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

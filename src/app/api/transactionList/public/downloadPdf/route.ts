import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/dbconnection";

export async function GET(req, res) {
  if (req.method === "GET") {
    // Retrieve all businesses
    const businessId = new URL(req.url).searchParams.get("businessId");
    const partyId = new URL(req.url).searchParams.get("partyId");

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

    //const skip = (page - 1) * limit;
    try {
      let totalTransactions = await db
        .collection("transactions")
        .find(data)
        .sort({ date: -1, createdAt: -1 })
        .toArray();

      return NextResponse.json({ data: totalTransactions }, { status: 200 });
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

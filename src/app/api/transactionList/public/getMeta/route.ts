import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/dbconnection";

export async function GET(req, res) {
  if (req.method === "GET") {
    console.log("kuyfdf");
    // Retrieve all businesses
    const businessId = new URL(req.url).searchParams.get("businessId");
    const partyId = new URL(req.url).searchParams.get("partyId");
    const partyType = new URL(req.url).searchParams.get("partyType");

    // const { businessId } = await req.json();
    const db = await connectDB(req);

    try {
      const business = await db
        .collection("businesses")
        .findOne({ _id: new ObjectId(businessId) });
      console.log(business);
      const businessName = business?.name;
      const party = await db
        .collection(partyType === "customer" ? "customers" : "suppliers")
        .findOne({ _id: new ObjectId(partyId) });
      console.log("hgfew234567890-", party);
      const partyName = party?.name;
      if (businessName && partyName) {
        return NextResponse.json(
          { data: { businessName, partyName } },
          { status: 200 }
        );
      } else {
        throw new Error("Something went wrong");
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

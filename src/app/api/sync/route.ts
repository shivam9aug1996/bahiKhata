import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import {
  abortTransaction,
  commitTransaction,
  connectDB,
  getClient,
  startTransaction,
} from "../lib/dbconnection";

export async function POST(req, res) {
  if (req.method === "POST") {
    // Retrieve all businesses
    // const businessId = new URL(req.url).searchParams.get("businessId");
    const { businessId } = await req.json();
    let session;
    try {
      const db = await connectDB(req);
      const client = await getClient();

      const matchStage = businessId
        ? [
            {
              $match: {
                businessId: businessId,
              },
            },
          ]
        : [];

      const groupAndProjectStages = [
        {
          $group: {
            _id: "$partyId",
            partyType: { $first: "$partyType" },
            totalCreditAmount: {
              $sum: {
                $cond: [{ $eq: ["$type", "credit"] }, "$amount", 0],
              },
            },
            totalDebitAmount: {
              $sum: {
                $cond: [{ $eq: ["$type", "debit"] }, "$amount", 0],
              },
            },
          },
        },
        {
          $project: {
            _id: 1,
            partyType: 1,
            totalAmount: {
              $subtract: ["$totalCreditAmount", "$totalDebitAmount"],
            },
          },
        },
      ];

      const aggregationPipeline = [...matchStage, ...groupAndProjectStages];

      const totalTransactions = await db
        .collection("transactions")
        .aggregate(aggregationPipeline)
        .toArray();
      session = await startTransaction(client);
      for (const transaction of totalTransactions) {
        const { _id: partyId, partyType, totalAmount: balance } = transaction;

        await db
          .collection(partyType === "customer" ? "customers" : "suppliers")
          .updateOne(
            { _id: new ObjectId(partyId) },
            { $set: { balance } },
            { session }
          );
      }
      await db.collection("cache").deleteMany({}, { session });

      await commitTransaction(session);
      return NextResponse.json({ message: "data is synced" }, { status: 200 });
    } catch (error) {
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

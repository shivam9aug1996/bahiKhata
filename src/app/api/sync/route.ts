import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import {
  abortTransaction,
  commitTransaction,
  connectDB,
  getClient,
  startTransaction,
} from "../lib/dbconnection";

// Force dynamic rendering since we use cookies
export const dynamic = 'force-dynamic';

export async function POST(req, res) {
  if (req.method === "POST") {
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

      session = await startTransaction(client);

      const totalTransactions = await db
        .collection("transactions")
        .aggregate(aggregationPipeline, { session })
        .toArray();
      console.log("kjhgfhjhfdfghj", totalTransactions);

      for (const transaction of totalTransactions) {
        const { _id: partyId, partyType, totalAmount: balance } = transaction;

        const latestCreditTransaction = await db
          .collection("transactions")
          .find({ partyId, type: "credit", partyType }, { session })
          .sort({ date: -1, createdAt: -1 })
          .limit(1)
          .toArray();

        const latestDebitTransaction = await db
          .collection("transactions")
          .find({ partyId, type: "debit" }, { session })
          .sort({ date: -1, createdAt: -1 })
          .limit(1)
          .toArray();

        await db
          .collection(partyType === "customer" ? "customers" : "suppliers")
          .updateOne(
            { _id: new ObjectId(partyId) },
            {
              $set: {
                balance,
                latestCreditTransaction: latestCreditTransaction[0] || null,
                latestDebitTransaction: latestDebitTransaction[0] || null,
              },
            },
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

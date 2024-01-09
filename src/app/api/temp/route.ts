import { deleteCache, getCache, setCache } from "@/cache";
import { isTokenVerified } from "@/json";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import {
  abortTransaction,
  commitTransaction,
  connectDB,
  getClient,
  startSession,
  startTransaction,
} from "../lib/dbconnection";
import { deleteImage } from "../lib/global";

export async function GET(req, res) {
  if (req.method === "GET") {
    // const userId = new URL(req.url)?.searchParams?.get("userId");
    // if (!userId) {
    //   return NextResponse.json(
    //     { message: "Invalid data format" },
    //     { status: 400 }
    //   );
    // }
    // // Retrieve all businesses
    let session;
    try {
      const db = await connectDB(req);
      const client = await getClient();
      session = await startTransaction(client);
      const allCustomers = await db
        .collection("suppliers")
        .find({}, { session })
        .toArray();

      // Assuming you have fetched customers and transactions data from your database

      // Iterate through each customer
      for (const customer of allCustomers) {
        const customerId = customer?._id?.toString();
        // console.log(customerId);
        // Find the latest credit transaction for the customer
        const latestCreditTransaction = await db
          .collection("transactions")
          .find(
            {
              partyId: customerId,
              type: "credit",
            },
            { session }
          )
          .sort({ date: -1, createdAt: -1 })
          .limit(1)
          .toArray();

        // Find the latest debit transaction for the customer
        const latestDebitTransaction = await db
          .collection("transactions")
          .find(
            {
              partyId: customerId,
              type: "debit",
            },
            { session }
          )
          .sort({ date: -1, createdAt: -1 })
          .limit(1)
          .toArray();

        console.log(new ObjectId(customerId));
        //Update the customer document with the latest transactions
        await db.collection("suppliers").updateOne(
          { _id: new ObjectId(customerId) }, // Assuming "_id" is the customer ID field
          {
            $set: {
              latestCreditTransaction: latestCreditTransaction[0] || null,
              latestDebitTransaction: latestDebitTransaction[0] || null,
            },
          },
          { session }
        );
      }
      await commitTransaction(session);

      // After updating all customers, you might want to re-fetch the updated customer data.
      // const updatedCustomers = await db
      //   .collection("customers")
      //   .find({})
      //   .toArray();

      return NextResponse.json({ data: [] }, { status: 200 });
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

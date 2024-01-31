import { deleteCache } from "@/cache";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import { connectDB } from "../../lib/dbconnection";

export async function GET(req, res) {
  if (req.method === "GET") {
    // Create a new business
    // let { businessId, partyId, amount, type, description, date, partyType } =
    //   await req.json();
    try {
      const db = await connectDB(req);
      let partyId = "657dcf4ca2e64b7c5a02b6e5";
      let businessId = "6593bf2527ab5f761bb0bfd0";
      let partyType = "customer";

      const createdAt = new Date();
      // for (let k = 1; k <= 36; k++) {
      //   try {
      //     const result = await db.collection("transactions").insertOne({
      //       partyId,
      //       businessId,
      //       amount: 450 + k * 16,
      //       type: k % 4 == 0 ? "credit" : "debit",
      //       partyType,
      //       description: "",
      //       date: "2023/12/13",

      //       createdAt,
      //     });

      //     const allTransactions = await db
      //       .collection("transactions")
      //       .find({ partyId, businessId, partyType })
      //       .toArray();

      //     // Calculate the balance based on all transactions
      //     let balance = 0;
      //     allTransactions?.forEach((transaction) => {
      //       if (transaction?.type === "credit") {
      //         balance += transaction?.amount;
      //       } else if (transaction?.type === "debit") {
      //         balance -= transaction?.amount;
      //       }
      //     });

      //     // Update the customer's balance directly in the customer collection
      //     await db
      //       .collection(partyType == "customer" ? "customers" : "suppliers")
      //       .updateOne(
      //         { _id: new ObjectId(partyId), businessId },
      //         { $set: { balance } }
      //       );
      //   } catch (error) {
      //     return NextResponse.json(
      //       { message: "Something went wrong" },
      //       { status: 500 }
      //     );
      //   }
      // }
      await deleteCache(businessId);
      // for (let k = 1; k <= 10000; k++) {
      //   const result = await db.collection("customers").insertOne({
      //     businessId,
      //     name: `delete test ${k + 4005}`,
      //     mobileNumber: "9634396572",
      //     balance: 0,
      //     createdAt,
      //     latestCreditTransaction: null,
      //     latestDebitTransaction: null,
      //   });
      // }

      return NextResponse.json(
        {
          message: "Customer created successfully",
        },
        { status: 201 }
      );
    } catch (error) {
      console.log("error", error);
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

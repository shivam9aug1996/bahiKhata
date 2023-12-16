import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import { connectDB } from "../lib/dbconnection";

// export async function GET(req, res) {
//   if (req.method === "GET") {
//     try {
//       const db = await connectDB(); // Replace with your database connection function

//       // Generating 500 customers for each business
//       for (let k = 1; k <= 2; k++) {
//         await fetch("http://localhost:3000/api/transactionList", {
//           method: "POST",
//           body: {
//             partyId: "657dc43ea2e64b7c5a02ab85",
//             businessId: "657dbec8b7e9f5a8742a149b",
//             amount: 500 + k * 20,
//             type: k % 3 == 0 ? "debit" : "credit",
//             partyType: "customers",
//           },
//         });
//       }
//       return NextResponse.json({ message: "success" }, { status: 200 });

//       // Generating 1000 suppliers for each business
//     } catch (error) {
//       console.log(error);
//       return NextResponse.json(
//         { message: "Something went wrong" },
//         { status: 500 }
//       );
//     }
//   }
// }

export async function POST(req, res) {
  if (req.method === "POST") {
    // Create a new business
    // let { businessId, partyId, amount, type, description, date, partyType } =
    //   await req.json();
    const db = await connectDB();
    let partyId = "657dcf4ca2e64b7c5a02b6e5";
    let businessId = "657dcef1d148e40e4626617e";
    let partyType = "customer";
    // console.log(!name, !primaryKey, typeof primaryKey, typeof name);
    // if (!businessId || !partyId || !partyType || amount < 0 || !amount) {
    //   return NextResponse.json(
    //     { message: "Invalid data format" },
    //     { status: 400 }
    //   );
    // }
    const createdAt = new Date();
    for (let k = 1; k <= 36; k++) {
      try {
        const result = await db.collection("transactions").insertOne({
          partyId,
          businessId,
          amount: 450 + k * 16,
          type: k % 4 == 0 ? "credit" : "debit",
          partyType,
          description: "",
          date: "2023/12/13",

          createdAt,
        });
        console.log("mjhgfdfghjk", result);
        const allTransactions = await db
          .collection("transactions")
          .find({ partyId, businessId, partyType })
          .toArray();

        // Calculate the balance based on all transactions
        let balance = 0;
        allTransactions?.forEach((transaction) => {
          if (transaction?.type === "credit") {
            balance += transaction?.amount;
          } else if (transaction?.type === "debit") {
            balance -= transaction?.amount;
          }
        });

        // Update the customer's balance directly in the customer collection
        await db
          .collection(partyType == "customer" ? "customers" : "suppliers")
          .updateOne(
            { _id: new ObjectId(partyId), businessId },
            { $set: { balance } }
          );
      } catch (error) {
        return NextResponse.json(
          { message: "Something went wrong" },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      {
        message: "Transaction created successfully",
      },
      { status: 201 }
    );
  } else {
    return NextResponse.json(
      { message: "Method Not Allowed" },
      { status: 405 }
    );
  }
}

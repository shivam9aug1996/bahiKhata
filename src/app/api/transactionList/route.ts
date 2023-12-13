import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import { connectDB } from "../lib/dbconnection";

export async function POST(req, res) {
  if (req.method === "POST") {
    // Create a new business
    let { businessId, partyId, amount, type, description, date, partyType } =
      await req.json();
    const db = await connectDB();
    // console.log(!name, !primaryKey, typeof primaryKey, typeof name);
    if (!businessId || !partyId || !partyType) {
      return NextResponse.json(
        { message: "Invalid data format" },
        { status: 400 }
      );
    }

    try {
      const result = await db.collection("transactions").insertOne({
        partyId,
        businessId,
        amount,
        type,
        description,
        date,
        partyType,
      });

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

      // // Calculate credit and debit totals
      // const creditTotal = type === "credit" ? amount : 0;
      // const debitTotal = type === "debit" ? amount : 0;

      // // Update customer's balance based on the transaction
      // await db
      //   .collection("customers")
      //   .updateOne(
      //     { _id: new ObjectId(partyId), businessId },
      //     { $inc: { balance: creditTotal - debitTotal } }
      //   );
      // const updatedCustomer = await db
      //   .collection("customers")
      //   .findOne({ _id: new ObjectId(partyId), businessId });
      // console.log("updatedCustomer", updatedCustomer);

      return NextResponse.json(
        {
          message: "Transaction created successfully",
          data: {
            _id: new ObjectId(result?.insertedId),
            businessId,
            partyId,
            amount,
            type,
            balance: balance,
            date,
            description,
            partyType,
          },
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
    const businessId = new URL(req.url).searchParams.get("businessId");
    const partyId = new URL(req.url).searchParams.get("partyId");
    // const { businessId } = await req.json();
    const db = await connectDB();
    console.log("mjhgf", businessId);
    try {
      const transactions = await db
        .collection("transactions")
        .find({ businessId, partyId })
        .toArray();
      return NextResponse.json({ data: transactions }, { status: 200 });
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
    const { transactionId, businessId, partyId, updatedFields, partyType } =
      await req.json();
    const db = await connectDB();
    console.log({
      transactionId,
      businessId,
      partyId,
      updatedFields,
      partyType,
    });
    if (
      !transactionId ||
      !businessId ||
      !partyId ||
      !updatedFields ||
      !partyType
    ) {
      return NextResponse.json(
        { message: "Invalid data format" },
        { status: 400 }
      );
    }

    try {
      const transaction = await db.collection("transactions").findOne({
        _id: new ObjectId(transactionId),
        businessId,
        partyId,
        partyType,
      });

      if (!transaction) {
        return NextResponse.json(
          { message: "Transaction not found" },
          { status: 404 }
        );
      }

      // Update fields based on the provided updatedFields object
      const updatedValues = {};

      if (updatedFields.hasOwnProperty("amount")) {
        updatedValues.amount = updatedFields.amount;
      }

      if (updatedFields.hasOwnProperty("type")) {
        updatedValues.type = updatedFields.type;
      }
      if (updatedFields.hasOwnProperty("description")) {
        updatedValues.description = updatedFields.description;
      }
      if (updatedFields.hasOwnProperty("date")) {
        updatedValues.date = updatedFields.date;
      }

      // Update transaction fields
      const updatedResult = await db
        .collection("transactions")
        .updateOne(
          { _id: new ObjectId(transactionId), businessId },
          { $set: updatedValues }
        );

      if (updatedResult.modifiedCount === 1) {
        // If amount or type updated, calculate credit/debit and update customer's balance
        if (
          updatedFields.hasOwnProperty("amount") ||
          updatedFields.hasOwnProperty("type")
        ) {
          const allTransactions = await db
            .collection("transactions")
            .find({ partyId, businessId })
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

          // const creditTotal =
          //   updatedTransaction.type === "credit"
          //     ? updatedTransaction.amount
          //     : 0;
          // const debitTotal =
          //   updatedTransaction.type === "debit" ? updatedTransaction.amount : 0;

          // await db
          //   .collection("customers")
          //   .updateOne(
          //     { _id: new ObjectId(updatedTransaction.partyId), businessId },
          //     { $inc: { balance: creditTotal - debitTotal } }
          //   );
        }

        return NextResponse.json(
          { message: "Transaction updated successfully" },
          { status: 200 }
        );
      } else {
        return NextResponse.json(
          { message: "No changes made or transaction not found" },
          { status: 304 }
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

export async function DELETE(req, res) {
  if (req.method === "DELETE") {
    const { transactionId, businessId, partyId, partyType } = await req.json();
    const db = await connectDB();

    if (!transactionId || !businessId || !partyId || !partyType) {
      return NextResponse.json(
        { message: "Invalid data format" },
        { status: 400 }
      );
    }

    try {
      const deletedTransaction = await db
        .collection("transactions")
        .findOneAndDelete({
          _id: new ObjectId(transactionId),
          businessId,
          partyId,
        });
      console.log("jhgfghjkjhghjk", deletedTransaction);
      if (!deletedTransaction?._id) {
        return NextResponse.json(
          { message: "Transaction not found" },
          { status: 404 }
        );
      }

      // Calculate the balance after deleting the transaction
      const allTransactions = await db
        .collection("transactions")
        .find({ partyId, businessId })
        .toArray();

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

      return NextResponse.json(
        { message: "Transaction deleted successfully" },
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

import { deleteCache } from "@/cache";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import {
  abortTransaction,
  commitTransaction,
  connectDB,
  getClient,
  startTransaction,
} from "../lib/dbconnection";
import { deleteImage, uploadImage } from "../lib/global";
import { deleteMultipleImages, uploadMultipleImages } from "../lib/globalFun";

// Force dynamic rendering since we use cookies
export const dynamic = 'force-dynamic';

export async function POST(req, res) {
  if (req.method === "POST") {
    // Create a new business
    // let { businessId, partyId, amount, type, description, date, partyType } =
    //   await req.json();

    const formData = await req?.formData(); // Parse the FormData object
    const businessId = formData?.get("businessId");
    const partyId = formData?.get("partyId");
    let amount = formData?.get("amount");
    amount = parseFloat(amount);
    const type = formData?.get("type");

    const description = formData?.get("description");
    const date = formData?.get("date");
    const partyType = formData?.get("partyType");
    const imageFile = formData?.getAll("images[]"); // Get the uploaded image file

    if (
      !businessId ||
      !partyId ||
      !partyType ||
      amount <= 0 ||
      !amount ||
      !date
    ) {
      return NextResponse.json(
        { message: "Invalid data format" },
        { status: 400 }
      );
    }
    const createdAt = new Date();
    let session;
    let imageUrl;
    try {
      await deleteCache(businessId);
      const db = await connectDB(req);
      const client = await getClient();

      session = await startTransaction(client);
      imageUrl = await uploadMultipleImages(imageFile);

      const result = await db.collection("transactions").insertOne(
        {
          partyId,
          businessId,
          amount,
          type,
          description,
          date,
          partyType,
          createdAt,
          imageUrl,
        },
        { session }
      );

      const allTransactions = await db
        .collection("transactions")
        .find({ partyId, businessId, partyType }, { session })
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

      const latestCreditTransaction = await db
        .collection("transactions")
        .find({ partyId, businessId, type: "credit" }, { session })
        .sort({ date: -1, createdAt: -1 })
        .limit(1)
        .toArray();

      const latestDebitTransaction = await db
        .collection("transactions")
        .find({ partyId, businessId, type: "debit" }, { session })
        .sort({ date: -1, createdAt: -1 })
        .limit(1)
        .toArray();

      // Update the customer's balance directly in the customer collection
      await db
        .collection(partyType == "customer" ? "customers" : "suppliers")
        .updateOne(
          { _id: new ObjectId(partyId), businessId },
          {
            $set: {
              balance,
              latestCreditTransaction: latestCreditTransaction[0] || null,
              latestDebitTransaction: latestDebitTransaction[0] || null,
            },
          },
          { session }
        );
      await commitTransaction(session);
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
            createdAt,
            imageUrl,
          },
        },
        { status: 201 }
      );
    } catch (error) {
      await deleteMultipleImages(imageUrl);
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

export async function GET(req, res) {
  if (req.method === "GET") {
    // Retrieve all businesses
    const businessId = new URL(req.url).searchParams.get("businessId");
    const partyId = new URL(req.url).searchParams.get("partyId");
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
      return NextResponse.json(
        { data: transactions, totalPages, currentPage: page },
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

export async function PUT(req, res) {
  if (req.method === "PUT") {
    // const { transactionId, businessId, partyId, updatedFields, partyType } =
    //   await req.json();
    const formData = await req?.formData(); // Parse the FormData object
    const businessId = formData?.get("businessId");
    const transactionId = formData?.get("transactionId");
    const partyId = formData?.get("partyId");
    const updatedFields1 = formData?.get("updatedFields");

    const partyType = formData?.get("partyType");
    const updatedFields = JSON.parse(updatedFields1);

    let imageArray = [];
    for (let i = 0; i < formData.get("imageCount"); i++) {
      const id = formData.get(`images[id][${i}]`);
      const type = formData.get(`images[type][${i}]`);
      const imageUrl = formData.get(`images[image][${i}]`);

      // Create an object representing each image
      const imageObject = {
        id: id,
        type: type,
        imageUrl: imageUrl,
      };

      imageArray.push(imageObject);
    }

    if (
      !transactionId ||
      !businessId ||
      !partyId ||
      !updatedFields ||
      updatedFields?.amount <= 0 ||
      !partyType
    ) {
      return NextResponse.json(
        { message: "Invalid data format" },
        { status: 400 }
      );
    }
    let session;
    let imageUrl;
    try {
      const db = await connectDB(req);
      const client = await getClient();
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
      await deleteCache(businessId);

      // Update fields based on the provided updatedFields object
      const updatedValues = {};
      imageUrl = [];
      console.log("imageArray", imageArray);

      for (let i = 0; i < imageArray.length; i++) {
        if (imageArray[i]?.type == "add") {
          try {
            const data = await uploadImage(imageArray[i]?.imageUrl);
            if (data) {
              imageUrl.push(data);
            }
          } catch (error) {
            console.error(`Error uploading image`);
          }
        } else if (imageArray[i]?.type == "delete") {
          try {
            await deleteImage(imageArray[i]?.imageUrl);
          } catch (error) {
            console.error(`Error deleting image`);
          }
        } else if (imageArray[i]?.type == "edit") {
          imageUrl.push(imageArray[i]?.imageUrl);
        }
      }
      if (updatedFields.hasOwnProperty("amount")) {
        updatedValues.amount = parseFloat(updatedFields.amount);
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

      updatedValues.imageUrl = imageUrl;

      session = await startTransaction(client);

      // Update transaction fields
      const updatedResult = await db
        .collection("transactions")
        .updateOne(
          { _id: new ObjectId(transactionId), businessId },
          { $set: updatedValues },
          { session }
        );

      if (updatedResult.modifiedCount === 1) {
        // If amount or type updated, calculate credit/debit and update customer's balance
        if (
          updatedFields.hasOwnProperty("amount") ||
          updatedFields.hasOwnProperty("type")
        ) {
          const allTransactions = await db
            .collection("transactions")
            .find({ partyId, businessId }, { session })
            .toArray();

          const latestCreditTransaction = await db
            .collection("transactions")
            .find({ partyId, businessId, type: "credit" }, { session })
            .sort({ date: -1, createdAt: -1 })
            .limit(1)
            .toArray();

          const latestDebitTransaction = await db
            .collection("transactions")
            .find({ partyId, businessId, type: "debit" }, { session })
            .sort({ date: -1, createdAt: -1 })
            .limit(1)
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

        await commitTransaction(session);
        return NextResponse.json(
          { message: "Transaction updated successfully" },
          { status: 200 }
        );
      } else {
        await commitTransaction(session);
        return NextResponse.json(
          { message: "No updates were made or changes were found" },
          { status: 404 }
        );
      }
    } catch (error) {
      console.log("error", error);
      await deleteImage(imageUrl);
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

export async function DELETE(req, res) {
  if (req.method === "DELETE") {
    const { transactionId, businessId, partyId, partyType } = await req.json();

    if (!transactionId || !businessId || !partyId || !partyType) {
      return NextResponse.json(
        { message: "Invalid data format" },
        { status: 400 }
      );
    }
    let session;

    try {
      const db = await connectDB(req);
      const client = await getClient();
      console.log("393", client?.topology?.s?.id);
      // session = await client?.startSession();
      // console.log("session started");
      const transaction = await db
        .collection("transactions")
        .findOne({ _id: new ObjectId(transactionId), businessId, partyId });
      if (!transaction) {
        return NextResponse.json(
          { message: "Transaction not found" },
          { status: 400 }
        );
      }
      await deleteCache(businessId);
      const { imageUrl } = transaction;

      session = await startTransaction(client);
      const deletedTransaction = await db
        .collection("transactions")
        .findOneAndDelete(
          {
            _id: new ObjectId(transactionId),
            businessId,
            partyId,
          },
          { session }
        );

      if (!deletedTransaction?._id) {
        await commitTransaction(session);
        return NextResponse.json(
          { message: "Transaction not found" },
          { status: 404 }
        );
      }

      // Calculate the balance after deleting the transaction
      const allTransactions = await db
        .collection("transactions")
        .find({ partyId, businessId }, { session })
        .toArray();

      const latestCreditTransaction = await db
        .collection("transactions")
        .find({ partyId, businessId, type: "credit" }, { session })
        .sort({ date: -1, createdAt: -1 })
        .limit(1)
        .toArray();

      const latestDebitTransaction = await db
        .collection("transactions")
        .find({ partyId, businessId, type: "debit" }, { session })
        .sort({ date: -1, createdAt: -1 })
        .limit(1)
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

      console.log("transaction started");
      await db
        .collection(partyType == "customer" ? "customers" : "suppliers")
        .updateOne(
          { _id: new ObjectId(partyId), businessId },
          {
            $set: {
              balance,
              latestCreditTransaction: latestCreditTransaction[0] || null,
              latestDebitTransaction: latestDebitTransaction[0] || null,
            },
          },
          { session }
        );
      await deleteMultipleImages(imageUrl);
      await commitTransaction(session);

      return NextResponse.json(
        { message: "Transaction deleted successfully" },
        { status: 200 }
      );
    } catch (error) {
      console.log(error);
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

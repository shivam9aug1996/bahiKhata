import { deleteCache } from "@/cache";
import { ObjectId } from "mongodb";
import { verifyToken } from "@/json";
import { NextResponse } from "next/server";
import {
  abortTransaction,
  commitTransaction,
  connectDB,
  startTransaction,
} from "../../lib/dbconnection";
import { deleteMultipleImages } from "../../lib/globalFun";

export const dynamic = "force-dynamic";

const isValidDate = (value: any) =>
  typeof value === "string" &&
  /^\d{4}-\d{2}-\d{2}$/.test(value) &&
  !Number.isNaN(new Date(value).getTime());

const buildFilter = ({ businessId, partyId, partyType, filters = {} }: any) => {
  const query: any = { businessId, partyId, partyType };
  if (filters.type) {
    if (!["credit", "debit"].includes(filters.type)) {
      throw new Error("Invalid transaction type");
    }
    query.type = filters.type;
  }
  if (filters.startDate || filters.endDate) {
    if (
      (filters.startDate && !isValidDate(filters.startDate)) ||
      (filters.endDate && !isValidDate(filters.endDate)) ||
      (filters.startDate && filters.endDate && filters.startDate > filters.endDate)
    ) {
      throw new Error("Invalid date range");
    }
    query.date = {};
    if (filters.startDate) query.date.$gte = filters.startDate;
    if (filters.endDate) query.date.$lte = filters.endDate;
  }
  return query;
};

export async function POST(req: any) {
  let session;
  try {
    const body = await req.json();
    const { action, businessId, partyId, partyType } = body || {};
    if (
      !["select", "delete"].includes(action) ||
      !businessId ||
      !ObjectId.isValid(businessId) ||
      !partyId ||
      !ObjectId.isValid(partyId) ||
      !["customer", "supplier"].includes(partyType)
    ) {
      return NextResponse.json({ message: "Invalid data format" }, { status: 400 });
    }

    const token = req.cookies?.get("bahi_khata_user_token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Authentication failed" }, { status: 401 });
    }
    const isValidToken = await verifyToken(token, req);
    if (!isValidToken) {
      return NextResponse.json({ message: "Authentication failed" }, { status: 401 });
    }
    const decoded: any = JSON.parse(
      Buffer.from(token.split(".")[1], "base64url").toString("utf8")
    );
    if (!decoded?.id || !ObjectId.isValid(decoded.id.toString())) {
      return NextResponse.json({ message: "Authentication failed" }, { status: 401 });
    }

    const db = await connectDB(req);
    if (!db) {
      return NextResponse.json({ message: "Authentication failed" }, { status: 401 });
    }

    const ownedBusiness = await db.collection("businesses").findOne({
      _id: new ObjectId(businessId),
      userId: decoded.id.toString(),
    });
    if (!ownedBusiness) {
      return NextResponse.json({ message: "Business not found" }, { status: 404 });
    }

    const partyCollection = partyType === "customer" ? "customers" : "suppliers";
    const party = await db.collection(partyCollection).findOne({
      _id: new ObjectId(partyId),
      businessId,
    });
    if (!party) {
      return NextResponse.json({ message: "Party not found" }, { status: 404 });
    }

    if (action === "select") {
      let filter;
      try {
        filter = buildFilter(body);
      } catch (error) {
        return NextResponse.json(
          { message: (error as Error).message },
          { status: 400 }
        );
      }
      const matches = await db
        .collection("transactions")
        .find(filter, { projection: { _id: 1 } })
        .toArray();
      return NextResponse.json({
        ids: matches.map((item: any) => item._id.toString()),
        count: matches.length,
      });
    }

    const transactionIds = Array.isArray(body.transactionIds)
      ? Array.from(new Set(body.transactionIds as string[]))
      : [];
    if (
      transactionIds.length === 0 ||
      transactionIds.some((id) => typeof id !== "string" || !ObjectId.isValid(id))
    ) {
      return NextResponse.json(
        { message: "Select at least one valid transaction" },
        { status: 400 }
      );
    }

    const scope: any = {
      businessId,
      partyId,
      partyType,
      _id: { $in: transactionIds.map((id: string) => new ObjectId(id)) },
    };
    const transactions = await db.collection("transactions").find(scope).toArray();
    if (transactions.length !== transactionIds.length) {
      return NextResponse.json(
        { message: "Some selected transactions are no longer available. Refresh and try again." },
        { status: 409 }
      );
    }

    await deleteCache(businessId);
    session = await startTransaction();
    const result = await db.collection("transactions").deleteMany(scope, { session });
    if (result.deletedCount !== transactionIds.length) {
      throw new Error("Not all selected transactions could be deleted");
    }

    const remaining = await db
      .collection("transactions")
      .find({ businessId, partyId, partyType }, { session })
      .toArray();
    let balance = 0;
    for (const transaction of remaining) {
      if (transaction.type === "credit") balance += Number(transaction.amount) || 0;
      if (transaction.type === "debit") balance -= Number(transaction.amount) || 0;
    }

    const [latestCreditTransaction, latestDebitTransaction] = await Promise.all([
      db
        .collection("transactions")
        .find({ businessId, partyId, partyType, type: "credit" }, { session })
        .sort({ date: -1, createdAt: -1 })
        .limit(1)
        .next(),
      db
        .collection("transactions")
        .find({ businessId, partyId, partyType, type: "debit" }, { session })
        .sort({ date: -1, createdAt: -1 })
        .limit(1)
        .next(),
    ]);

    await db
      .collection(partyType === "customer" ? "customers" : "suppliers")
      .updateOne(
        { _id: new ObjectId(partyId), businessId },
        {
          $set: {
            balance,
            latestCreditTransaction: latestCreditTransaction || null,
            latestDebitTransaction: latestDebitTransaction || null,
          },
        },
        { session }
      );

    await commitTransaction(session);
    session = null;
    const images = transactions.flatMap((transaction: any) => transaction.imageUrl || []);
    await deleteMultipleImages(images);

    return NextResponse.json({
      message: "Transactions deleted successfully",
      deletedCount: result.deletedCount,
      balance,
    });
  } catch (error) {
    await abortTransaction(session);
    console.error("Bulk transaction action failed:", error);
    return NextResponse.json(
      { message: (error as Error).message || "Something went wrong" },
      { status: 500 }
    );
  }
}

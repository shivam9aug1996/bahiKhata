import cache from "@/cache";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import { connectDB } from "../../lib/dbconnection";

export async function GET(req, res) {
  if (req.method === "GET") {
    const businessId = new URL(req.url)?.searchParams?.get("businessId");
    if (!businessId) {
      return NextResponse.json(
        { message: "Invalid data format" },
        { status: 400 }
      );
    }
    let hasCache = await cache.hasCache(businessId);
    let cachedData = await cache.getFromCache(businessId);
    if (hasCache) {
      return NextResponse.json(
        {
          ...cachedData,
          cache: hasCache,
        },
        { status: 200 }
      );
    }
    try {
      const db = await connectDB();
      const business = await db
        .collection("businesses")
        .findOne({ _id: new ObjectId(businessId) });

      if (!business) {
        return NextResponse.json(
          {
            message: "Business not found",
            data: {
              totalCustomers: 0,
              totalSuppliers: 0,
              customerPositiveBalance: 0,
              customerNegativeBalance: 0,
              supplierPositiveBalance: 0,
              supplierNegativeBalance: 0,
            },
          },
          { status: 200 }
        );
      }

      const totalCustomers = await db
        .collection("customers")
        .find({ businessId })
        .count();

      const totalSuppliers = await db
        .collection("suppliers")
        .find({ businessId })
        .count();

      // Calculate total balance of all customers
      const customers = await db
        .collection("customers")
        .find({ businessId })
        .toArray();

      const customerPositiveBalance = getBalanceSum(customers, "positive");
      const customerNegativeBalance = getBalanceSum(customers, "negative");

      // Calculate total balance of all suppliers
      const suppliers = await db
        .collection("suppliers")
        .find({ businessId })
        .toArray();

      const supplierPositiveBalance = getBalanceSum(suppliers, "positive");
      const supplierNegativeBalance = getBalanceSum(suppliers, "negative");

      const aggregatedData = {
        totalCustomers,
        totalSuppliers,
        customerPositiveBalance,
        customerNegativeBalance,
        supplierPositiveBalance,
        supplierNegativeBalance,
      };
      cache.setToCache(businessId, aggregatedData);

      return NextResponse.json(aggregatedData, { status: 200 });
      //}
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

const getBalanceSum = (data = [], balanceType) => {
  return data.reduce((accumulator, currentValue) => {
    if (balanceType === "positive") {
      return (
        accumulator + (currentValue?.balance > 0 ? currentValue?.balance : 0)
      );
    } else if (balanceType === "negative") {
      return (
        accumulator + (currentValue?.balance < 0 ? currentValue?.balance : 0)
      );
    }
    return accumulator;
  }, 0);
};

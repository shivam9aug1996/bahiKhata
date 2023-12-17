import { NextResponse } from "next/server";
import { connectDB } from "../../lib/dbconnection";

// Variable to store the cached data
let cachedData = {};

export async function GET(req, res) {
  if (req.method === "GET") {
    const businessId = new URL(req.url)?.searchParams?.get("businessId");

    try {
      // Check if data is already cached
      if (cachedData[businessId]) {
        console.log("9876543edfghj");
        return NextResponse.json(cachedData[businessId], { status: 200 });
      } else {
        const db = await connectDB();

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

        // Cache the data
        cachedData[businessId] = aggregatedData;

        return NextResponse.json(aggregatedData, { status: 200 });
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

export function invalidateCache(businessId) {
  delete cachedData[businessId];
}

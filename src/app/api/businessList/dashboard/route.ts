import { NextResponse } from "next/server";
import {
  getFromCache,
  isObjectEmpty,
  setToCache,
} from "../../lib/dashboardCacheData";
import { connectDB } from "../../lib/dbconnection";

export async function GET(req, res) {
  if (req.method === "GET") {
    const businessId = new URL(req.url)?.searchParams?.get("businessId");
    // let cachedData = getFromCache(businessId);

    // // Check if the cached data exists for the specific businessId
    // if (!isObjectEmpty(cachedData)) {
    //   console.log("87654567ughj", cachedData);
    //   // Return the cached data if available
    //   return NextResponse.json(cachedData, { status: 200 });
    // }

    // If no cached data exists, perform database operations
    const db = await connectDB();

    try {
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

      // Calculate total balance of all suppliers (assuming a similar 'balance' field exists for suppliers)
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

      //setToCache(businessId, aggregatedData); // Cache the data

      // Return the aggregated data
      return NextResponse.json(aggregatedData, { status: 200 });
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

import { NextResponse } from "next/server";
import { connectDB } from "../../lib/dbconnection";

export async function GET(req, res) {
  if (req.method === "GET") {
    const businessId = new URL(req.url)?.searchParams?.get("businessId");
    // Connect to the database and perform necessary operations
    const db = await connectDB();

    try {
      // Retrieve total count of customers and suppliers based on businessId
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

      // Return the aggregated data
      return NextResponse.json(
        {
          totalCustomers,
          totalSuppliers,
          customerPositiveBalance,
          customerNegativeBalance,
          supplierPositiveBalance,
          supplierNegativeBalance,
        },
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

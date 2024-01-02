import React, { useEffect } from "react";
import { useCreateBusinessMutation } from "../redux/features/businessSlice";
import { useCreateCustomerMutation } from "../redux/features/customerSlice";
import { useCreateSupplierMutation } from "../redux/features/supplierSlice";
import { useCreateTransactionMutation } from "../redux/features/transactionSlice";

const GenerateData = () => {
  const [
    createBusiness,
    {
      isSuccess: isCreateBusinessSuccess,
      isLoading: isCreateBusinessLoading,
      isError: isCreateBusinessError,
      error: createBusinessError,
      data: createBusinessData,
    },
  ] = useCreateBusinessMutation();

  const [
    createCustomer,
    {
      isSuccess: isCreateCustomerSuccess,
      isLoading: isCreateCustomerLoading,
      isError: isCreateCustomerError,
      error: createCustomerError,
      data: createCustomerData,
    },
  ] = useCreateCustomerMutation();

  const [
    createTransaction,
    {
      isSuccess: isCreateTransactionSuccess,
      isLoading: isCreateTransactionLoading,
      isError: isCreateTransactionError,
      error: createTransactionError,
      data: createTransactionData,
    },
  ] = useCreateTransactionMutation();

  const [
    createSupplier,
    {
      isSuccess: isCreateSupplierSuccess,
      isLoading: isCreateSupplierLoading,
      isError: isCreateSupplierError,
      error: createSupplierError,
      data: createSupplierData,
    },
  ] = useCreateSupplierMutation();

  function generateRandomDate() {
    const year = 2023;
    const month = Math.floor(Math.random() * 12) + 1; // Random month between 1 and 12
    const day = Math.floor(Math.random() * 31) + 1; // Random day between 1 and 31 (considering all months)

    // Formatting the date components with leading zeroes if needed
    const formattedMonth = String(month).padStart(2, "0");
    const formattedDay = String(day).padStart(2, "0");

    const randomDate = `${year}-${formattedMonth}-${formattedDay}`;
    return randomDate;
  }

  function generateRandomNumber(min1 = 100, max1 = 1000, multiple1 = 100) {
    const min = min1;
    const max = max1;
    const multiple = multiple1;

    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    return Math.floor(randomNumber / multiple) * multiple;
  }

  const start = async (
    numBusinesses = 1,
    numCustomersPerBusiness = 20,
    numTransactionsPerCustomer = 20
  ) => {
    // Function to create a business
    const createBusiness1 = async () => {
      const businessRes = await createBusiness({
        name: "Business Test",
        primaryKey: true,
        userId: "6581d6802c200cdc976f8e3b",
      }).unwrap();

      return businessRes?.data?._id;
    };

    // Function to create a customer for a given business ID
    const createCustomer1 = async (businessId, j) => {
      const customerRes = await createCustomer({
        businessId: businessId,
        name: `Shivam test ${generateRandomNumber(1, 1000, 10)}`,
        mobileNumber: 9634396572,
      }).unwrap();

      return customerRes?.data?._id;
    };

    // Function to create a transaction for a given customer ID and business ID
    const createTransaction1 = async (customerId, businessId) => {
      const formRes = new FormData();
      formRes.append("amount", generateRandomNumber());
      formRes.append(
        "type",
        generateRandomNumber(1, 100, 1) % 2 == 0 ? "credit" : "debit"
      );
      formRes.append("partyId", customerId);
      formRes.append("businessId", businessId);
      formRes.append("description", "test description");
      formRes.append("date", generateRandomDate());
      formRes.append("partyType", "customer");

      setTimeout(async () => {
        await createTransaction(formRes);
      }, 1000);
    };

    // Loop to create specified number of businesses
    for (let i = 0; i < numBusinesses; i++) {
      const businessId = await createBusiness1();

      // Loop to create specified number of customers for each business
      for (let j = 0; j < numCustomersPerBusiness; j++) {
        const customerId = await createCustomer1(businessId, j);

        // Loop to create specified number of transactions for each customer
        for (let k = 0; k < generateRandomNumber(20, 30, 1); k++) {
          await createTransaction1(customerId, businessId);
        }
      }
    }
  };

  const start1 = async (
    numBusinesses = 1,
    numCustomersPerBusiness = 20,
    numTransactionsPerCustomer = 20
  ) => {
    // Function to create a business

    // Function to create a customer for a given business ID
    const createSupplier1 = async (businessId, j) => {
      const supplierRes = await createSupplier({
        businessId: businessId,
        name: `Shivam test supplier ${generateRandomNumber(1, 1000, 10)}`,
        mobileNumber: 9634396572,
      }).unwrap();

      return supplierRes?.data?._id;
    };

    // Function to create a transaction for a given customer ID and business ID
    const createTransaction1 = async (supplierId, businessId) => {
      const formRes = new FormData();
      formRes.append("amount", generateRandomNumber());
      formRes.append(
        "type",
        generateRandomNumber(1, 1000, 1) % 2 ? "credit" : "debit"
      );
      formRes.append("partyId", supplierId);
      formRes.append("businessId", businessId);
      formRes.append("description", "test supplier description");
      formRes.append("date", generateRandomDate());
      formRes.append("partyType", "supplier");

      setTimeout(async () => {
        await createTransaction(formRes);
      }, 1000);
    };

    // Loop to create specified number of businesses

    // Loop to create specified number of customers for each business
    for (let j = 0; j < numCustomersPerBusiness; j++) {
      const supplierId = await createSupplier1("6593c46327ab5f761bb0ca45", j);

      // Loop to create specified number of transactions for each customer
      // for (let k = 0; k < generateRandomNumber(20, 30, 1); k++) {
      //   await createTransaction1(supplierId, "6593c46327ab5f761bb0ca45", k);
      // }
    }
  };

  // Call start function with the desired number of entities to create
  //start(2, 2, 2); // Creates 2 businesses, 2 customers per business, and 2 transactions per customer

  return (
    <div>
      GenerateData
      <button
        onClick={() => {
          // start1(1, 18, 50);
          start1(1, 12);
        }}
      >
        Start
      </button>
    </div>
  );
};

export default GenerateData;

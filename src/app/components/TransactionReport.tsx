import React, { useRef } from "react";
import {
  formatNumberOrStringWithFallback,
  transactionType,
} from "../utils/function";
import NoTransaction from "./NoTransaction";

const TransactionReport = ({
  getAllTransactionData,
  targetRef,
  customerSelected,
  filterData,
  isPdfDownloading,
  partyType,
}) => {
  let creditAmount = 0;
  let debitAmount = 0;

  // Calculate credit amount and debit amount
  getAllTransactionData?.data?.forEach((transaction) => {
    if (transaction.type === "credit") {
      creditAmount += parseFloat(transaction.amount);
    } else if (transaction.type === "debit") {
      debitAmount += parseFloat(transaction.amount);
    }
  });

  const balance = creditAmount - debitAmount;

  return (
    <div
      ref={targetRef}
      className={"absolute"}
      style={
        isPdfDownloading ? { right: -5000, width: "100%" } : { display: "none" }
      }
    >
      <div className="mb-3 p-2 rounded-md shadow-md text-sm">
        {`${partyType == "customer" ? "Customer" : "Supplier"} : ${
          customerSelected?.name
        }`}
      </div>

      <div className="mb-3 p-2 rounded-md shadow-md">
        Transactions Type:
        {filterData?.type === "credit"
          ? `You Got (${
              partyType === "customer"
                ? transactionType.customer["Customer Se Bhugtan Prapt"]
                : transactionType.supplier["Supplier Se Maal Khareeda"]
            })`
          : filterData?.type === "debit"
          ? `You Gave (${
              partyType === "customer"
                ? transactionType.customer["Customer Ko Maal Becha"]
                : transactionType.supplier["Supplier Ko Payment Ki"]
            })`
          : "All"}
      </div>

      {filterData?.startDate && filterData?.endDate ? (
        <>
          <div className="mb-3 p-2 rounded-md shadow-md">
            {`Transactions Range: ${new Date(
              filterData?.startDate
            )?.toLocaleDateString()} - ${new Date(
              filterData?.endDate
            )?.toLocaleDateString()}`}
          </div>
        </>
      ) : null}

      {filterData?.startDate && !filterData?.endDate ? (
        <div className="mb-3 p-2 rounded-md shadow-md">
          {`Transactions from ${new Date(
            filterData?.startDate
          )?.toLocaleDateString()} onwards`}
        </div>
      ) : null}
      {!filterData?.startDate && !filterData?.endDate ? (
        <div className="mb-3 p-2 rounded-md shadow-md">
          Date Range:
          {`All Transactions`}
        </div>
      ) : null}
      {!filterData?.startDate && filterData?.endDate ? (
        <div className="mb-3 p-2 rounded-md shadow-md">
          {`Transactions Till ${new Date(
            filterData?.endDate
          )?.toLocaleDateString()}`}
        </div>
      ) : null}

      {getAllTransactionData?.data?.map((transaction, index) => (
        <div
          key={transaction?._id}
          className="p-4 border rounded-md flex flex-col m-2"
        >
          <div
            key={index}
            className={`flex sm:flex-row flex-col justify-between ${
              partyType === "customer"
                ? transaction.type === "debit"
                  ? "text-red-500"
                  : "text-green-500"
                : transaction.type === "credit"
                ? "text-red-500"
                : "text-green-500"
            }`}
          >
            <p>
              Amount: ₹{formatNumberOrStringWithFallback(transaction?.amount)}{" "}
              {transaction.type === "debit"
                ? `You Gave (${
                    partyType === "customer"
                      ? transactionType.customer["Customer Ko Maal Becha"]
                      : transactionType.supplier["Supplier Ko Payment Ki"]
                  })`
                : `You Got (${
                    partyType === "customer"
                      ? transactionType.customer["Customer Se Bhugtan Prapt"]
                      : transactionType.supplier["Supplier Se Maal Khareeda"]
                  })`}
            </p>
          </div>
          {/* <p>Description: {transaction?.description}</p> */}
          <p>
            Date:{" "}
            {transaction.date
              ? new Date(transaction?.date)?.toLocaleDateString()
              : ""}
          </p>
        </div>
      ))}

      <div className="mt-10 border-4 border-gray-950 rounded-md">
        <div className="p-4 flex flex-col justify-between">
          <div
            className={`${
              partyType === "customer"
                ? `text-green-500 mb-4`
                : `text-red-500 mb-4`
            }`}
          >
            <p>
              Total{" "}
              {`You Got (${
                partyType === "customer"
                  ? transactionType.customer["Customer Se Bhugtan Prapt"]
                  : transactionType.supplier["Supplier Se Maal Khareeda"]
              })`}{" "}
              Amount: ₹{formatNumberOrStringWithFallback(creditAmount)}
            </p>
          </div>
          <hr className="mt-2 mb-2" />
          <div
            className={`${
              partyType === "supplier"
                ? `text-green-500 mb-4`
                : `text-red-500 mb-4`
            }`}
          >
            <p>
              Total{" "}
              {`You Gave (${
                partyType === "customer"
                  ? transactionType.customer["Customer Ko Maal Becha"]
                  : transactionType.supplier["Supplier Ko Payment Ki"]
              })`}{" "}
              Amount: ₹{formatNumberOrStringWithFallback(debitAmount)}
            </p>
          </div>
          <hr className="mt-2 mb-2" />
          <div
            className={`${
              partyType == "customer"
                ? balance > 0
                  ? "text-green-500"
                  : `text-red-500`
                : balance < 0
                ? "text-green-500"
                : "text-red-500"
            }`}
          >
            <p className="text-lg">
              Total Balance:
              {partyType == "customer"
                ? balance < 0
                  ? `You will get (${
                      transactionType.customer["Bakaya Rashi Customer Se"]
                    }) ₹${formatNumberOrStringWithFallback(Math.abs(balance))}`
                  : `You will give (${
                      transactionType.customer["Adhik Bhugtan Customer Se"]
                    }) ${formatNumberOrStringWithFallback(balance)} `
                : balance > 0
                ? `You will give (${
                    transactionType.supplier["Bakaya Rashi Supplier Ko"]
                  }) ₹${formatNumberOrStringWithFallback(balance)}`
                : `You will get (${
                    transactionType.supplier["Adhik Bhugtan Supplier Ko"]
                  }) ${formatNumberOrStringWithFallback(Math.abs(balance))} `}
            </p>
          </div>
        </div>
      </div>

      {getAllTransactionData?.data?.length === 0 && <NoTransaction />}
    </div>
  );
};

export default TransactionReport;

import React, { useRef } from "react";
import { formatNumberOrStringWithFallback } from "../utils/function";
import NoTransaction from "./NoTransaction";

const TransactionReport = ({
  getAllTransactionData,
  targetRef,
  customerSelected,
  filterData,
  isPdfDownloading,
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
        {customerSelected?.name}
      </div>

      <div className="mb-3 p-2 rounded-md shadow-md">
        Transactions Type:
        {filterData?.type === "credit"
          ? "Credit"
          : filterData?.type === "debit"
          ? "Debit"
          : "Credit/Debit"}
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
              transaction.type === "debit" ? "text-red-500" : "text-green-500"
            }`}
          >
            <p>
              Amount: ₹{formatNumberOrStringWithFallback(transaction?.amount)} (
              {transaction.type === "debit" ? "Debit" : "Credit"})
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
          <div className="text-green-500 mb-4">
            <p>
              Total Credit Amount: ₹
              {formatNumberOrStringWithFallback(creditAmount)}
            </p>
          </div>
          <hr className="mt-2 mb-2" />
          <div className="text-red-500">
            <p>
              Total Debit Amount: ₹
              {formatNumberOrStringWithFallback(debitAmount)}
            </p>
          </div>
          <hr className="mt-2 mb-2" />
          <div className="text-red-500">
            <p>
              Total Balance:
              {balance < 0
                ? `Customer will pay ₹${formatNumberOrStringWithFallback(
                    Math.abs(balance)
                  )}`
                : `Customer will receive ${formatNumberOrStringWithFallback(
                    balance
                  )} `}
            </p>
          </div>
        </div>
      </div>

      {getAllTransactionData?.data?.length === 0 && <NoTransaction />}
    </div>
  );
};

export default TransactionReport;

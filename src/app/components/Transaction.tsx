"use client";
import {
  PencilSquareIcon,
  PlusCircleIcon,
  TrashIcon,
} from "@heroicons/react/20/solid";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { customerApi } from "../redux/features/customerSlice";
import {
  useDeleteTransactionMutation,
  useGetTransactionListQuery,
} from "../redux/features/transactionSlice";

import Sidebar from "./Sidebar";
import { usePathname } from "next/navigation";
import { supplierApi } from "../redux/features/supplierSlice";
import Loader from "./Loader";
import useErrorNotification from "../custom-hooks/useErrorNotification";
import useSuccessNotification from "../custom-hooks/useSuccessNotification";
import dynamic from "next/dynamic";
const TransactionModal = dynamic(() => import("./TransactionModal"));
const NoTransaction = dynamic(() => import("./NoTransaction"));

const Transaction = ({ partyId }) => {
  let [isOpen, setIsOpen] = useState({ status: false, type: "", value: null });
  const businessIdSelected = useSelector(
    (state) => state?.business?.businessIdSelected || ""
  );
  const pathname = usePathname();
  const dispatch = useDispatch();
  const {
    isSuccess: isGetTransactionSuccess,
    isLoading: isGetTransactionLoading,
    isError: isGetTransactionError,
    error: getTransactionError,
    data: getTransactionData,
  } = useGetTransactionListQuery(
    {
      businessId: businessIdSelected,
      partyId: partyId,
    },
    { skip: !businessIdSelected || !partyId }
  );
  const [
    deleteTransaction,
    {
      isSuccess: isDeleteTransactionSuccess,
      isLoading: isDeleteTransactionLoading,
      isError: isDeleteTransactionError,
      error: deleteTransactionError,
      data: deleteTransactionData,
    },
  ] = useDeleteTransactionMutation();
  useErrorNotification(getTransactionError, isGetTransactionError);
  useErrorNotification(deleteTransactionError, isDeleteTransactionError);
  useSuccessNotification(
    "Transaction deleted successfully",
    null,
    isDeleteTransactionSuccess
  );
  const [showSidebar, setShowSidebar] = useState(true);
  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };
  console.log("kjhghjk3333", getTransactionData);
  useEffect(() => {
    if (isDeleteTransactionSuccess) {
      if (pathname.includes("customer")) {
        dispatch(customerApi.util.invalidateTags(["customer"]));
      } else {
        dispatch(supplierApi.util.invalidateTags(["supplier"]));
      }
    }
  }, [isDeleteTransactionSuccess]);
  // return <Sidebar showSidebar={showSidebar} toggleSidebar={toggleSidebar} />;
  return (
    <div className="bg-gray-100 min-h-screen flex w-1/2">
      {isDeleteTransactionLoading ? <Loader /> : null}
      <TransactionModal
        partyId={partyId}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
      <div className="flex-1 p-6">
        <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between">
          <h1 className="text-2xl font-bold mb-4 md:mb-0">Transaction List</h1>

          <button
            onClick={() => {
              setIsOpen({ ...isOpen, status: true, type: "add" });
            }}
            className="ml-4 flex items-center text-blue-500 hover:text-blue-700"
          >
            <PlusCircleIcon className="w-6 h-6 mr-1" />
            <span>Add Transaction</span>
          </button>
        </div>
        {isGetTransactionLoading ? (
          <p>Loading...</p>
        ) : isGetTransactionError ? (
          <p>Error: {getTransactionError?.message}</p>
        ) : (
          <div className="grid gap-4">
            {getTransactionData?.data?.map((transaction, index) => (
              <div
                key={transaction?._id}
                className="p-4 border rounded-md flex  flex-col"
              >
                <div
                  key={index}
                  className={`flex sm:flex-row flex-col justify-between ${
                    transaction.type === "debit"
                      ? "text-red-500"
                      : "text-green-500"
                  }`}
                >
                  <p>
                    Amount: ₹{transaction.amount} (
                    {transaction.type === "debit" ? "You Gave" : "You Got"})
                  </p>
                  <div className="flex flex-row">
                    <PencilSquareIcon
                      onClick={() => {
                        setIsOpen({
                          status: true,
                          type: "edit",
                          value: transaction,
                        });
                      }}
                      className="w-5 h-5 text-gray-500 hover:text-red-500 cursor-pointer mr-2"
                    ></PencilSquareIcon>

                    <TrashIcon
                      onClick={() => {
                        deleteTransaction(
                          JSON.stringify({
                            businessId: businessIdSelected,
                            partyId,
                            transactionId: transaction?._id,
                            partyType: pathname.includes("customer")
                              ? "customer"
                              : "supplier",
                          })
                        );
                      }}
                      className="w-5 h-5 text-gray-500 hover:text-red-500 cursor-pointer"
                    />
                  </div>
                </div>
                <p>Description: {transaction?.description}</p>
                <p>
                  Date:{" "}
                  {transaction.date
                    ? new Date(transaction?.date)?.toLocaleDateString()
                    : ""}
                </p>
              </div>
            ))}
            {getTransactionData?.data?.length == 0 && <NoTransaction />}
          </div>
        )}
      </div>
    </div>
  );
};

export default Transaction;

import {
  AdjustmentsHorizontalIcon,
  PencilSquareIcon,
  PlusCircleIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import { usePathname, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import Loader from "./Loader";
import TransactionSkeleton from "./TransactionSkeleton";
import Link from "next/link";
import {
  countNonEmptyKeys,
  formatNumberOrStringWithFallback,
} from "../utils/function";
import TransactionFilterModal from "./TransactionFilterModal";
import { useDispatch, useSelector } from "react-redux";
import { getSelectedCustomer } from "../redux/features/businessSlice";
import Skeleton from "react-loading-skeleton";
import { useRef } from "react";
import generatePDF, { Margin } from "react-to-pdf";

const Pagination = dynamic(() => import("./Pagination"));
const TransactionModal = dynamic(() => import("./TransactionModal"));
const NoTransaction = dynamic(() => import("./NoTransaction"));

const Sidebar = ({
  showSidebar,
  toggleSidebar,
  isDeleteTransactionLoading,
  partyId,
  isOpen,
  setIsOpen,
  isGetTransactionLoading,
  deleteTransaction,
  getTransactionData,
  businessIdSelected,
  isGetTransactionError,
  getTransactionError,
  page,
  setPage,
  isFetching,
  isFilterOpen,
  setIsFilterOpen,
}) => {
  const customerSelected = useSelector(
    (state) => state?.business?.customerSelected || null
  );
  const router = useRouter();
  const pathname = usePathname();
  console.log("jhgfdxchjkhgfdfghj", isFilterOpen);
  const dispatch = useDispatch();
  const targetRef = useRef();

  useEffect(() => {
    dispatch(getSelectedCustomer());
  }, []);
  const closeSidebar = (e) => {};

  useEffect(() => {
    document.addEventListener("mousedown", closeSidebar);

    return () => {
      document.removeEventListener("mousedown", closeSidebar);
    };
  }, [showSidebar, toggleSidebar]);
  console.log("customerSelected", customerSelected);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div
        style={{ width: "47%" }}
        id={"sidebar"}
        className={`shadow-md border bg-gray-100 fixed inset-y-0 right-0 z-500 transition-transform duration-300 ease-in-out transform overflow-auto hover:overflow-scroll max-h-full  ${
          showSidebar ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* <button
          onClick={() =>
            generatePDF(targetRef, {
              filename: "page.pdf",
            })
          }
        >
          Download PDF
        </button> */}
        {/* <div>{JSON.stringify(isFilterOpen)}</div> */}
        <div ref={targetRef}>
          {isDeleteTransactionLoading ? <Loader /> : null}
          <TransactionModal
            partyId={partyId}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
          />
          <TransactionFilterModal
            setIsOpen={setIsFilterOpen}
            isOpen={isFilterOpen}
          />
          <Link
            href={
              pathname.includes("/dashboard/customers")
                ? "/dashboard/customers"
                : "/dashboard/suppliers"
            }
            scroll={false}
          >
            <XMarkIcon className="w-7 h-7 text-gray-500 hover:text-red-500 cursor-pointer ml-4 mt-2" />
          </Link>

          <div className="flex-1 p-6 pb-2 pt-2">
            {customerSelected?.name ? (
              <div className="mb-3  p-2 rounded-md shadow-md text-sm">
                {customerSelected?.name}
              </div>
            ) : (
              <Skeleton duration={0.3} height={38} />
            )}
            <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between">
              <h1 className="text-2xl font-bold mb-4 md:mb-0">
                Transaction List
              </h1>

              <button
                onClick={() => {
                  setIsOpen({ ...isOpen, status: true, type: "add" });
                }}
                className="ml-4 flex items-center text-blue-500 hover:text-blue-700 max-w-max"
              >
                <PlusCircleIcon className="w-6 h-6 mr-1" />
                <span>Add Transaction</span>
              </button>
            </div>

            <button
              onClick={() => setIsFilterOpen({ ...isFilterOpen, status: true })}
              className="flex items-center relative"
            >
              <span className="relative">
                <AdjustmentsHorizontalIcon className="h-5 w-5 mr-1" />
                Filter
              </span>
              {countNonEmptyKeys(isFilterOpen?.value) > 0 && (
                <span className="bg-blue-500 text-white rounded-full px-1 py-0.5 text-xs leading-none absolute top-0 right-0 -mt-1 -mr-1">
                  {countNonEmptyKeys(isFilterOpen?.value)}
                </span>
              )}
            </button>
            {!businessIdSelected || !partyId ? <TransactionSkeleton /> : null}
            {isGetTransactionLoading ? (
              <TransactionSkeleton />
            ) : isGetTransactionError ? (
              <p>Error: {getTransactionError?.message}</p>
            ) : (
              <div className="grid gap-4">
                <Pagination
                  totalPages={getTransactionData?.totalPages}
                  currentPage={page}
                  setPage={setPage}
                />
                {isFetching && <Loader />}
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
                        Amount: ₹
                        {formatNumberOrStringWithFallback(transaction?.amount)}(
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
      </div>
    </div>
  );
};

export default Sidebar;

"use client";
import {
  BanknotesIcon,
  PencilSquareIcon,
  ShoppingBagIcon,
  TrashIcon,
} from "@heroicons/react/20/solid";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedCustomer } from "../redux/features/businessSlice";
import {
  calculateDuration,
  formatNumberOrStringWithFallback,
  transactionType,
} from "../utils/function";
import Loader from "./Loader";
import TransactionListModal from "./TransactionListModal";
import PaginationWrapper from "./PaginationWrapper";

const NoParty = dynamic(() => import("./NoParty"));

const CustomerData = ({
  getCustomerData,
  page,
  setPage,
  deleteCustomer,
  isGetCustomerSuccess,
  debouncedInputValue,
  businessIdSelected,
  setIsOpen,
  isOpen,
  isFetching,
  handleDelete,
  containerRef,
}) => {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const customerSelected = useSelector(
    (state) => state?.business?.customerSelected || null
  );
  const [isTransactionsOpen, setIsTransactionsOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(false);

  return (
    <div
      style={{
        marginTop: 25,
      }}
      //className={"overflow-auto hover:overflow-scroll"}
    >
      {isTransactionsOpen ? (
        <TransactionListModal
          isTransactionsOpen={isTransactionsOpen}
          setIsTransactionsOpen={setIsTransactionsOpen}
          partyId={customerSelected?._id}
        />
      ) : null}

      {isFetching ? (
        <div className="relative">
          <Loader wrapperStyle={{ position: "absolute", top: 20 }} />
        </div>
      ) : null}

      {getCustomerData?.data?.map((item, index) => (
        <div className={`relative mb-4`} key={item?._id}>
          <button
            key={index}
            style={{ height: 130 }}
            className={`w-full block p-4 border rounded-md shadow-md transition duration-300 ease-in-out transform hover:scale-105 pt-0 ${
              isTransactionsOpen && selectedTransaction == item?._id
                ? "scale-105"
                : ""
            }`}
            onClick={(e) => {
              dispatch(setSelectedCustomer(item));
              setIsTransactionsOpen(true);
              setSelectedTransaction(item?._id);
            }}
            //  href={`/dashboard/customers/${item?._id}`}
            //scroll={false}
          >
            <div className="flex justify-between text-left">
              <span>{item?.name}</span>
              <div className="flex flex-col items-end justify-between ">
                <div
                  className={`ml-2 text-right ${
                    item.balance > 0
                      ? "text-green-500"
                      : item.balance < 0
                      ? "text-red-500"
                      : ""
                  }`}
                >
                  {item.balance > 0
                    ? `${transactionType.customer["Adhik Bhugtan Customer Se"]}`
                    : item.balance < 0
                    ? `${transactionType.customer["Bakaya Rashi Customer Se"]}`
                    : ""}
                </div>
                {item.balance == 0 ? <div style={{ height: 24 }}></div> : null}
                {/* {item.balance == 0 && <div className="h-6"></div>} */}
                <div
                  className={`ml-2 ${
                    item.balance > 0
                      ? "text-green-500"
                      : item.balance < 0
                      ? "text-red-500"
                      : ""
                  }`}
                >
                  ₹{formatNumberOrStringWithFallback(Math.abs(item.balance))}
                </div>
              </div>
            </div>
            <div className="h-5"></div>
          </button>
          <div className="flex flex-row absolute bottom-0 p-4 right-0">
            <PencilSquareIcon
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setIsOpen({
                  ...isOpen,
                  status: true,
                  type: "edit",
                  value: item,
                });
              }}
              className="w-5 h-5 text-gray-500 hover:text-cyan-500 cursor-pointer mr-2"
            ></PencilSquareIcon>

            <TrashIcon
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                handleDelete({
                  businessId: businessIdSelected,
                  customerId: item?._id,
                });
              }}
              className="w-5 h-5 text-gray-500 hover:text-red-500 cursor-pointer"
            />
          </div>

          <div
            className="flex flex-col bottom-0 absolute p-4 items-start left-0  rounded-lg text-xs"
            style={{ minWidth: 200 }}
          >
            {item?.latestDebitTransaction?.date && (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <ShoppingBagIcon className="w-4 h-4 mr-2 text-red-500" />
                  <span className="font-semibold text-red-500">GS:</span>
                </div>
                <div className="ml-1 text-red-500">
                  {calculateDuration(item?.latestDebitTransaction?.date)}
                </div>
              </div>
            )}
            {item?.latestCreditTransaction?.date && (
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center">
                  <BanknotesIcon className="w-4 h-4 mr-2 text-green-500" />
                  <span className="font-semibold text-green-500">PR:</span>
                </div>
                <div className="ml-1 text-green-500">
                  {calculateDuration(item?.latestCreditTransaction?.date)}
                </div>
              </div>
            )}
          </div>
        </div>
      ))}

      <PaginationWrapper
        containerRef={containerRef}
        totalPages={getCustomerData?.totalPages}
        currentPage={page}
        setPage={setPage}
      />

      {getCustomerData?.data.length == 0 &&
        isGetCustomerSuccess == true &&
        debouncedInputValue === "" && (
          // <Suspense fallback={<p>98765loading...</p>}>
          <NoParty title={"Customer"} />
          // </Suspense>
        )}
    </div>
  );
};

export default CustomerData;

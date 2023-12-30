"use client";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/20/solid";
import dynamic from "next/dynamic";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedCustomer } from "../redux/features/businessSlice";
import { formatNumberOrStringWithFallback } from "../utils/function";
import Loader from "./Loader";
import Skeleton from "react-loading-skeleton";
import Transaction from "./Transaction";
import { Transition } from "@headlessui/react";
import TransactionListModal from "./TransactionListModal";
import Pagination from "./Pagination";

// const Pagination = dynamic(() => import("./Pagination"), {
//   loading: () => (
//     <Skeleton duration={0.6} height={42} style={{ marginTop: 16 }} />
//   ),
// });

const NoParty = dynamic(() => import("./NoParty"));
// import NoParty from "./NoParty";
// import Pagination from "./Pagination";

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
}) => {
  console.log("customerdata4567890", getCustomerData);
  const pathname = usePathname();
  const dispatch = useDispatch();
  const customerSelected = useSelector(
    (state) => state?.business?.customerSelected || null
  );
  const [isTransactionsOpen, setIsTransactionsOpen] = useState(false);
  return (
    <>
      {isTransactionsOpen ? (
        <TransactionListModal
          isTransactionsOpen={isTransactionsOpen}
          setIsTransactionsOpen={setIsTransactionsOpen}
          partyId={customerSelected?._id}
        />
      ) : null}

      <Pagination
        totalPages={getCustomerData?.totalPages}
        currentPage={page}
        setPage={setPage}
      />
      {isFetching ? (
        <div className="relative">
          <Loader wrapperStyle={{ position: "absolute", top: 20 }} />
        </div>
      ) : null}
      {getCustomerData?.data?.map((item, index) => (
        <div className="relative">
          <button
            key={index}
            className={`w-full block p-4 border rounded-md shadow-md hover:shadow-lg transition duration-300 ease-in-out ${
              pathname.includes(item._id)
                ? "text-blue-500 bg-blue-100 font-semibold"
                : "text-black hover:text-blue-500 font-normal"
            }`}
            onClick={() => {
              dispatch(setSelectedCustomer(item));
              setIsTransactionsOpen(true);
            }}
            //  href={`/dashboard/customers/${item?._id}`}
            //scroll={false}
          >
            <div className="flex justify-between ">
              <span>{item?.name}</span>
              <div className="flex flex-col items-end">
                <div>
                  {item.balance > 0
                    ? "You will give"
                    : item.balance < 0
                    ? "You will get"
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
          <div className="flex flex-row absolute bottom-0 p-4">
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
        </div>
      ))}

      {getCustomerData?.data.length == 0 &&
        isGetCustomerSuccess == true &&
        debouncedInputValue === "" && (
          // <Suspense fallback={<p>98765loading...</p>}>
          <NoParty title={"Customer"} />
          // </Suspense>
        )}
    </>
  );
};

export default CustomerData;

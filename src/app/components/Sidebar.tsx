import {
  PencilSquareIcon,
  PlusCircleIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import { usePathname, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import React, { useEffect } from "react";
import Loader from "./Loader";
import TransactionSkeleton from "./TransactionSkeleton";
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
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const closeSidebar = (e) => {
    // Check if the click is outside the sidebar
    // if (
    //   showSidebar &&
    //   !e.target.closest("#sidebar") &&
    //   isOpen?.status == false
    // ) {
    //   if (pathname.includes("/dashboard/customers")) {
    //     router.push("/dashboard/customers", { scroll: false });
    //   }
    //   if (pathname.includes("/dashboard/suppliers")) {
    //     router.push("/dashboard/suppliers", { scroll: false });
    //   }
    //   //toggleSidebar();
    // }
  };

  useEffect(() => {
    document.addEventListener("mousedown", closeSidebar);

    return () => {
      document.removeEventListener("mousedown", closeSidebar);
    };
  }, [showSidebar, toggleSidebar]);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div
        style={{ width: "47%" }}
        id={"sidebar"}
        className={`bg-gray-100 fixed inset-y-0 right-0 z-500 transition-transform duration-300 ease-in-out transform overflow-auto hover:overflow-scroll max-h-full  ${
          showSidebar ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div>
          {isDeleteTransactionLoading ? <Loader /> : null}
          <TransactionModal
            partyId={partyId}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
          />
          <XMarkIcon
            onClick={(e) => {
              if (pathname.includes("/dashboard/customers")) {
                router.push("/dashboard/customers", { scroll: false });
              }
              if (pathname.includes("/dashboard/suppliers")) {
                router.push("/dashboard/suppliers", { scroll: false });
              }
            }}
            className="w-7 h-7 text-gray-500 hover:text-red-500 cursor-pointer ml-4 mt-2"
          />
          <div className="flex-1 p-6">
            <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between">
              <h1 className="text-2xl font-bold mb-4 md:mb-0">
                Transaction List
              </h1>

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
                        {transaction?.amount
                          ? Number(transaction?.amount)?.toLocaleString()
                          : 0}{" "}
                        ({transaction.type === "debit" ? "You Gave" : "You Got"}
                        )
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

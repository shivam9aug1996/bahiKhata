import {
  AdjustmentsHorizontalIcon,
  ArrowDownTrayIcon,
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
  isDemoUser,
  isValidData,
  transactionType,
} from "../utils/function";

import { useDispatch, useSelector } from "react-redux";
import {
  getSelectedCustomer,
  setSelectedCustomer,
} from "../redux/features/businessSlice";
import Skeleton from "react-loading-skeleton";
import { useRef } from "react";
import generatePDF, { Margin } from "react-to-pdf";
import {
  transactionApi,
  useLazyGetAllPublicTransactionQuery,
  useLazyGetAllTransactionQuery,
} from "../redux/features/transactionSlice";
// import TransactionReport from "./TransactionReport";
import toast from "react-hot-toast";
import { Transition } from "@headlessui/react";
import PaginationWrapper from "./PaginationWrapper";
import { Image } from "@nextui-org/react";

// const Pagination = dynamic(() => import("./Pagination"), {
//   loading: () => (
//     <Skeleton duration={0.6} height={42} style={{ marginTop: 16 }} />
//   ),
// });
const TransactionModal = dynamic(() => import("./TransactionModal"), {
  loading: () => (
    <Loader wrapperStyle={{ alignItems: "flex-start", marginTop: "20rem" }} />
  ),
});
const NoTransaction = dynamic(() => import("./NoTransaction"), {
  loading: () => <TransactionSkeleton />,
});
const TransactionReport = dynamic(() => import("./TransactionReport"));
const PublicFilterTransactionModal = dynamic(
  () => import("./PublicFilterTransactionModal"),
  {
    loading: () => (
      <Loader wrapperStyle={{ alignItems: "flex-start", marginTop: "20rem" }} />
    ),
  }
);
const PublicSidebar = ({
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
  setIsDeleteOpen,
  isDeleteOpen,
  partyType,
  setIsTransactionsOpen,
  partyData,
}) => {
  const customerSelected = partyData;

  const [
    getAllTransactions,
    {
      isSuccess: isGetAllTransactionSuccess,
      isLoading: isGetAllTransactionLoading,
      isError: isGetAllTransactionError,
      error: getAllTransactionError,
      data: getAllTransactionData,
    },
  ] = useLazyGetAllPublicTransactionQuery();
  const containerRef = useRef(null);
  const router = useRouter();
  const pathname = usePathname();

  const dispatch = useDispatch();
  const targetRef = useRef();
  const [isPdfDownloading, setIsPdfDownloading] = useState(false);
  const [total, setTotal] = useState(0);

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

  useEffect(() => {
    if (businessIdSelected && partyId) {
      getAllTransactions({
        businessId: businessIdSelected,
        partyId: partyId,
        ...isFilterOpen.value,
      })
        .unwrap()
        .then((res) => {
          console.log("kjhgffghjk", res);
          let creditAmount = 0;
          let debitAmount = 0;

          // Calculate credit amount and debit amount
          res?.data?.forEach((transaction) => {
            if (transaction.type === "credit") {
              creditAmount += parseFloat(transaction.amount);
            } else if (transaction.type === "debit") {
              debitAmount += parseFloat(transaction.amount);
            }
          });

          const balance = creditAmount - debitAmount;
          console.log("uytrfghjk", balance);
          setTotal(balance);
        });
    }
  }, [businessIdSelected, partyId]);

  const handleImageClick = (e, image) => {
    window.open(image, "_blank");
    e.stopPropagation();
    e.preventDefault();
  };

  return (
    <div
      id={"sidebar"}
      ref={containerRef}
      // className={`shadow-md border bg-gray-100 fixed inset-y-0 right-0 z-500 transition-transform duration-300 ease-in-out transform overflow-auto hover:overflow-scroll max-h-full  ${
      //   showSidebar ? "translate-x-0" : "translate-x-full"
      // }`}
    >
      {isPdfDownloading && (
        <TransactionReport
          isPdfDownloading={isPdfDownloading}
          filterData={isFilterOpen?.value}
          targetRef={targetRef}
          getAllTransactionData={getAllTransactionData}
          customerSelected={customerSelected}
          partyType={partyType}
        />
      )}

      {/* <div>{JSON.stringify(isFilterOpen)}</div> */}
      <div className="mb-10">
        {isDeleteTransactionLoading ? <Loader /> : null}
        {isOpen?.status && (
          <TransactionModal
            partyId={partyId}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            setPage={setPage}
            getTransactionData={getTransactionData}
          />
        )}
        {isFilterOpen?.status && (
          <PublicFilterTransactionModal
            setIsOpen={setIsFilterOpen}
            isOpen={isFilterOpen}
            setPage={setPage}
            partyType={partyType}
          />
        )}

        {/* <button
            className="inline-block"
            // href={
            //   pathname.includes("/dashboard/customers")
            //     ? "/dashboard/customers"
            //     : "/dashboard/suppliers"
            // }
            onClick={() => {
              dispatch(setSelectedCustomer(""));
              // router.back();
              setIsTransactionsOpen(false);
            }}
            // scroll={false}
          >
            <XMarkIcon className="w-7 h-7 text-gray-500 hover:text-red-500 cursor-pointer ml-4 mt-2" />
          </button> */}

        <div className="flex-1 p-6 pb-2 pt-2">
          {customerSelected?.name &&
          getTransactionData?.businessData?.name &&
          isGetAllTransactionSuccess ? (
            <div className="rounded-md shadow-md p-2">
              <div className="text-md">
                {`Business : ${getTransactionData?.businessData?.name}`}
              </div>
              <div className="text-md">
                {`${partyType == "customer" ? "Customer" : "Supplier"} : ${
                  customerSelected?.name
                }`}

                <div>
                  <p className="text-md">
                    Total Balance:{" "}
                    <span
                      className={`${
                        partyType == "customer"
                          ? total > 0
                            ? "text-green-500"
                            : `text-red-500`
                          : total < 0
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {partyType == "customer"
                        ? total < 0
                          ? `${
                              transactionType.customer[
                                "Bakaya Rashi Customer Se"
                              ]
                            } ₹${formatNumberOrStringWithFallback(
                              Math.abs(total)
                            )}`
                          : `${
                              transactionType.customer[
                                "Adhik Bhugtan Customer Se"
                              ]
                            } ₹${formatNumberOrStringWithFallback(total)} `
                        : total > 0
                        ? `${
                            transactionType.supplier["Bakaya Rashi Supplier Ko"]
                          } ₹${formatNumberOrStringWithFallback(total)}`
                        : `${
                            transactionType.supplier[
                              "Adhik Bhugtan Supplier Ko"
                            ]
                          } ₹${formatNumberOrStringWithFallback(
                            Math.abs(total)
                          )} `}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <Skeleton duration={0.6} height={88} />
          )}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-4 mb-2">
            <h1 className="text-2xl font-bold">Transaction List</h1>
          </div>
          <div className="flex justify-between items-center">
            <button
              onClick={() => setIsFilterOpen({ ...isFilterOpen, status: true })}
              className="flex items-center relative"
            >
              <AdjustmentsHorizontalIcon className="h-5 w-5 mr-1" />
              {countNonEmptyKeys(isFilterOpen?.value) > 0 && (
                <span className="bg-blue-500 text-white rounded-full px-1 py-0.5 text-xs leading-none absolute top-0 right-0 -mt-1 -mr-1">
                  {countNonEmptyKeys(isFilterOpen?.value)}
                </span>
              )}
            </button>

            {/* <ArrowDownTrayIcon
              className="w-5 h-5 cursor-pointer"
              onClick={() => {
                if (!isPdfDownloading) {
                  setIsPdfDownloading(true);
                  toast.promise(
                    getAllTransactions({
                      businessId: businessIdSelected,
                      partyId: partyId,
                      ...isFilterOpen.value,
                    })
                      .unwrap()
                      .then(() => {})
                      .then(() => {
                        setTimeout(() => {
                          toast.promise(
                            generatePDF(targetRef, {
                              filename: "page.pdf",
                              page: { margin: Margin.MEDIUM },
                            })
                              ?.then(() => {
                                setIsPdfDownloading(false);
                              })
                              ?.catch(() => {
                                setIsPdfDownloading(false);
                              }),
                            {
                              loading: "Downloading",
                              success: "Downloaded successfully",
                              error: "Error when downloading",
                            }
                          );
                        }, 500);
                      })
                      .catch((error) => {
                        setIsPdfDownloading(false);
                        console.log("Error:", error);
                      }),
                    {
                      loading: "Data preparing",
                      success: "Data prepared",
                      error: "Error when preparing data",
                    }
                  );
                }
              }}
            /> */}
          </div>
          {!businessIdSelected || !partyId ? <TransactionSkeleton /> : null}
          {isGetTransactionLoading ? (
            <TransactionSkeleton />
          ) : isGetTransactionError ? (
            <p>Error: {getTransactionError?.message}</p>
          ) : (
            <div className="grid gap-4">
              <div className="mt-4"></div>
              {isFetching && (
                <Loader
                  wrapperStyle={{
                    alignItems: "flex-start",
                    marginTop: "20rem",
                  }}
                />
              )}
              {getTransactionData?.data?.length == 0 &&
              countNonEmptyKeys(isFilterOpen?.value) > 0 &&
              businessIdSelected ? (
                <p>No entries found matching your filters.</p>
              ) : null}
              {getTransactionData?.data?.map((transaction, index) => (
                <div
                  style={{ opacity: isFetching ? 0.5 : 1 }}
                  key={transaction?._id}
                  className="p-4 border rounded-md flex  flex-col"
                >
                  <div
                    key={index}
                    className={`flex  flex-row justify-between ${
                      partyType == "customer"
                        ? transaction.type === "debit"
                          ? "text-red-500"
                          : "text-green-500"
                        : transaction.type === "credit"
                        ? "text-red-500"
                        : "text-green-500"
                    }`}
                  >
                    <div className="flex flex-col">
                      <p>
                        Amount: ₹
                        {formatNumberOrStringWithFallback(transaction?.amount)}{" "}
                      </p>
                      <p>
                        {transaction.type === "debit"
                          ? `${
                              partyType == "customer"
                                ? transactionType.customer[
                                    "Dukandaar Se Maal Khareeda"
                                  ]
                                : transactionType.supplier[
                                    "Dukandaar Se Bhugtan Prapt"
                                  ]
                            }`
                          : `${
                              partyType == "customer"
                                ? transactionType.customer[
                                    "Dukandaar Ko Payment Ki"
                                  ]
                                : transactionType.supplier[
                                    "Dukandaar Ko Maal Becha"
                                  ]
                            }`}
                      </p>
                    </div>
                    {/* <div className="flex flex-row">
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
                          if (!isDemoUser(mobileNumber)) {
                            setIsDeleteOpen({
                              ...isDeleteOpen,
                              status: true,
                              value: {
                                businessId: businessIdSelected,
                                partyId,
                                transactionId: transaction?._id,
                                partyType: partyType=="customer"
                                  ? "customer"
                                  : "supplier",
                              },
                            });
                          }
                        }}
                        className="w-5 h-5 text-gray-500 hover:text-red-500 cursor-pointer"
                      />
                    </div> */}
                  </div>

                  <p>
                    Date:{" "}
                    {transaction.date
                      ? new Date(transaction?.date)?.toLocaleDateString()
                      : ""}
                  </p>
                  <p>Description: {transaction?.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {transaction?.imageUrl?.map((image, index) => {
                      return isValidData(image) ? (
                        <div
                          className="w-10 h-10 cursor-pointer"
                          onClick={(e) => handleImageClick(e, image)}
                        >
                          <Image
                            loading={"lazy"}
                            isZoomed
                            src={image}
                            alt={`Preview ${index}`}
                            className="w-10 h-10 object-cover rounded-md border"
                          />
                        </div>
                      ) : null;
                    })}
                  </div>
                </div>
              ))}
              <PaginationWrapper
                totalPages={getTransactionData?.totalPages}
                currentPage={page}
                setPage={setPage}
                containerRef={containerRef}
              />

              {getTransactionData?.data?.length == 0 &&
              countNonEmptyKeys(isFilterOpen?.value) == 0 ? (
                <NoTransaction />
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PublicSidebar;

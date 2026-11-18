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
import { customerApi } from "../redux/features/customerSlice";
import { supplierApi } from "../redux/features/supplierSlice";
import { dashboardApi } from "../redux/features/dashboardSlice";
import {
  getSelectedCustomer,
  setSelectedCustomer,
} from "../redux/features/businessSlice";
import Skeleton from "react-loading-skeleton";
import { useRef } from "react";
import generatePDF, { Margin } from "react-to-pdf";
import {
  transactionApi,
  useLazyGetAllTransactionQuery,
  useBulkTransactionActionMutation,
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
const TransactionFilterModal = dynamic(
  () => import("./TransactionFilterModal"),
  {
    loading: () => (
      <Loader wrapperStyle={{ alignItems: "flex-start", marginTop: "20rem" }} />
    ),
  }
);
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
  setIsDeleteOpen,
  isDeleteOpen,
  partyType,
  setIsTransactionsOpen,
}) => {
  const customerSelected = useSelector(
    (state) => state?.business?.customerSelected || null
  );
  const mobileNumber = useSelector(
    (state) => state?.auth?.userData?.mobileNumber || null
  );
  const [
    getAllTransactions,
    {
      isSuccess: isGetAllTransactionSuccess,
      isLoading: isGetAllTransactionLoading,
      isError: isGetAllTransactionError,
      error: getAllTransactionError,
      data: getAllTransactionData,
    },
  ] = useLazyGetAllTransactionQuery();
  const containerRef = useRef(null);
  const router = useRouter();
  const pathname = usePathname();

  const dispatch = useDispatch();
  const targetRef = useRef();
  const [isPdfDownloading, setIsPdfDownloading] = useState(false);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedTransactionIds, setSelectedTransactionIds] = useState<string[]>([]);
  const [selectionStartDate, setSelectionStartDate] = useState("");
  const [selectionEndDate, setSelectionEndDate] = useState("");
  const [bulkTransactionAction, { isLoading: isBulkActionLoading }] =
    useBulkTransactionActionMutation();

  const selectionContext = { businessId: businessIdSelected, partyId, partyType };

  const toggleTransactionSelection = (transactionId: string, checked: boolean) => {
    setSelectedTransactionIds((current) =>
      checked
        ? Array.from(new Set([...current, transactionId]))
        : current.filter((id) => id !== transactionId)
    );
  };

  const selectMatchingTransactions = async (filters: any) => {
    try {
      const result: any = await bulkTransactionAction({
        action: "select",
        ...selectionContext,
        filters,
      }).unwrap();
      setSelectedTransactionIds((current) =>
        Array.from(new Set([...current, ...(result.ids || [])]))
      );
      toast.success((result.count || 0) + " matching transactions added to selection");
    } catch (error: any) {
      toast.error(error?.data?.message || "Unable to select transactions");
    }
  };

  const handleSelectAllTransactions = () =>
    selectMatchingTransactions(isFilterOpen?.value || {});

  const handleSelectByDate = () => {
    if (!selectionStartDate || !selectionEndDate) {
      toast.error("Please select both start and end dates");
      return;
    }
    if (selectionStartDate > selectionEndDate) {
      toast.error("Start date cannot be after end date");
      return;
    }
    selectMatchingTransactions({
      ...(isFilterOpen?.value || {}),
      startDate: selectionStartDate,
      endDate: selectionEndDate,
    });
  };

  const handleBulkDelete = async () => {
    if (!selectedTransactionIds.length || isDemoUser(mobileNumber)) return;
    const confirmed = window.confirm(
      "Permanently delete " + selectedTransactionIds.length + " selected transaction(s)? This cannot be undone."
    );
    if (!confirmed) return;
    try {
      const result: any = await bulkTransactionAction({
        action: "delete",
        ...selectionContext,
        transactionIds: selectedTransactionIds,
      }).unwrap();
      toast.success(result.deletedCount + " transactions deleted successfully");
      setSelectedTransactionIds([]);
      setIsSelectionMode(false);
      setSelectionStartDate("");
      setSelectionEndDate("");
      setPage(1);
      if (partyType === "customer") {
        dispatch(customerApi.util.invalidateTags(["customer"]));
      } else {
        dispatch(supplierApi.util.invalidateTags(["supplier"]));
      }
      dispatch(dashboardApi.util.invalidateTags(["dashboard"]));
    } catch (error: any) {
      toast.error(error?.data?.message || "Unable to delete selected transactions");
    }
  };

  useEffect(() => {
    setIsSelectionMode(false);
    setSelectedTransactionIds([]);
    setSelectionStartDate("");
    setSelectionEndDate("");
  }, [partyId, businessIdSelected]);

  useEffect(() => {
    dispatch(getSelectedCustomer());
  }, [dispatch]);
  const closeSidebar = (e) => {};

  useEffect(() => {
    document.addEventListener("mousedown", closeSidebar);

    return () => {
      document.removeEventListener("mousedown", closeSidebar);
    };
  }, [showSidebar, toggleSidebar]);

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
          <TransactionFilterModal
            setIsOpen={setIsFilterOpen}
            isOpen={isFilterOpen}
            setPage={setPage}
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
          {customerSelected?.name ? (
            <div className="mb-3  p-2 rounded-md shadow-md text-sm">
              {`${partyType == "customer" ? "Customer" : "Supplier"} : ${
                customerSelected?.name
              }`}
            </div>
          ) : (
            <Skeleton duration={0.6} height={38} />
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

            {/* <button
                className=""
                onClick={() => {
                 
                }}
              >
                Download PDF
              </button> */}
            <ArrowDownTrayIcon
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
            />
          </div>

          <div className="mt-3 rounded-md border p-3">
            {!isSelectionMode ? (
              <button
                type="button"
                onClick={() => {
                  setIsSelectionMode(true);
                  setSelectedTransactionIds([]);
                }}
                className="text-sm font-medium text-blue-600 hover:text-blue-800"
              >
                Select transactions
              </button>
            ) : (
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-semibold">
                    Selection mode · {selectedTransactionIds.length} selected
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setIsSelectionMode(false);
                      setSelectedTransactionIds([]);
                      setSelectionStartDate("");
                      setSelectionEndDate("");
                    }}
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    Cancel
                  </button>
                </div>
                <button
                  type="button"
                  disabled={isBulkActionLoading}
                  onClick={handleSelectAllTransactions}
                  className="rounded border border-blue-200 px-3 py-2 text-sm text-blue-700 hover:bg-blue-50 disabled:opacity-50"
                >
                  Select all matching transactions across all pages
                </button>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_1fr_auto]">
                  <label className="text-xs text-gray-600">
                    From date
                    <input
                      type="date"
                      value={selectionStartDate}
                      onChange={(event) => setSelectionStartDate(event.target.value)}
                      className="mt-1 block w-full rounded border px-2 py-2 text-sm text-gray-900"
                    />
                  </label>
                  <label className="text-xs text-gray-600">
                    To date
                    <input
                      type="date"
                      value={selectionEndDate}
                      onChange={(event) => setSelectionEndDate(event.target.value)}
                      className="mt-1 block w-full rounded border px-2 py-2 text-sm text-gray-900"
                    />
                  </label>
                  <button
                    type="button"
                    disabled={isBulkActionLoading}
                    onClick={handleSelectByDate}
                    className="self-end rounded border px-3 py-2 text-sm hover:bg-gray-50 disabled:opacity-50"
                  >
                    Add date range
                  </button>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2 border-t pt-3">
                  <span className="text-xs text-gray-600">
                    Selection is kept when you change pages.
                  </span>
                  <button
                    type="button"
                    disabled={!selectedTransactionIds.length || isBulkActionLoading || isDemoUser(mobileNumber)}
                    onClick={handleBulkDelete}
                    className="rounded bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isBulkActionLoading ? "Please wait..." : "Delete selected (" + selectedTransactionIds.length + ")"}
                  </button>
                </div>
              </div>
            )}
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
                      pathname.includes("customer")
                        ? transaction.type === "debit"
                          ? "text-red-500"
                          : "text-green-500"
                        : transaction.type === "credit"
                        ? "text-red-500"
                        : "text-green-500"
                    }`}
                  >
                    <div className="flex flex-col">
                      {isSelectionMode && (
                        <label className="mb-2 flex items-center gap-2 text-sm text-gray-700">
                          <input
                            type="checkbox"
                            checked={selectedTransactionIds.includes(transaction?._id)}
                            onChange={(event) =>
                              toggleTransactionSelection(transaction?._id, event.target.checked)
                            }
                            className="h-4 w-4 rounded border-gray-300"
                          />
                          Select transaction
                        </label>
                      )}
                      <p>
                        Amount: ₹
                        {formatNumberOrStringWithFallback(transaction?.amount)}{" "}
                      </p>
                      <p>
                        {transaction.type === "debit"
                          ? `${
                              pathname.includes("customer")
                                ? transactionType.customer[
                                    "Customer Ko Maal Becha"
                                  ]
                                : transactionType.supplier[
                                    "Supplier Ko Payment Ki"
                                  ]
                            }`
                          : `${
                              pathname.includes("customer")
                                ? transactionType.customer[
                                    "Customer Se Bhugtan Prapt"
                                  ]
                                : transactionType.supplier[
                                    "Supplier Se Maal Khareeda"
                                  ]
                            }`}
                      </p>
                    </div>
                    <div className="flex flex-row">
                      {!isSelectionMode && <PencilSquareIcon
                        onClick={() => {
                          setIsOpen({
                            status: true,
                            type: "edit",
                            value: transaction,
                          });
                        }}
                        className="w-5 h-5 text-gray-500 hover:text-red-500 cursor-pointer mr-2"
                      ></PencilSquareIcon>}

                      {!isSelectionMode && <TrashIcon
                        onClick={() => {
                          if (!isDemoUser(mobileNumber)) {
                            setIsDeleteOpen({
                              ...isDeleteOpen,
                              status: true,
                              value: {
                                businessId: businessIdSelected,
                                partyId,
                                transactionId: transaction?._id,
                                partyType: pathname.includes("customer")
                                  ? "customer"
                                  : "supplier",
                              },
                            });
                          }
                        }}
                        className="w-5 h-5 text-gray-500 hover:text-red-500 cursor-pointer"
                      />}
                    </div>
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

export default Sidebar;

"use client";
import {
  BanknotesIcon,
  MagnifyingGlassIcon,
  PencilSquareIcon,
  PlusCircleIcon,
  ShoppingBagIcon,
  TrashIcon,
} from "@heroicons/react/20/solid";
import dynamic from "next/dynamic";

import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import useErrorNotification from "../custom-hooks/useErrorNotification";
import useSuccessNotification from "../custom-hooks/useSuccessNotification";
import {
  setSelectedCustomer,
  useGetBusinessListQuery,
} from "../redux/features/businessSlice";
import { dashboardApi } from "../redux/features/dashboardSlice";

import {
  useDeleteSupplierMutation,
  useGetSupplierListQuery,
} from "../redux/features/supplierSlice";

import Loader from "./Loader";
import PartySkeleton from "./PartySkeleton";
import {
  calculateDuration,
  formatNumberOrStringWithFallback,
  isDemoUser,
  transactionType,
} from "../utils/function";

import PaginationWrapper from "./PaginationWrapper";
import TransactionListModal from "./TransactionListModal";
const NoBusinessExists = dynamic(() => import("./NoBusinessExists"), {
  loading: () => <PartySkeleton />,
});
const GenericModal = dynamic(() => import("./GenericModal"), {
  loading: () => <Loader />,
});
// import NoParty from "./NoParty";
// import PartyModal from "./PartyModal";
// const Pagination = dynamic(() => import("./Pagination"));
// const Pagination = dynamic(() => import("./Pagination"), {
//   loading: () => (
//     <Skeleton duration={0.6} height={42} style={{ marginTop: 16 }} />
//   ),
// });
const NoParty = dynamic(() => import("./NoParty"), {
  loading: () => <Loader />,
});
const PartyModal = dynamic(() => import("./PartyModal"), {
  loading: () => <Loader />,
});

const Supplier = () => {
  const pathname = usePathname();
  const businessIdSelected = useSelector(
    (state) => state?.business?.businessIdSelected || ""
  );
  const userId = useSelector((state) => state?.auth?.userData?.userId || null);
  const customerSelected = useSelector(
    (state) => state?.business?.customerSelected || null
  );
  const [isTransactionsOpen, setIsTransactionsOpen] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [debouncedInputValue, setDebouncedInputValue] = useState("");
  const [isDeleteOpen, setIsDeleteOpen] = useState({
    status: false,
    value: null,
  });
  const containerRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTransaction, setSelectedTransaction] = useState(false);
  const mobileNumber = useSelector(
    (state) => state?.auth?.userData?.mobileNumber || null
  );
  const {
    isSuccess: isGetSupplierSuccess,
    isLoading: isGetSupplierLoading,
    isError: isGetSupplierError,
    error: getSupplierError,
    data: getSupplierData,
    isFetching,
  } = useGetSupplierListQuery(
    {
      businessId: businessIdSelected,
      searchQuery: debouncedInputValue,
      page: page,
    },
    { skip: !businessIdSelected || !userId }
  );
  const [
    deleteSupplier,
    {
      isSuccess: isDeleteSupplierSuccess,
      isLoading: isDeleteSupplierLoading,
      isError: isDeleteSupplierError,
      error: deleteSupplierError,
      data: deleteSupplierData,
    },
  ] = useDeleteSupplierMutation();
  const {
    isSuccess: isGetBusinessSuccess,
    isLoading: isGetBusinessLoading,
    isError: isGetBusinessError,
    error: getBusinessError,
    data: getBusinessData,
  } = useGetBusinessListQuery({ userId: userId }, { skip: !userId });
  let [isOpen, setIsOpen] = useState({
    status: false,
    type: "",
    value: null,
    part: "supplier",
  });
  useErrorNotification(getSupplierError, isGetSupplierError);
  useErrorNotification(deleteSupplierError, isDeleteSupplierError);
  useSuccessNotification(
    "Supplier deleted successfully",
    null,
    isDeleteSupplierSuccess
  );
  useEffect(() => {
    if (isDeleteSupplierSuccess) {
      setIsDeleteOpen({ status: false, value: null });
      dispatch(dashboardApi.util.invalidateTags(["dashboard"]));
      router.push("/dashboard/suppliers", { scroll: false });
    }
  }, [isDeleteSupplierSuccess]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedInputValue(searchQuery);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchQuery, 500]);

  useEffect(() => {
    if (businessIdSelected) {
      setSearchQuery("");
      setPage(1);
    }
  }, [businessIdSelected]);

  const handleSubmitDelete = () => {
    deleteSupplier(JSON.stringify(isDeleteOpen?.value));
    if (
      getSupplierData?.data?.length == 1 &&
      getSupplierData?.currentPage !== 1
    ) {
      setPage(getSupplierData?.currentPage - 1);
    }
  };
  console.log("jhgfdfghj", getSupplierData);
  return (
    <>
      {isTransactionsOpen ? (
        <TransactionListModal
          isTransactionsOpen={isTransactionsOpen}
          setIsTransactionsOpen={setIsTransactionsOpen}
          partyId={customerSelected?._id}
        />
      ) : null}

      <div
        className="shadow-lg  container m-3 rounded-lg p-4 border mt-8 mb-20"
        style={{ minHeight: 600 }}
        ref={containerRef}
      >
        {isDeleteSupplierLoading ? <Loader /> : null}
        {isOpen?.status && (
          <PartyModal
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            setSearchQuery={setSearchQuery}
            partyData={getSupplierData}
            setPage={setPage}
          />
        )}
        {isDeleteOpen?.status && (
          <GenericModal
            setIsOpen={setIsDeleteOpen}
            isOpen={isDeleteOpen}
            title={"Delete Supplier"}
            subtitle={
              "Deleting this item will remove it permanently, along with all associated transactions. Are you sure you want to continue?"
            }
            handleSubmit={handleSubmitDelete}
            loading={isDeleteSupplierLoading}
          />
        )}

        <div className="space-y-4">
          {businessIdSelected && (
            <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="text-2xl font-bold mb-4 md:mb-0">
                Supplier List
              </div>
              <button
                onClick={() => {
                  if (businessIdSelected) {
                    setIsOpen({
                      ...isOpen,
                      status: true,
                      type: "add",
                    });
                  } else {
                    toast.error("Create business first");
                  }
                }}
                className="ml-4 flex items-center text-blue-500 hover:text-blue-700 max-w-max"
              >
                <PlusCircleIcon className="w-6 h-6 mr-1" />
                <span>Add Supplier</span>
              </button>
            </div>
          )}
          {(getSupplierData?.data?.length > 0 ||
            (getSupplierData?.data?.length == 0 &&
              debouncedInputValue !== "")) &&
          businessIdSelected ? (
            <div className="relative" style={{ maxWidth: 250 }}>
              <input
                type="text"
                placeholder="Search.."
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                value={searchQuery}
                className="border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500 w-full"
              />
              <span className="absolute inset-y-0 right-0 flex items-center pr-3">
                <MagnifyingGlassIcon className="h-6 w-6 text-gray-400" />
              </span>
            </div>
          ) : null}
          {!businessIdSelected && isGetBusinessSuccess ? (
            <NoBusinessExists type={"supplier"} />
          ) : null}
          {!businessIdSelected && isGetBusinessLoading ? (
            <PartySkeleton />
          ) : null}
          {getSupplierData?.data?.length == 0 &&
          debouncedInputValue !== "" &&
          businessIdSelected ? (
            <p>No supplier found matching your search.</p>
          ) : null}
          {isGetSupplierLoading ? (
            <>
              <PartySkeleton />
            </>
          ) : isGetSupplierError ? (
            <p>Error fetching suppliers: {getSupplierError?.message}</p>
          ) : !businessIdSelected ? null : (
            <>
              {/* {isFetching ? (
              <div className="relative bg-red-300 w-full h-full">
                <Loader
                  wrapperStyle={{
                    position: "absolute",
                    alignItems: "flex-start",
                  }}
                />
              </div>
            ) : null} */}

              {isFetching ? (
                <div className="relative">
                  <Loader wrapperStyle={{ position: "absolute", top: 20 }} />
                </div>
              ) : null}
              <div style={{ marginTop: 25 }}>
                {getSupplierData?.data?.map((item, index) => (
                  <div
                    style={{ opacity: isFetching ? 0.5 : 1 }}
                    className="relative mb-4"
                    key={item?._id}
                  >
                    <button
                      style={{ height: 130 }}
                      onClick={() => {
                        dispatch(setSelectedCustomer(item));
                        setIsTransactionsOpen(true);
                        setSelectedTransaction(item?._id);
                      }}
                      key={index}
                      className={`w-full block p-4 border rounded-md shadow-md transition duration-300 ease-in-out transform hover:scale-105 ${
                        isTransactionsOpen && selectedTransaction == item?._id
                          ? "scale-105"
                          : ""
                      }`}
                      // href={`/dashboard/suppliers/${item?._id}`}
                      // scroll={false}
                    >
                      <div className="flex justify-between text-left">
                        <span>{item?.name}</span>
                        <div className="flex flex-col items-end">
                          <div
                            className={`ml-2 text-right ${
                              item.balance < 0
                                ? "text-green-500"
                                : item.balance > 0
                                ? "text-red-500"
                                : ""
                            }`}
                          >
                            {item.balance > 0
                              ? `${transactionType.supplier["Bakaya Rashi Supplier Ko"]}`
                              : item.balance < 0
                              ? `${transactionType.supplier["Adhik Bhugtan Supplier Ko"]}`
                              : ""}
                          </div>
                          {item.balance == 0 ? (
                            <div style={{ height: 24 }}></div>
                          ) : null}
                          {/* {item.balance == 0 && <div className="h-6"></div>} */}
                          <div
                            className={`ml-2 ${
                              item.balance < 0
                                ? "text-green-500"
                                : item.balance > 0
                                ? "text-red-500"
                                : ""
                            }`}
                          >
                            ₹
                            {formatNumberOrStringWithFallback(
                              Math.abs(item.balance)
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="h-5"></div>
                      <div
                        className="flex flex-col bottom-0 absolute p-4 items-start left-0  rounded-lg text-xs"
                        style={{ minWidth: 200 }}
                      >
                        {item?.latestDebitTransaction?.date && (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <BanknotesIcon className="w-4 h-4 mr-2 text-green-500" />

                              <span className="font-semibold text-green-500">
                                PM:
                              </span>
                            </div>
                            <div className="ml-1 text-green-500">
                              {calculateDuration(
                                item?.latestDebitTransaction?.date
                              )}
                            </div>
                          </div>
                        )}
                        {item?.latestCreditTransaction?.date && (
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center">
                              <ShoppingBagIcon className="w-4 h-4 mr-2 text-red-500" />
                              <span className="font-semibold text-red-500">
                                GP:
                              </span>
                            </div>
                            <div className="ml-1 text-red-500">
                              {calculateDuration(
                                item?.latestCreditTransaction?.date
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </button>
                    <div className="flex flex-row absolute bottom-0 right-0 p-4">
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
                          if (!isDemoUser(mobileNumber)) {
                            e.stopPropagation();
                            e.preventDefault();
                            setIsDeleteOpen({
                              ...isDeleteOpen,
                              status: true,
                              value: {
                                businessId: businessIdSelected,
                                supplierId: item?._id,
                              },
                            });
                          }
                        }}
                        className="w-5 h-5 text-gray-500 hover:text-red-500 cursor-pointer"
                      />
                    </div>
                  </div>
                ))}
              </div>
              <PaginationWrapper
                containerRef={containerRef}
                totalPages={getSupplierData?.totalPages}
                currentPage={page}
                setPage={setPage}
              />

              {getSupplierData?.data.length == 0 &&
                isGetSupplierSuccess == true &&
                debouncedInputValue === "" && <NoParty title={"Supplier"} />}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Supplier;

"use client";
import {
  MagnifyingGlassIcon,
  PencilSquareIcon,
  PlusCircleIcon,
  TrashIcon,
} from "@heroicons/react/20/solid";
import dynamic from "next/dynamic";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import useErrorNotification from "../custom-hooks/useErrorNotification";
import useSuccessNotification from "../custom-hooks/useSuccessNotification";
import { useGetBusinessListQuery } from "../redux/features/businessSlice";
import { dashboardApi } from "../redux/features/dashboardSlice";
import Skeleton from "react-loading-skeleton";

import {
  useDeleteSupplierMutation,
  useGetSupplierListQuery,
} from "../redux/features/supplierSlice";
import { transactionApi } from "../redux/features/transactionSlice";
import Loader from "./Loader";
import PartySkeleton from "./PartySkeleton";
// import NoParty from "./NoParty";
// import PartyModal from "./PartyModal";
const Pagination = dynamic(() => import("./Pagination"));
const NoParty = dynamic(() => import("./NoParty"));
const PartyModal = dynamic(() => import("./PartyModal"));

const Supplier = () => {
  const pathname = usePathname();
  const businessIdSelected = useSelector(
    (state) => state?.business?.businessIdSelected || ""
  );
  const dispatch = useDispatch();
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [debouncedInputValue, setDebouncedInputValue] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
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
    { skip: !businessIdSelected }
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
  } = useGetBusinessListQuery();
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

  console.log("kjhgtr5678iugvhjk", businessIdSelected, getSupplierData);
  return (
    <div
      className="shadow-lg  container m-3 w-1/2 rounded-lg p-4 border overflow-auto hover:overflow-scroll"
      style={{ height: 600 }}
    >
      {isDeleteSupplierLoading ? <Loader /> : null}
      <PartyModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        setSearchQuery={setSearchQuery}
      />

      <div className="space-y-4">
        <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="text-2xl font-bold mb-4 md:mb-0">Supplier List</div>
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
        {getSupplierData?.data?.length > 0 ||
        (getSupplierData?.data?.length == 0 && debouncedInputValue !== "") ? (
          <div className="relative">
            <input
              type="text"
              placeholder="Search.."
              onChange={(e) => setSearchQuery(e.target.value)}
              value={searchQuery}
              className="border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500 w-full"
            />
            <span className="absolute inset-y-0 right-0 flex items-center pr-3">
              <MagnifyingGlassIcon className="h-6 w-6 text-gray-400" />
            </span>
          </div>
        ) : null}
        {!businessIdSelected && isGetBusinessSuccess ? (
          <p>No business exists</p>
        ) : null}
        {!businessIdSelected && isGetBusinessLoading ? <PartySkeleton /> : null}
        {getSupplierData?.data?.length == 0 && debouncedInputValue !== "" ? (
          <p>No supplier found matching your search.</p>
        ) : null}
        {isGetSupplierLoading ? (
          <>
            <PartySkeleton />
          </>
        ) : isGetSupplierError ? (
          <p>Error fetching suppliers: {getSupplierError?.message}</p>
        ) : (
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
            <Pagination
              totalPages={getSupplierData?.totalPages}
              currentPage={page}
              setPage={setPage}
            />
            {isFetching ? (
              <div className="relative">
                <Loader wrapperStyle={{ position: "absolute", top: 20 }} />
              </div>
            ) : null}
            {getSupplierData?.data?.map((item, index) => (
              <div className="relative">
                <Link
                  key={index}
                  className={`block p-4 border rounded-md shadow-md hover:shadow-lg transition duration-300 ease-in-out ${
                    pathname.includes(item._id)
                      ? "text-blue-500 bg-blue-100 font-semibold"
                      : "text-black hover:text-blue-500 font-normal"
                  }`}
                  href={`/dashboard/suppliers/${item?._id}`}
                  scroll={false}
                >
                  <div className="flex justify-between">
                    <span>{item?.name}</span>
                    <div className="flex flex-col items-end">
                      <div>
                        {item.balance > 0
                          ? "You will give"
                          : item.balance < 0
                          ? "You will get"
                          : ""}{" "}
                      </div>
                      {item.balance == 0 && <div className="h-6"></div>}
                      <div
                        className={`ml-2 ${
                          item.balance > 0
                            ? "text-green-500"
                            : item.balance < 0
                            ? "text-red-500"
                            : ""
                        }`}
                      >
                        ₹{Math.abs(item.balance)?.toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div className="h-5"></div>
                </Link>
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
                      deleteSupplier(
                        JSON.stringify({
                          businessId: businessIdSelected,
                          supplierId: item?._id,
                        })
                      );
                    }}
                    className="w-5 h-5 text-gray-500 hover:text-red-500 cursor-pointer"
                  />
                </div>
              </div>
            ))}

            {getSupplierData?.data.length == 0 &&
              isGetSupplierSuccess == true &&
              debouncedInputValue === "" && (
                <NoParty title={"Add supplier and maintain your daily khata"} />
              )}
          </>
        )}
      </div>
    </div>
  );
};

export default Supplier;

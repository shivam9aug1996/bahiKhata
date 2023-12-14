"use client";
import {
  MagnifyingGlassIcon,
  PencilSquareIcon,
  PlusCircleIcon,
  TrashIcon,
} from "@heroicons/react/20/solid";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useErrorNotification from "../custom-hooks/useErrorNotification";
import useSuccessNotification from "../custom-hooks/useSuccessNotification";

import {
  useDeleteSupplierMutation,
  useGetSupplierListQuery,
} from "../redux/features/supplierSlice";
import { transactionApi } from "../redux/features/transactionSlice";
import Loader from "./Loader";
import NoParty from "./NoParty";
import PartyModal from "./PartyModal";

const Supplier = () => {
  const pathname = usePathname();
  const businessIdSelected = useSelector(
    (state) => state?.business?.businessIdSelected || ""
  );
  const dispatch = useDispatch();
  const router = useRouter();
  const [debouncedInputValue, setDebouncedInputValue] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const {
    isSuccess: isGetSupplierSuccess,
    isLoading: isGetSupplierLoading,
    isError: isGetSupplierError,
    error: getSupplierError,
    data: getSupplierData,
  } = useGetSupplierListQuery(
    { businessId: businessIdSelected, searchQuery: debouncedInputValue },
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
      dispatch(transactionApi.util.invalidateTags(["transaction"]));
      router.push("/dashboard/suppliers");
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
    <div className="container mx-auto p-6 w-1/2">
      {isDeleteSupplierLoading ? <Loader /> : null}
      <PartyModal isOpen={isOpen} setIsOpen={setIsOpen} />

      <div className="space-y-4">
        <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="text-2xl font-bold mb-4 md:mb-0">Supplier List</div>
          <button
            onClick={() => {
              setIsOpen({
                ...isOpen,
                status: true,
                type: "add",
              });
            }}
            className="ml-4 flex items-center text-blue-500 hover:text-blue-700"
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
        {getSupplierData?.data?.length == 0 && debouncedInputValue !== "" ? (
          <p>No supplier found matching your search.</p>
        ) : null}
        {isGetSupplierLoading ? (
          <p>Loading...</p>
        ) : isGetSupplierError ? (
          <p>Error fetching suppliers: {getSupplierError?.message}</p>
        ) : (
          <>
            {getSupplierData?.data?.map((item, index) => (
              <Link
                key={index}
                className={`block p-4 border rounded-md shadow-md hover:shadow-lg transition duration-300 ease-in-out ${
                  pathname.includes(item._id)
                    ? "text-blue-500 bg-blue-100 font-semibold"
                    : "text-black hover:text-blue-500 font-normal"
                }`}
                href={`/dashboard/suppliers/${item?._id}`}
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
                    <div
                      className={`ml-2 ${
                        item.balance > 0
                          ? "text-green-500"
                          : item.balance < 0
                          ? "text-red-500"
                          : ""
                      }`}
                    >
                      ₹{Math.abs(item.balance)}
                    </div>
                  </div>
                </div>
                <div className="flex flex-row">
                  <PencilSquareIcon
                    onClick={() => {
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
                    onClick={() => {
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
              </Link>
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

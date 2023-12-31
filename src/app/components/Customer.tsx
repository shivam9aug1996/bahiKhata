"use client";
import { MagnifyingGlassIcon, PlusCircleIcon } from "@heroicons/react/20/solid";
import dynamic from "next/dynamic";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import useErrorNotification from "../custom-hooks/useErrorNotification";
import useSuccessNotification from "../custom-hooks/useSuccessNotification";
import { useGetBusinessListQuery } from "../redux/features/businessSlice";
import {
  useDeleteCustomerMutation,
  useGetCustomerListQuery,
} from "../redux/features/customerSlice";
import { dashboardApi } from "../redux/features/dashboardSlice";
import { motion } from "framer-motion";

import Loader from "./Loader";

import PartySkeleton from "./PartySkeleton";
import { setAuthLoader, useLoginMutation } from "../redux/features/authSlice";
import Transaction from "./Transaction";
import CustomerData from "./CustomerData";
// const PartySkeleton = dynamic(() => import("./PartySkeleton"), { ssr: false });

// const CustomerData = dynamic(() => import("./CustomerData"), {
//   loading: () => <PartySkeleton />,
// });
const PartyModal = dynamic(() => import("./PartyModal"), {
  loading: () => <Loader />,
});
const NoBusinessExists = dynamic(() => import("./NoBusinessExists"), {
  loading: () => <PartySkeleton />,
});
const DeleteModal = dynamic(() => import("./DeleteModal"), {
  loading: () => <Loader />,
});

const Customer = () => {
  const pathname = usePathname();
  const businessIdSelected = useSelector(
    (state) => state?.business?.businessIdSelected || ""
  );
  const authLoader = useSelector((state) => state?.auth?.authLoader || "");
  const userId = useSelector((state) => state?.auth?.userData?.userId || null);

  const containerRef = useRef(null);

  const dispatch = useDispatch();

  const router = useRouter();
  const [debouncedInputValue, setDebouncedInputValue] = useState("");
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDeleteOpen, setIsDeleteOpen] = useState({
    status: false,
    value: null,
  });
  const {
    isSuccess: isGetCustomerSuccess,
    isLoading: isGetCustomerLoading,
    isError: isGetCustomerError,
    error: getCustomerError,
    data: getCustomerData,
    isFetching,
  } = useGetCustomerListQuery(
    {
      businessId: businessIdSelected,
      searchQuery: debouncedInputValue,
      page: page,
    },
    { skip: !businessIdSelected || !userId }
  );
  const [
    login,
    {
      isSuccess: isLoginSuccess,
      isLoading: isLoginLoading,
      isError: isLoginError,
      error: loginError,
      data: loginData,
    },
  ] = useLoginMutation();
  const {
    isSuccess: isGetBusinessSuccess,
    isLoading: isGetBusinessLoading,
    isError: isGetBusinessError,
    error: getBusinessError,
    data: getBusinessData,
  } = useGetBusinessListQuery({ userId: userId }, { skip: !userId });
  const [
    deleteCustomer,
    {
      isSuccess: isDeleteCustomerSuccess,
      isLoading: isDeleteCustomerLoading,
      isError: isDeleteCustomerError,
      error: deleteCustomerError,
      data: deleteCustomerData,
    },
  ] = useDeleteCustomerMutation();
  let [isOpen, setIsOpen] = useState({
    status: false,
    type: "",
    value: null,
    part: "customer",
  });
  useErrorNotification(getCustomerError, isGetCustomerError);
  useErrorNotification(deleteCustomerError, isDeleteCustomerError);
  useErrorNotification(getBusinessError, isGetBusinessError);
  useSuccessNotification(
    "Customer deleted successfully",
    null,
    isDeleteCustomerSuccess
  );

  useEffect(() => {
    if (isDeleteCustomerSuccess) {
      setIsDeleteOpen({ status: false, value: null });
      dispatch(dashboardApi.util.invalidateTags(["dashboard"]));
      router.push("/dashboard/customers", { scroll: false });
    }
  }, [isDeleteCustomerSuccess]);

  useEffect(() => {
    if (businessIdSelected) {
      setSearchQuery("");
      setPage(1);
    }
  }, [businessIdSelected]);

  useEffect(() => {
    dispatch(setAuthLoader(false));
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedInputValue(searchQuery);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchQuery, 500]);

  const handleDelete = (data) => {
    setIsDeleteOpen({
      ...isDeleteOpen,
      status: true,
      value: data,
    });
  };
  const handleSubmitDelete = () => {
    deleteCustomer(JSON.stringify(isDeleteOpen?.value));
  };
  return (
    <>
      <div
        className="shadow-lg  container m-3 rounded-lg p-4 border  mt-8 mb-20"
        style={{ minHeight: 600 }}
        ref={containerRef}
      >
        {isDeleteCustomerLoading ? <Loader /> : null}
        {authLoader ? <Loader /> : null}
        <div className="space-y-4">
          {businessIdSelected && (
            <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="text-2xl font-bold mb-4 md:mb-0">
                Customer List
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
                <span>Add Customer</span>
              </button>
            </div>
          )}
          {(getCustomerData?.data?.length > 0 ||
            (getCustomerData?.data?.length == 0 &&
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
            <NoBusinessExists type={"customer"} />
          ) : null}
          {!businessIdSelected && isGetBusinessLoading ? (
            <PartySkeleton />
          ) : null}
          {getCustomerData?.data?.length == 0 &&
          debouncedInputValue !== "" &&
          businessIdSelected ? (
            <p>No customers found matching your search.</p>
          ) : null}
          {isGetCustomerLoading ? (
            <PartySkeleton />
          ) : isGetCustomerError ? (
            <p>
              Error fetching customers:{" "}
              {getCustomerError?.error?.substring(0, 50)}
            </p>
          ) : !businessIdSelected || getBusinessData?.length == 0 ? null : (
            <CustomerData
              containerRef={containerRef}
              getCustomerData={getCustomerData}
              page={page}
              setPage={setPage}
              deleteCustomer={deleteCustomer}
              isGetCustomerSuccess={isGetCustomerSuccess}
              debouncedInputValue={debouncedInputValue}
              businessIdSelected={businessIdSelected}
              setIsOpen={setIsOpen}
              isOpen={isOpen}
              isFetching={isFetching}
              handleDelete={handleDelete}
            />
          )}
        </div>
        {businessIdSelected ? (
          <>
            {isOpen?.status && (
              <PartyModal
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                setSearchQuery={setSearchQuery}
              />
            )}
            {isDeleteOpen.status && (
              <DeleteModal
                setIsOpen={setIsDeleteOpen}
                isOpen={isDeleteOpen}
                title={"Delete Customer"}
                subtitle={
                  "Deleting this item will remove it permanently, along with all associated transactions. Are you sure you want to continue?"
                }
                handleSubmit={handleSubmitDelete}
              />
            )}
          </>
        ) : null}
      </div>
    </>
  );
};

export default Customer;

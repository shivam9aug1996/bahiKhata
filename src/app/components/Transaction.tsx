"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { customerApi } from "../redux/features/customerSlice";
import {
  useDeleteTransactionMutation,
  useGetTransactionListQuery,
} from "../redux/features/transactionSlice";
import dynamic from "next/dynamic";

import { usePathname } from "next/navigation";
import { supplierApi } from "../redux/features/supplierSlice";

import useErrorNotification from "../custom-hooks/useErrorNotification";
import useSuccessNotification from "../custom-hooks/useSuccessNotification";

import { dashboardApi } from "../redux/features/dashboardSlice";
import Loader from "./Loader";

import Sidebar from "./Sidebar";
const DeleteModal = dynamic(() => import("./DeleteModal"), {
  loading: () => (
    <Loader wrapperStyle={{ alignItems: "flex-start", marginTop: "20rem" }} />
  ),
});

const Transaction = ({ partyId, setIsTransactionsOpen }) => {
  let [isOpen, setIsOpen] = useState({ status: false, type: "", value: null });
  let [isFilterOpen, setIsFilterOpen] = useState({
    status: false,
    value: {},
  });
  const [isDeleteOpen, setIsDeleteOpen] = useState({
    status: false,
    value: null,
  });

  const businessIdSelected = useSelector(
    (state) => state?.business?.businessIdSelected || ""
  );

  const pathname = usePathname();
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const {
    isSuccess: isGetTransactionSuccess,
    isLoading: isGetTransactionLoading,
    isError: isGetTransactionError,
    error: getTransactionError,
    data: getTransactionData,
    isFetching,
  } = useGetTransactionListQuery(
    {
      businessId: businessIdSelected,
      partyId: partyId,
      page: page,
      ...isFilterOpen.value,
    },
    { skip: !businessIdSelected || !partyId }
  );
  const [
    deleteTransaction,
    {
      isSuccess: isDeleteTransactionSuccess,
      isLoading: isDeleteTransactionLoading,
      isError: isDeleteTransactionError,
      error: deleteTransactionError,
      data: deleteTransactionData,
    },
  ] = useDeleteTransactionMutation();
  useErrorNotification(getTransactionError, isGetTransactionError);
  useErrorNotification(deleteTransactionError, isDeleteTransactionError);
  useSuccessNotification(
    "Transaction deleted successfully",
    null,
    isDeleteTransactionSuccess
  );
  const [showSidebar, setShowSidebar] = useState(true);
  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  useEffect(() => {
    if (isDeleteTransactionSuccess) {
      setIsDeleteOpen({ status: false, value: null });
      if (pathname.includes("customer")) {
        dispatch(customerApi.util.invalidateTags(["customer"]));
        dispatch(dashboardApi.util.invalidateTags(["dashboard"]));
      } else {
        dispatch(supplierApi.util.invalidateTags(["supplier"]));
        dispatch(dashboardApi.util.invalidateTags(["dashboard"]));
      }
    }
  }, [isDeleteTransactionSuccess]);

  const handleSubmitDelete = () => {
    deleteTransaction(JSON.stringify(isDeleteOpen?.value));
    if (
      getTransactionData?.currentPage > 1 &&
      getTransactionData?.data?.length == 1
    ) {
      setPage(getTransactionData?.currentPage - 1);
    }
  };

  return (
    <>
      {isDeleteOpen?.status && (
        <DeleteModal
          setIsOpen={setIsDeleteOpen}
          isOpen={isDeleteOpen}
          title={"Delete Transaction"}
          subtitle={
            "Deleting this item will remove it permanently. Are you sure you want to continue?"
          }
          handleSubmit={handleSubmitDelete}
          loading={isDeleteTransactionLoading}
        />
      )}

      <Sidebar
        isDeleteTransactionLoading={isDeleteTransactionLoading}
        partyId={partyId}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        isGetTransactionLoading={isGetTransactionLoading}
        deleteTransaction={deleteTransaction}
        getTransactionData={getTransactionData}
        businessIdSelected={businessIdSelected}
        isGetTransactionError={isGetTransactionError}
        getTransactionError={getTransactionError}
        showSidebar={showSidebar}
        toggleSidebar={toggleSidebar}
        page={page}
        setPage={setPage}
        isFetching={isFetching}
        isFilterOpen={isFilterOpen}
        setIsFilterOpen={setIsFilterOpen}
        setIsDeleteOpen={setIsDeleteOpen}
        isDeleteOpen={isDeleteOpen}
        partyType={pathname.includes("customer") ? "customer" : "supplier"}
        setIsTransactionsOpen={setIsTransactionsOpen}
      />
    </>
  );
};

export default Transaction;

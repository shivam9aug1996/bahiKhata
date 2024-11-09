"use client";

import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useGetPublicTransactionListQuery } from "../redux/features/transactionSlice";

import useErrorNotification from "../custom-hooks/useErrorNotification";

import PublicSidebar from "./PublicSidebar";

const PublicTransaction = ({ partyId, businessId, partyType }) => {
  let [isOpen, setIsOpen] = useState({ status: false, type: "", value: null });
  let [isFilterOpen, setIsFilterOpen] = useState({
    status: false,
    value: {},
  });

  const businessIdSelected = businessId;
  console.log(businessIdSelected, partyId, partyType);

  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const {
    isSuccess: isGetTransactionSuccess,
    isLoading: isGetTransactionLoading,
    isError: isGetTransactionError,
    error: getTransactionError,
    data: getTransactionData,
    isFetching,
  } = useGetPublicTransactionListQuery(
    {
      businessId: businessIdSelected,
      partyId: partyId,
      page: page,
      partyType: partyType,
      ...isFilterOpen.value,
    },
    { skip: !businessIdSelected || !partyId }
  );

  useErrorNotification(getTransactionError, isGetTransactionError);

  const [showSidebar, setShowSidebar] = useState(true);
  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  console.log("iuytresdfghjk", getTransactionData);

  return (
    <>
      <PublicSidebar
        partyId={partyId}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        isGetTransactionLoading={isGetTransactionLoading}
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
        partyType={partyType}
        partyData={getTransactionData?.partyData}
      />
    </>
  );
};

export default PublicTransaction;

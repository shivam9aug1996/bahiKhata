"use client";
import dynamic from "next/dynamic";

import { useRouter } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import useErrorNotification from "../custom-hooks/useErrorNotification";
import usePromiseNotification from "../custom-hooks/usePromiseNotification";
import {
  setBusinessIdSelected,
  useGetBusinessListQuery,
  useUpdateBusinessMutation,
} from "../redux/features/businessSlice";
import { customerApi } from "../redux/features/customerSlice";
import { dashboardApi } from "../redux/features/dashboardSlice";
import DropDown from "./DropDown";
// const DropDown = dynamic(() => import("./DropDown"));

import Loader from "./Loader";
import Cookies from "js-cookie";
// import QrSocket from "./QrSocket";

const Dashboard = () => {
  const userId = useSelector((state) => state?.auth?.userData?.userId || null);
  // const states = useSelector((state) => state);
  const router = useRouter();
  const dispatch = useDispatch();
  const {
    isSuccess: isGetBusinessSuccess,
    isLoading: isGetBusinessLoading,
    isError: isGetBusinessError,
    error: getBusinessError,
    data: getBusinessData,
    isFetching,
  } = useGetBusinessListQuery({ userId: userId }, { skip: !userId });
  const [
    updateBusiness,
    {
      isSuccess: isUpdateBusinessSuccess,
      isLoading: isUpdateBusinessLoading,
      isError: isUpdateBusinessError,
      error: updateBusinessError,
      data: updateBusinessData,
    },
  ] = useUpdateBusinessMutation();

  useErrorNotification(getBusinessError, isGetBusinessError);
  useErrorNotification(updateBusinessError, isUpdateBusinessError);
  //usePromiseNotification(updateBusiness())
  const [selectedItem, setSelectedItem] = useState("");
  const [selectedBusinessName, setSelectedBusinessName] = useState("");

  useEffect(() => {
    if (isGetBusinessSuccess) {
      if (getBusinessData?.data?.length == 0) {
        dispatch(setBusinessIdSelected(""));
        //cookies().set("businessIdSelected", "");
        Cookies.set("businessIdSelected", "");
      } else {
        // dispatch(customerApi.util.invalidateTags(["customer"]));
        // dispatch(dashboardApi.util.invalidateTags(["dashboard"]));
      }
    }
  }, [isGetBusinessSuccess, isFetching]);

  useEffect(() => {
    if (isUpdateBusinessSuccess) {
      // setSelectedItem(el?._id);
      router.push("/dashboard/customers");
      // customerApi.util.invalidateTags["customer"];
      //dispatch(customerApi.util.invalidateTags(["customer"]));
      // dispatch(setBusinessIdSelected(el?._id));
    }
  }, [isUpdateBusinessSuccess]);

  useEffect(() => {
    let data = getBusinessData?.data?.find((item, index) => {
      return item?.primaryKey == true;
    });
    if (data?._id) {
      setSelectedItem(data?._id);
      setSelectedBusinessName(data?.name);
      dispatch(setBusinessIdSelected(data?._id));
      //cookies().set("businessIdSelected", data?._id);
      Cookies.set("businessIdSelected", data?._id);
    }
  }, [getBusinessData?.data]);

  const handleDropdownChange = (el) => {
    const selectedBusiness = getBusinessData?.data?.find(
      (item) => item._id === el?._id
    );

    updateBusiness(
      JSON.stringify({
        id: el?._id,
        primaryKey: true,
        name: selectedBusiness.name,
        userId: userId,
      })
    );
  };

  const handleAdd = () => {};
  return (
    <>
      {!userId || isUpdateBusinessLoading || isGetBusinessLoading ? (
        <Loader />
      ) : null}
      {/* <Suspense fallback={<Loader />}> */}

      <DropDown
        selectedItem={selectedItem}
        selectedBusinessName={selectedBusinessName}
        getBusinessData={getBusinessData}
        handleDropdownChange={handleDropdownChange}
        handleAdd={handleAdd}
      />
      {/* </Suspense> */}
    </>
  );
};

export default Dashboard;

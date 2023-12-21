"use client";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
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

import Loader from "./Loader";

const Dashboard = () => {
  const userId = useSelector((state) => state?.auth?.userData?.userId || null);
  const states = useSelector((state) => state);
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
  console.log("jhgfddfghj", isUpdateBusinessSuccess);

  useEffect(() => {
    if (isGetBusinessSuccess) {
      if (getBusinessData?.data?.length == 0) {
        dispatch(setBusinessIdSelected(""));
      } else {
        // dispatch(customerApi.util.invalidateTags(["customer"]));
        // dispatch(dashboardApi.util.invalidateTags(["dashboard"]));
      }
    }
  }, [isGetBusinessSuccess]);

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
      console.log(item);
      return item?.primaryKey == true;
    });
    if (data?._id) {
      console.log("mjhgfghj", data);
      setSelectedItem(data?._id);
      setSelectedBusinessName(data?.name);
      dispatch(setBusinessIdSelected(data?._id));
    }
  }, [getBusinessData?.data]);

  // const handleDropdownChange = (e) => {
  //   setSelectedItem(e.target.value);
  //   router.push("/dashboard/customers");
  //   dispatch(setBusinessIdSelected(e.target.value));
  //   const selectedBusiness = getBusinessData?.data?.find(
  //     (item) => item._id === e.target.value
  //   );
  //   // setSelectedBusinessId(e.target.value);
  //   //router.push("/dashboard/customers");
  //   updateBusiness(
  //     JSON.stringify({
  //       id: e.target.value,
  //       primaryKey: true,
  //       name: selectedBusiness.name,
  //     })
  //   );
  //   console.log(
  //     JSON.stringify({
  //       id: e.target.value,
  //       primaryKey: true,
  //       name: selectedBusiness.name,
  //     })
  //   );
  //   console.log("mjhgtr56789", e.target);
  // };
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
    // updateBusiness(
    //   JSON.stringify({
    //     id: el?._id,
    //     primaryKey: true,
    //     name: selectedBusiness.name,
    //   })
    // );

    // console.log("mjhgtr56789", e.target);
  };
  console.log(states, getBusinessData);
  const handleAdd = () => {};
  return (
    <>
      {!userId || isUpdateBusinessLoading || isGetBusinessLoading ? (
        <Loader />
      ) : null}

      <DropDown
        selectedItem={selectedItem}
        selectedBusinessName={selectedBusinessName}
        getBusinessData={getBusinessData}
        handleDropdownChange={handleDropdownChange}
        handleAdd={handleAdd}
      />
    </>
  );
};

export default Dashboard;

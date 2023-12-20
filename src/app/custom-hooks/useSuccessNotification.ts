"use client";
import { useEffect } from "react";
import toast from "react-hot-toast";

const useSuccessNotification = (
  customMessage = "",
  successObject,
  isSuccess
) => {
  let success = customMessage || successObject?.data?.message;
  success = success?.substring(0, 100);
  useEffect(() => {
    if (isSuccess) {
      toast.success(success);
    }
  }, [isSuccess, success]);
};

export default useSuccessNotification;

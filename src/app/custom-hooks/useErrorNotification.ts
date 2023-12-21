"use client";
import { useEffect } from "react";
import toast from "react-hot-toast";

const useErrorNotification = (errorObject, isError) => {
  let error =
    errorObject?.error ||
    errorObject?.data?.message ||
    errorObject?.data?.error;
  error = error?.substring(0, 100);
  useEffect(() => {
    if (isError) {
      toast.error(error);
      if (error == "Authentication failed") {
        setTimeout(() => {
          window.location.href =
            window.location.hostname +
            `/login?message=${encodeURIComponent("token not exists")}`;
        }, 500);
      }
    }
  }, [isError, error]);
};

export default useErrorNotification;

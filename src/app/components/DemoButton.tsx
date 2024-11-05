"use client";
import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import useErrorNotification from "../custom-hooks/useErrorNotification";
import { setAuthLoader, useLoginMutation } from "../redux/features/authSlice";

const DemoButton = () => {
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
  const dispatch = useDispatch();
  const router = useRouter();
  useErrorNotification(loginError, isLoginError);
  useEffect(() => {
    if (isLoginSuccess) {
      dispatch(setAuthLoader(true));
      router.replace("/dashboard/customers");
    }
  }, [isLoginSuccess]);
  return (
    <Button
      isLoading={isLoginLoading}
      isDisabled={isLoginLoading}
      onClick={() => {
        login(
          JSON.stringify({
            mobileNumber: "9999999999",
            password: "123456789",
          })
        );
      }}
      className="mt-8 mx-auto font-bold text-white bg-blue-500 hover:bg-blue-600 rounded-full shadow-md transition-all duration-300 px-8 py-3 w-fit"
    >
      {"Login to Demo Account"}
    </Button>
  );
};

export default DemoButton;

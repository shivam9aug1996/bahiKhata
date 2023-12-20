"use client";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useLogoutMutation } from "../redux/features/authSlice";
import Loader from "./Loader";

const Logout = () => {
  const router = useRouter();
  const [
    logout,
    {
      isSuccess: isLogoutSuccess,
      isLoading: isLogoutLoading,
      isError: isLogoutError,
      error: logoutError,
      data: logoutData,
    },
  ] = useLogoutMutation();

  useEffect(() => {
    if (isLogoutSuccess) {
      router.replace("/login");
    }
  }, [isLogoutSuccess]);

  return (
    <>
      {isLogoutLoading && <Loader />}
      <button
        onClick={() => {
          logout();
        }}
        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-2 py-1 rounded"
      >
        Logout
      </button>
    </>
  );
};

export default Logout;

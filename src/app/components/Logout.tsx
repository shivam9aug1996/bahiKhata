"use client";
import React, { useEffect } from "react";
import { useLogoutMutation } from "../redux/features/authSlice";
import { Button } from "@nextui-org/button";

import Loader from "./Loader";
import ButtonLoader from "./ButtonLoader";

const Logout = () => {
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
      window.location.href =
        window.location.hostname +
        `/login?message=${encodeURIComponent("token not exists")}`;
    }
  }, [isLogoutSuccess]);

  return (
    <>
      {isLogoutLoading && <Loader />}
      <Button
        onClick={() => {
          logout();
        }}
        color="primary"
        isLoading={isLogoutLoading}
        spinner={<ButtonLoader />}
        variant={"flat"}
        size={"sm"}
      >
        Logout
      </Button>
    </>
  );
};

export default Logout;

"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import useErrorNotification from "../custom-hooks/useErrorNotification";

import { setAuthLoader, useLoginMutation } from "../redux/features/authSlice";

import Cookies from "js-cookie";
import { useSearchParams } from "next/navigation";

import Lottie from "../components/Lottie";
import AuthForm from "../components/AuthForm";
import usePageLoader from "../custom-hooks/usePageLoader";

export default function Login() {
  const authLoader = useSelector((state) => state?.auth?.authLoader || "");
  const [formData, setFormData] = useState({
    mobileNumber: "",
    password: "",
  });

  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const pageLoaded = usePageLoader();

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
  useErrorNotification(loginError, isLoginError);

  useEffect(() => {
    const search = searchParams.get("message");

    console.log("kjhtr567890-hghjk", search);
    if (search == "token not exists") {
      router.refresh();
    }
    Cookies.remove("bahi_khata_user_token");
    Cookies.remove("bahi_khata_user_data");
  }, [router, searchParams, pathname]);

  useEffect(() => {
    if (isLoginSuccess) {
      console.log("hiiiiiiiuytfghjkl");
      dispatch(setAuthLoader(true));
      router.replace("/dashboard/customers");
    }
  }, [isLoginSuccess]);

  useEffect(() => {
    console.log("loaded");
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Add validation logic here
    const { mobileNumber, password } = formData;

    if (mobileNumber.trim() === "" || password.trim() === "") {
      toast.error("Please fill in all fields");
      console.log("Validation error: Please fill in all fields");
      return;
    }

    // Check if mobile number is a valid Indian mobile number
    const mobileNumberRegex = /^[6-9]\d{9}$/;
    if (!mobileNumber.match(mobileNumberRegex)) {
      toast.error("Please enter a valid Indian mobile number");
      console.log(
        "Validation error: Please enter a valid Indian mobile number"
      );
      return;
    }

    // Check if mobile number has a length of 10 digits
    if (mobileNumber.length !== 10) {
      toast.error("Mobile number should be 10 digits long");
      console.log("Validation error: Mobile number should be 10 digits long");
      return;
    }

    // Check if password has a minimum length of 8 characters
    if (password.length < 8) {
      toast.error("Password should be at least 8 characters long");
      console.log(
        "Validation error: Password should be at least 8 characters long"
      );
      return;
    }

    // Here, you can handle form submission logic, such as API requests for login
    console.log("Form submitted with:", formData);

    login(JSON.stringify(formData));
    // For demonstration purposes, just logging the form data
  };

  return (
    <>
      {isLoginLoading && <Loader />}
      {authLoader ? <Loader /> : null}
      {!pageLoaded ? <Loader /> : null}
      <AuthForm
        handleSubmit={handleSubmit}
        formData={formData}
        handleInputChange={handleInputChange}
        type={"login"}
      />
      <Lottie />
    </>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import AuthForm from "../components/AuthForm";
import Loader from "../components/Loader";
import Lottie from "../components/Lottie";

import useErrorNotification from "../custom-hooks/useErrorNotification";

import useSuccessNotification from "../custom-hooks/useSuccessNotification";
import {
  useLoginMutation,
  useSignupMutation,
} from "../redux/features/authSlice";

export default function Signup() {
  const [formData, setFormData] = useState({
    mobileNumber: "",
    password: "",
  });
  const router = useRouter();
  const [
    signup,
    {
      isSuccess: isSignupSuccess,
      isLoading: isSignupLoading,
      isError: isSignupError,
      error: signupError,
      data: signupData,
    },
  ] = useSignupMutation();
  useErrorNotification(signupError, isSignupError);
  useSuccessNotification(
    "Congratulations! You have successfully signed up.",
    null,
    isSignupSuccess
  );

  useEffect(() => {
    if (isSignupSuccess) {
      router.replace("/dashboard/customers");
    }
  }, [isSignupSuccess]);

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

    signup(JSON.stringify(formData));
    // For demonstration purposes, just logging the form data
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-100 to-gray-200 py-12 px-4 sm:px-6 lg:px-8">
      {isSignupLoading && <Loader />}
      <div className="max-w-md w-full bg-white rounded-lg shadow-md overflow-hidden">
        <AuthForm
          handleSubmit={handleSubmit}
          formData={formData}
          handleInputChange={handleInputChange}
          type={"signup"}
        />
        <Lottie />
      </div>
    </div>
  );
}

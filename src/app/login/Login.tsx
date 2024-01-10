"use client";
import dynamic from "next/dynamic";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import useErrorNotification from "../custom-hooks/useErrorNotification";

import { setAuthLoader, useLoginMutation } from "../redux/features/authSlice";

import { useSearchParams } from "next/navigation";

import AuthForm from "../components/AuthForm";
import usePageLoader from "../custom-hooks/usePageLoader";
import { deleteCookies } from "../actions";

import { Button } from "@nextui-org/react";
// import QRsocket3 from "../components/QRsocket3";
import Lottie from "../components/Lottie";
const QRsocket3 = dynamic(() => import("../components/QRsocket3"), {
  loading: () => <Loader />,
});

export default function Login() {
  const authLoader = useSelector((state) => state?.auth?.authLoader || "");
  const [formData, setFormData] = useState({
    mobileNumber: "",
    password: "",
  });
  const [qrCodeModal, setQrCodeModal] = useState({
    status: false,
    value: null,
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
    deleteCookies();

    if (search == "token not exists") {
      router.refresh();
    }
  }, [router, searchParams, pathname]);

  useEffect(() => {
    if (isLoginSuccess) {
      dispatch(setAuthLoader(true));
      router.replace("/dashboard/customers");
    }
  }, [isLoginSuccess]);

  useEffect(() => {}, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Add validation logic here
    const { mobileNumber, password } = formData;

    if (mobileNumber.trim() === "" || password.trim() === "") {
      toast.error("Please fill in all fields");

      return;
    }

    // Check if mobile number is a valid Indian mobile number
    const mobileNumberRegex = /^[6-9]\d{9}$/;
    if (!mobileNumber.match(mobileNumberRegex)) {
      toast.error("Please enter a valid Indian mobile number");

      return;
    }

    // Check if mobile number has a length of 10 digits
    if (mobileNumber.length !== 10) {
      toast.error("Mobile number should be 10 digits long");

      return;
    }

    // Check if password has a minimum length of 8 characters
    if (password.length < 8) {
      toast.error("Password should be at least 8 characters long");

      return;
    }

    // Here, you can handle form submission logic, such as API requests for login

    login(JSON.stringify({ ...formData }));
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
        loading={isLoginLoading || authLoader}
      />
      <div className="flex justify-center flex-col items-center">
        <p className="text-lg mb-3">or</p>
        <Button
          className="w-min"
          onClick={() => setQrCodeModal({ status: true, value: null })}
        >
          Generate QR to Login
        </Button>
      </div>
      <Lottie />

      {qrCodeModal?.status ? (
        <QRsocket3 isOpen={qrCodeModal} setIsOpen={setQrCodeModal} />
      ) : null}
    </>
  );
}

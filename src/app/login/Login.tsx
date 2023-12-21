"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import useErrorNotification from "../custom-hooks/useErrorNotification";

import { useLoginMutation } from "../redux/features/authSlice";

import Cookies from "js-cookie";
import { useSearchParams } from "next/navigation";

export default function Login() {
  const token = useSelector((state) => state?.auth?.token || null);
  const [formData, setFormData] = useState({
    mobileNumber: "",
    password: "",
  });
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

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
      router.replace("/dashboard/customers");
    }
  }, [isLoginSuccess]);

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-100 to-gray-200 py-12 px-4 sm:px-6 lg:px-8">
      {isLoginLoading && <Loader />}
      <div className="max-w-md w-full bg-white rounded-lg shadow-md overflow-hidden">
        <div className="py-6 px-8">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Login
          </h2>
          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="mobileNumber" className="sr-only">
                Mobile Number
              </label>
              <input
                id="mobileNumber"
                name="mobileNumber"
                type="text"
                autoComplete="tel"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-lg"
                placeholder="Mobile Number"
                value={formData.mobileNumber}
                onChange={handleInputChange}
                maxLength={10}
              />
              <div className="mt-1 text-sm text-gray-600">
                Enter your 10-digit mobile number
              </div>
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-lg"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
              />
              <div className="mt-1 text-sm text-gray-600">
                Enter your password
              </div>
            </div>
            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

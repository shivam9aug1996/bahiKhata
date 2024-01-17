import React from "react";
import { Button } from "@nextui-org/button";
import ButtonLoader from "./ButtonLoader";
import { Spinner } from "@nextui-org/react";

const AuthForm = ({
  handleSubmit,
  formData,
  handleInputChange,
  type,
  loading,
}) => {
  return (
    <div className="py-6 px-8">
      <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
        {type == "login" ? "Login" : "Signup"}
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
          <div className="mt-1 text-sm text-gray-600">Enter your password</div>
        </div>
        <div>
          <Button
            type="submit"
            className="w-full bg-red-500"
            color="primary"
            isLoading={loading}
            spinner={<Spinner size="sm" color="white" />}
          >
            {type == "login" ? "Login" : "Signup"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AuthForm;

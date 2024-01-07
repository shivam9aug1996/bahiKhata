import React from "react";
import Logo from "./Logo";

const DashboardFallback = () => {
  return (
    <>
      <div
        className="bg-white rounded-lg shadow-md p-4 flex flex-col justify-center items-start"
        style={{ height: 140 }}
      >
        <div className="flex flex-row items-center justify-between w-full">
          <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-center cursor-pointer">
            <Logo />
          </div>
          <div className="flex flex-col">
            <h3>Select your business</h3>
            <div className="">
              <div style={{ width: "200px" }} className="relative">
                <div className="flex justify-between w-full rounded-md border border-gray-400 bg-white px-2 py-3 text-sm font-medium text-gray-700 focus:outline-none">
                  Select a business
                  <div
                    className="-mr-1 h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </div>
              </div>
              <div className="flex flex-row justify-between mt-2 items-center">
                <div className="flex flex-row p-2">
                  <div className="w-5 h-5"></div>
                  <div className="w-5 h-5"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h4 className="text-center mb-4 font-bold text-lg">
            Customer Balance:
          </h4>
          <div className="flex flex-col items-center">
            <span className="text-green-500 mb-2">Business will pay: ₹0</span>
            <span className="text-red-500">Customer will Pay: ₹0</span>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h4 className="text-center mb-4 font-bold text-lg">
            Supplier Balance:
          </h4>
          <div className="flex flex-col items-center">
            <span className="text-red-500 mb-2">Business will pay: ₹0</span>
            <span className="text-green-500">Supplier will pay: ₹0</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardFallback;

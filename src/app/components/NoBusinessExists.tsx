import { BanknotesIcon } from "@heroicons/react/24/outline";
import React, { useState } from "react";
import BusinessModal from "./BusinessModal";

const NoBusinessExists = () => {
  let [isModalOpen, setIsModalOpen] = useState({
    status: false,
    type: "",
    value: null,
  });

  return (
    <div className="flex flex-col items-center justify-center">
      <BusinessModal isOpen={isModalOpen} setIsOpen={setIsModalOpen} />
      <BanknotesIcon className="text-gray-500 h-20 w-20 sm:h-24 sm:w-24 md:h-32 md:w-32 lg:h-40 lg:w-40 mb-4" />
      <h2 className="text-lg text-gray-700 text-center">
        Welcome! Let's get started with your business.
      </h2>
      <p className="text-sm text-gray-500 mt-2 text-center">
        Before adding customers/suppliers and their transactions, you need to
        create a business.
      </p>
      <button
        onClick={() => {
          setIsModalOpen({
            ...isModalOpen,
            status: true,
            value: { name: "" },
            type: "add",
          });
        }}
        className="mt-4 px-4 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-md shadow-sm focus:outline-none"
      >
        Create Business
      </button>
    </div>
  );
};

export default NoBusinessExists;

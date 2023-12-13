import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { CheckIcon } from "@heroicons/react/24/outline";
import React, { useState, useRef, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { useGetCustomerListQuery } from "../redux/features/customerSlice";
import { useGetSupplierListQuery } from "../redux/features/supplierSlice";

const DropDown = ({ handleDropdownChange, selectedItem, getBusinessData }) => {
  const [selectedOption, setSelectedOption] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const businessIdSelected = useSelector(
    (state) => state?.business?.businessIdSelected || ""
  );
  const dropdownRef = useRef(null);
  const {
    isSuccess: isGetCustomerSuccess,
    isLoading: isGetCustomerLoading,
    isError: isGetCustomerError,
    error: getCustomerError,
    data: getCustomerData,
    isFetching,
  } = useGetCustomerListQuery(
    { businessId: businessIdSelected },
    { skip: !businessIdSelected }
  );
  const {
    isSuccess: isGetSupplierSuccess,
    isLoading: isGetSupplierLoading,
    isError: isGetSupplierError,
    error: getSupplierError,
    data: getSupplierData,
  } = useGetSupplierListQuery(
    { businessId: businessIdSelected },
    { skip: !businessIdSelected }
  );
  const [balance, setBalance] = useState({
    customer: 0,
    supplier: 0,
    total: 0,
  });
  const options = getBusinessData?.data || [];
  const handleSelectChange = (option) => {
    setSelectedOption(option.name);
    setIsOpen(false);
    handleDropdownChange(option);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // const customerSum = useMemo(
  //   (getCustomerData?.data || []).reduce((accumulator, currentValue) => {
  //     return accumulator + (currentValue?.balance || 0);
  //   }, 0),
  //   [getCustomerData?.data, isGetCustomerSuccess]
  // );
  const customerSum = (getCustomerData?.data || []).reduce(
    (accumulator, currentValue) => {
      return accumulator + (currentValue?.balance || 0);
    },
    0
  );

  const supplierSum = (getSupplierData?.data || []).reduce(
    (accumulator, currentValue) => {
      return accumulator + (currentValue?.balance || 0);
    },
    0
  );

  // const supplierSum = useMemo(
  //   (getSupplierData?.data || []).reduce((accumulator, currentValue) => {
  //     return accumulator + (currentValue?.balance || 0);
  //   }, 0),
  //   [getSupplierData?.data, isGetSupplierSuccess]
  // );

  // useEffect(() => {
  //   if (isGetCustomerSuccess) {
  //     let customerSum = (getCustomerData?.data || []).reduce(
  //       (accumulator, currentValue) => {
  //         return accumulator + (currentValue?.balance || 0);
  //       },
  //       0
  //     );
  //     setBalance({ ...balance, customer: customerSum });
  //   }
  // }, [isGetCustomerSuccess]);

  // useEffect(() => {
  //   if (selectedItem) {

  //     if (getName()) setSelectedOption(getName());
  //   }
  // }, [selectedItem]);
  const getName = () => {
    let data = getBusinessData?.data?.find((item, index) => {
      console.log(item);
      return item?.primaryKey == true;
    });
    return data?.name || "Select a business";
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between sm:items-start mr-10 mt-3">
      <div className="relative inline-block text-left p-2" ref={dropdownRef}>
        Select your business
        <div style={{ width: "200px" }} className="relative">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="flex justify-between w-full rounded-md border border-gray-400 bg-white px-2 py-3 text-sm font-medium text-gray-700 focus:outline-none"
            aria-haspopup="listbox"
            aria-expanded="true"
          >
            {getName()}
            <ChevronDownIcon
              className="-mr-1 h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </button>

          {isOpen && (
            <div className="origin-top-right absolute mt-2 w-full rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
              <div className="py-1">
                {options?.map((option) => (
                  <div
                    key={option?._id}
                    onClick={() => handleSelectChange(option)}
                    className="flex flex-row justify-between cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-blue-100"
                  >
                    <span className="block font-normal text-gray-900">
                      {option?.name}
                    </span>
                    {option?._id === selectedItem && (
                      <CheckIcon
                        className="-mr-1 h-5 w-5 text-gray-600"
                        aria-hidden="true"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col mr-10 mt-3">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-center mr-2">
            Customer Balance:{" "}
            {customerSum > 0
              ? "You will give"
              : customerSum < 0
              ? "You will get"
              : ""}
          </h4>
          <span
            className={`ml-auto min-w-fit ${
              customerSum > 0
                ? "text-green-500"
                : customerSum < 0
                ? "text-red-500"
                : ""
            }`}
          >
            ₹{Math.abs(customerSum)}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <h4 className="text-center mr-2">
            Supplier Balance:{" "}
            {supplierSum > 0
              ? "You will give"
              : supplierSum < 0
              ? "You will get"
              : ""}
          </h4>
          <span
            className={`ml-auto min-w-fit ${
              supplierSum > 0
                ? "text-green-500"
                : supplierSum < 0
                ? "text-red-500"
                : ""
            }`}
          >
            ₹{Math.abs(supplierSum)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default DropDown;

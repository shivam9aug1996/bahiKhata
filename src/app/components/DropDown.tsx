"use client";
import {
  ChevronDownIcon,
  PencilSquareIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/20/solid";
import { CheckIcon } from "@heroicons/react/24/outline";
import dynamic from "next/dynamic";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useState, useRef, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import useErrorNotification from "../custom-hooks/useErrorNotification";
import useSuccessNotification from "../custom-hooks/useSuccessNotification";
import {
  businessApi,
  setBusinessIdSelected,
  useDeleteBusinessMutation,
} from "../redux/features/businessSlice";
import {
  customerApi,
  useGetCustomerListQuery,
} from "../redux/features/customerSlice";
import {
  dashboardApi,
  useGetDashboardQuery,
} from "../redux/features/dashboardSlice";
import {
  supplierApi,
  useGetSupplierListQuery,
} from "../redux/features/supplierSlice";
import { formatNumberOrStringWithFallback } from "../utils/function";
import Loader from "./Loader";
const DeleteModal = dynamic(() => import("./DeleteModal"), {
  loading: () => <Loader />,
});

// import Logo from "./Logo";
const Logo = dynamic(() => import("./Logo"));
// import Logout from "./Logout";
const Logout = dynamic(() => import("./Logout"));
const BusinessModal = dynamic(() => import("./BusinessModal"), {
  loading: () => <Loader />,
});

const DropDown = ({
  handleDropdownChange,
  selectedItem,
  getBusinessData,
  handleAdd,
  selectedBusinessName,
}) => {
  const userId = useSelector((state) => state?.auth?.userData?.userId || null);
  const mobileNumber = useSelector(
    (state) => state?.auth?.userData?.mobileNumber || null
  );
  const [selectedOption, setSelectedOption] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState({
    status: false,
    value: null,
  });
  const businessIdSelected = useSelector(
    (state) => state?.business?.businessIdSelected || ""
  );
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const dropdownRef = useRef(null);

  const {
    isSuccess: isGetDashboardSuccess,
    isLoading: isGetDashboardLoading,
    isError: isGetDashboardError,
    error: getDashboardError,
    data: getDashboardData,
  } = useGetDashboardQuery(
    { businessId: businessIdSelected },
    { skip: !businessIdSelected }
  );

  const [
    deleteBusiness,
    {
      isSuccess: isDeleteBusinessSuccess,
      isLoading: isDeleteBusinessLoading,
      isError: isDeleteBusinessError,
      error: deleteBusinessError,
      data: deleteBusinessData,
    },
  ] = useDeleteBusinessMutation();
  useErrorNotification(deleteBusinessError, isDeleteBusinessError);
  useErrorNotification(getDashboardError, isGetDashboardError);
  useSuccessNotification(
    "Business deleted successfully",
    null,
    isDeleteBusinessSuccess
  );

  let [isModalOpen, setIsModalOpen] = useState({
    status: false,
    type: "",
    value: null,
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
    if (isDeleteBusinessSuccess) {
      setIsDeleteOpen({ ...isDeleteOpen, status: false, value: null });
      if (pathname.includes("customers")) {
        router.push("/dashboard/customers");
        // dispatch(businessApi.util.resetApiState());
        // router.push("/dashboard/customers");
        // setTimeout(() => {
        dispatch(customerApi.util.invalidateTags(["customer"]));
        dispatch(dashboardApi.util.invalidateTags(["dashboard"]));
        // setTimeout(() => {
        //   dispatch(setBusinessIdSelected(""));
        // }, 500);
        //}, 500);
      } else {
        router.push("/dashboard/suppliers");
        // dispatch(businessApi.util.resetApiState());
        //setTimeout(() => {
        dispatch(supplierApi.util.invalidateTags(["supplier"]));
        dispatch(dashboardApi.util.invalidateTags(["dashboard"]));
        // setTimeout(() => {
        //   dispatch(setBusinessIdSelected(""));
        // }, 500);
        //}, 500);
      }
    }
  }, [isDeleteBusinessSuccess]);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  let {
    customerNegativeBalance = 0,
    customerPositiveBalance = 0,
    supplierNegativeBalance = 0,
    supplierPositiveBalance = 0,
  } = getDashboardData || {};

  customerNegativeBalance = businessIdSelected ? customerNegativeBalance : 0;
  customerPositiveBalance = businessIdSelected ? customerPositiveBalance : 0;
  supplierNegativeBalance = businessIdSelected ? supplierNegativeBalance : 0;
  supplierPositiveBalance = businessIdSelected ? supplierPositiveBalance : 0;

  const getName = () => {
    let data = getBusinessData?.data?.find((item, index) => {
      console.log(item);
      return item?.primaryKey == true;
    });
    return data?.name || "Select a business";
  };
  console.log("hgfdsdfghjk", getDashboardData);
  const handleDelete = () => {
    deleteBusiness(
      JSON.stringify({
        id: businessIdSelected,
        userId: userId,
      })
    );
  };
  return (
    <div>
      {isDeleteBusinessLoading ? <Loader /> : null}
      {isModalOpen?.status && (
        <BusinessModal isOpen={isModalOpen} setIsOpen={setIsModalOpen} />
      )}
      {isDeleteOpen?.status && (
        <DeleteModal
          setIsOpen={setIsDeleteOpen}
          isOpen={isDeleteOpen}
          title={"Delete Business"}
          subtitle={
            "Deleting this item will remove it permanently, along with all associated customer/supplier records and their transactions. Are you sure you want to continue?"
          }
          handleSubmit={handleDelete}
        />
      )}
      <div>
        <div className="bg-white rounded-lg shadow-md p-4 flex flex-col justify-center items-start">
          <div className="flex flex-row items-center justify-between w-full">
            <Link
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-center cursor-pointer"
              href={"/dashboard/customers"}
            >
              <Logo />
            </Link>

            <div className="flex flex-col">
              <h3>Select your business</h3>
              <div className="" ref={dropdownRef}>
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
                    <div className="origin-top-right absolute mt-2 w-full rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
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
                        <div
                          onClick={() => {
                            setIsOpen(false);
                            setIsModalOpen({
                              ...isModalOpen,
                              status: true,
                              value: { name: "" },
                              type: "add",
                            });
                          }}
                          className="flex flex-row justify-center cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-blue-100 items-center"
                        >
                          <span className="block font-normal text-gray-900 text-sm">
                            Add New Business
                          </span>
                          <PlusIcon className="w-5 h-5" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex flex-row justify-between mt-2 items-center">
                  {getBusinessData?.data?.length > 0 ? (
                    <div className="flex flex-row p-2">
                      <PencilSquareIcon
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          setIsModalOpen({
                            ...isOpen,
                            status: true,
                            type: "edit",
                            value: { name: selectedBusinessName },
                          });
                        }}
                        className="w-5 h-5 text-gray-500 hover:text-cyan-500 cursor-pointer mr-2"
                      ></PencilSquareIcon>

                      <TrashIcon
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          setIsDeleteOpen({
                            ...isDeleteOpen,
                            status: true,
                            value: businessIdSelected,
                          });
                        }}
                        className="w-5 h-5 text-gray-500 hover:text-red-500 cursor-pointer"
                      />
                    </div>
                  ) : (
                    <div className="flex flex-row p-2">
                      <div className="w-5 h-5"></div>
                      <div className="w-5 h-5"></div>
                    </div>
                  )}
                  <Logout />
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
            <span className="text-green-500 mb-2">
              You will give: ₹
              {formatNumberOrStringWithFallback(customerPositiveBalance)}
            </span>
            <span className="text-red-500">
              You will get: ₹
              {formatNumberOrStringWithFallback(
                Math.abs(customerNegativeBalance)
              )}
            </span>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h4 className="text-center mb-4 font-bold text-lg">
            Supplier Balance:
          </h4>
          <div className="flex flex-col items-center">
            <span className="text-green-500 mb-2">
              You will give: ₹
              {formatNumberOrStringWithFallback(supplierPositiveBalance)}
            </span>
            <span className="text-red-500">
              You will get: ₹
              {formatNumberOrStringWithFallback(
                Math.abs(supplierNegativeBalance)
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DropDown;

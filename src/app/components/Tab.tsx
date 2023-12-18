"use client";
import { useState } from "react";
import Link from "next/link";
import { Tab } from "@headlessui/react";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { useGetCustomerListQuery } from "../redux/features/customerSlice";
import { useGetSupplierListQuery } from "../redux/features/supplierSlice";
import { useGetDashboardQuery } from "../redux/features/dashboardSlice";

const MainTab = () => {
  const [currentTab, setCurrentTab] = useState("customer");
  const businessIdSelected = useSelector(
    (state) => state?.business?.businessIdSelected || ""
  );
  const {
    isSuccess: isGetCustomerSuccess,
    isLoading: isGetCustomerLoading,
    isError: isGetCustomerError,
    error: getCustomerError,
    data: getCustomerData,
    isFetching,
  } = useGetCustomerListQuery(
    { businessId: businessIdSelected, searchQuery: "" },
    { skip: true }
  );
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
  const {
    isSuccess: isGetSupplierSuccess,
    isLoading: isGetSupplierLoading,
    isError: isGetSupplierError,
    error: getSupplierError,
    data: getSupplierData,
  } = useGetSupplierListQuery(
    { businessId: businessIdSelected, searchQuery: "" },
    { skip: true }
  );
  const pathname = usePathname();
  const isActive = (tabName) => {
    return pathname.includes(`/dashboard/${tabName}`)
      ? "bg-blue-500 text-white"
      : "bg-gray-300 hover:bg-gray-400 text-gray-700";
  };
  return (
    <div>
      <Tab.Group>
        <Tab.List className="flex p-4 space-x-4 bg-gray-200">
          <Link
            className={`w-full text-center py-2 rounded-lg ${isActive(
              "customers"
            )}`}
            href="/dashboard/customers"
          >
            {`Customer ${
              getDashboardData?.totalCustomers >= 0 && businessIdSelected
                ? `(${getDashboardData?.totalCustomers})`
                : ""
            } `}
          </Link>
          <Link
            className={`w-full text-center py-2 rounded-lg ${isActive(
              "suppliers"
            )}`}
            href="/dashboard/suppliers"
          >
            {`Supplier ${
              getDashboardData?.totalSuppliers >= 0 && businessIdSelected
                ? `(${getDashboardData?.totalSuppliers})`
                : ""
            } `}
          </Link>
        </Tab.List>
      </Tab.Group>
    </div>
  );
};

export default MainTab;

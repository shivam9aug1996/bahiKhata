import { PencilSquareIcon, TrashIcon } from "@heroicons/react/20/solid";
import dynamic from "next/dynamic";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { useDispatch } from "react-redux";
import { setSelectedCustomer } from "../redux/features/businessSlice";
import { formatNumberOrStringWithFallback } from "../utils/function";
import Loader from "./Loader";
import Skeleton from "react-loading-skeleton";
const Pagination = dynamic(() => import("./Pagination"), {
  loading: () => (
    <Skeleton duration={0.3} height={42} style={{ marginTop: 16 }} />
  ),
});

const NoParty = dynamic(() => import("./NoParty"));
// import NoParty from "./NoParty";
// import Pagination from "./Pagination";

const CustomerData = ({
  getCustomerData,
  page,
  setPage,
  deleteCustomer,
  isGetCustomerSuccess,
  debouncedInputValue,
  businessIdSelected,
  setIsOpen,
  isOpen,
  isFetching,
}) => {
  const pathname = usePathname();
  const dispatch = useDispatch();
  return (
    <>
      <Pagination
        totalPages={getCustomerData?.totalPages}
        currentPage={page}
        setPage={setPage}
      />
      {isFetching ? (
        <div className="relative">
          <Loader wrapperStyle={{ position: "absolute", top: 20 }} />
        </div>
      ) : null}
      {getCustomerData?.data?.map((item, index) => (
        <div className="relative">
          <Link
            key={index}
            className={`block p-4 border rounded-md shadow-md hover:shadow-lg transition duration-300 ease-in-out ${
              pathname.includes(item._id)
                ? "text-blue-500 bg-blue-100 font-semibold"
                : "text-black hover:text-blue-500 font-normal"
            }`}
            onClick={() => dispatch(setSelectedCustomer(item))}
            href={`/dashboard/customers/${item?._id}`}
            scroll={false}
          >
            <div className="flex flex-col sm:flex-row justify-between ">
              <span>{item?.name}</span>
              <div className="flex flex-col items-end">
                <div>
                  {item.balance > 0
                    ? "You will give"
                    : item.balance < 0
                    ? "You will get"
                    : ""}{" "}
                </div>
                <div
                  className={`ml-2 ${
                    item.balance > 0
                      ? "text-green-500"
                      : item.balance < 0
                      ? "text-red-500"
                      : ""
                  }`}
                >
                  ₹{formatNumberOrStringWithFallback(Math.abs(item.balance))}
                </div>
              </div>
            </div>
            <div className="h-5"></div>
          </Link>
          <div className="flex flex-row absolute bottom-0 p-4">
            <PencilSquareIcon
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setIsOpen({
                  ...isOpen,
                  status: true,
                  type: "edit",
                  value: item,
                });
              }}
              className="w-5 h-5 text-gray-500 hover:text-cyan-500 cursor-pointer mr-2"
            ></PencilSquareIcon>

            <TrashIcon
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                deleteCustomer(
                  JSON.stringify({
                    businessId: businessIdSelected,
                    customerId: item?._id,
                  })
                );
              }}
              className="w-5 h-5 text-gray-500 hover:text-red-500 cursor-pointer"
            />
          </div>
        </div>
      ))}

      {getCustomerData?.data.length == 0 &&
        isGetCustomerSuccess == true &&
        debouncedInputValue === "" && (
          // <Suspense fallback={<p>98765loading...</p>}>
          <NoParty title={"Add customer and maintain your daily khata"} />
          // </Suspense>
        )}
    </>
  );
};

export default CustomerData;

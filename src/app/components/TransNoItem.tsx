"use client";

import { UsersIcon } from "@heroicons/react/24/outline";
import { usePathname } from "next/navigation";
import React from "react";

const TransNoItem = ({ title }) => {
  const pathname = usePathname();
  if (
    pathname === "/dashboard/customers" ||
    pathname == "/dashboard/suppliers"
  ) {
    return (
      <div
        style={{
          backgroundColor: "#f5f5f5",
          width: "47%",
          color: "black",
          display: "flex",
          justifyContent: "center",
          padding: 50,
          height: "fit-content",
        }}
      >
        <div className="flex flex-col justify-center text-center">
          <UsersIcon className="text-gray-500 w-50 h-50" />
          <p className="text-gray-600 text-sm">{title}</p>
        </div>
      </div>
    );
  } else return null;
};

export default TransNoItem;

"use client";
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
          height: "100vh",
          width: "50%",
          color: "black",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div>{title}</div>
      </div>
    );
  } else return null;
};

export default TransNoItem;

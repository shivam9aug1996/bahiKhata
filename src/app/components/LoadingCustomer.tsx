import React from "react";
import PartySkeleton from "./PartySkeleton";

const LoadingCustomer = () => {
  return (
    <div
      className="shadow-lg  container m-3 w-1/2 rounded-lg p-4 border overflow-auto hover:overflow-scroll"
      style={{ height: 600 }}
    >
      <PartySkeleton />
    </div>
  );
};

export default LoadingCustomer;

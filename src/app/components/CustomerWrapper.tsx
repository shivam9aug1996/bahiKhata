import React from "react";
import PartySkeleton from "./PartySkeleton";

const CustomerWrapper = () => {
  return (
    <>
      <div
        className="shadow-lg  container m-3 rounded-lg p-4 border overflow-auto hover:overflow-scroll mt-8"
        style={{ height: 600 }}
      >
        <PartySkeleton />
      </div>
    </>
  );
};

export default CustomerWrapper;

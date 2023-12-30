import React from "react";

const loading = () => {
  return (
    <div>
      <div
        style={{ width: "100%" }}
        className={`shadow-md border bg-gray-100 fixed inset-y-0 right-0 z-500 transition-transform duration-300 ease-in-out transform overflow-auto hover:overflow-scroll max-h-full pb-10`}
      >
        <div className="flex justify-center items-center h-1/2">Loading...</div>
      </div>
    </div>
  );
};

export default loading;

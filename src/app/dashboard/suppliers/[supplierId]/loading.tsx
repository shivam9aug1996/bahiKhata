import React from "react";

const loading = () => {
  return (
    <div className="flex h-screen">
      <div
        style={{ width: "100%" }}
        id={"sidebar"}
        className={`shadow-md border bg-gray-100 fixed inset-y-0 right-0 z-500 transition-transform duration-300 ease-in-out transform overflow-auto hover:overflow-scroll max-h-full pb-10`}
      ></div>
    </div>
  );
};

export default loading;

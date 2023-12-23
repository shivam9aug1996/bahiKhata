import React from "react";

const MainTabFallBack = () => {
  return (
    <div className="flex p-4 space-x-4 bg-gray-200">
      <div className="w-full text-center py-2 rounded-lg bg-blue-500 text-white">
        Customer{" "}
      </div>
      <div className="w-full text-center py-2 rounded-lg bg-gray-300 hover:bg-gray-400 text-gray-700">
        Supplier{" "}
      </div>
    </div>
  );
};

export default MainTabFallBack;

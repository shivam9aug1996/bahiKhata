import { BookOpenIcon } from "@heroicons/react/24/outline";
import React from "react";

const NoTransaction = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        padding: 30,
        height: "fit-content",
        marginTop: 100,
      }}
    >
      <div className="flex flex-col justify-center text-center">
        <BookOpenIcon className="text-gray-500 w-50 h-50" />
        {"No entries added"}
      </div>
    </div>
  );
};

export default NoTransaction;

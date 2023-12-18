import { UserPlusIcon } from "@heroicons/react/24/outline";
import React from "react";

const NoParty = ({ title }) => {
  return (
    <div className="flex justify-center items-center">
      <div className="text-center">
        <UserPlusIcon className="text-gray-500 h-20 sm:h-20 md:h-32 lg:h-40 mx-auto mb-4" />
        <p className="text-gray-600 text-sm">
          Add {title} and maintain your daily khata
        </p>
      </div>
    </div>
  );
};

export default NoParty;

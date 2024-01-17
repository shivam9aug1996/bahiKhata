import React from "react";

const AuthServer = ({ children }) => {
  return (
    <div
      className="flex items-start justify-center bg-gradient-to-r from-gray-100 to-gray-200 py-12 px-4 sm:px-6 lg:px-8"
      style={{ minHeight: "100vh" }}
    >
      <div
        className="max-w-md w-full bg-white rounded-lg shadow-md overflow-hidden"
        style={{ height: "100%" }}
      >
        {children}
      </div>
    </div>
  );
};

export default AuthServer;

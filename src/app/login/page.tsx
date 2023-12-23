import React from "react";
import AuthServer from "../components/AuthServer";
import Login from "./Login";

const page = () => {
  return (
    <AuthServer>
      <Login />
    </AuthServer>
  );
};

export default page;

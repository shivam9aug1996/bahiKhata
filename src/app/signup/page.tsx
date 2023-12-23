import React from "react";
import AuthServer from "../components/AuthServer";
import Signup from "./Signup";

const page = () => {
  return (
    <AuthServer>
      <Signup />
    </AuthServer>
  );
};

export default page;

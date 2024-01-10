import React, { Suspense } from "react";
import AuthPlaceholder from "../components/AuthPlaceholder";
import AuthServer from "../components/AuthServer";
import Login from "./Login";

const page = () => {
  return (
    <AuthServer>
      <Suspense fallback={<AuthPlaceholder type={"login"} />}>
        <Login />
      </Suspense>
    </AuthServer>
  );
};

export default page;

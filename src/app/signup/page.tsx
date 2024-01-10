import React, { Suspense } from "react";
import AuthPlaceholder from "../components/AuthPlaceholder";
import AuthServer from "../components/AuthServer";
import Signup from "./Signup";

const page = () => {
  return (
    <AuthServer>
      <Suspense fallback={<AuthPlaceholder type={"signup"} />}>
        <Signup />
      </Suspense>
    </AuthServer>
  );
};

export default page;

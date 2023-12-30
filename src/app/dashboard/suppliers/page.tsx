import LoadingCustomer from "@/app/components/LoadingCustomer";
import dynamic from "next/dynamic";
import React from "react";
const Supplier = dynamic(() => import("@/app/components/Supplier"), {
  loading: () => <LoadingCustomer />,
  ssr: false,
});

const page = () => {
  return <Supplier />;
};

export default page;

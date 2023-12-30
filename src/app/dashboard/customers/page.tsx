import LoadingCustomer from "@/app/components/LoadingCustomer";
import dynamic from "next/dynamic";
import React from "react";
const Customer = dynamic(() => import("@/app/components/Customer"), {
  loading: () => <LoadingCustomer />,
  ssr: false,
});
const page = () => {
  return (
    <>
      <Customer />
    </>
  );
};

export default page;

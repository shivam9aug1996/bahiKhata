// import Customer from "@/app/components/Customer";
import CustomerWrapper from "@/app/components/CustomerWrapper";
import LoadingCustomer from "@/app/components/LoadingCustomer";
import dynamic from "next/dynamic";
import React, { Suspense } from "react";
const Customer = dynamic(() => import("@/app/components/Customer"), {
  loading: () => <CustomerWrapper />,
  ssr: false,
});
const page = () => {
  return <Customer />;
};

export default page;

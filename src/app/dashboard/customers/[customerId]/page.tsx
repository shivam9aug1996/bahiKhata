import Transaction from "@/app/components/Transaction";
import React from "react";

const page = ({ params }) => {
  return <Transaction partyId={params?.customerId} />;
};

export default page;

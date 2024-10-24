// "use client";
// import React, { useState } from "react";
// import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
// import { Button } from "@nextui-org/react";
// import { useRouter } from "next/navigation";

// const page = () => {
//   const [searchQuery, setSearchQuery] = useState("");
//   const router = useRouter();

//   return (
//     <div className="flex" style={{ height: "100vh" }}>
//       <div className="flex flex-row h-10 relative" style={{ maxWidth: 250 }}>
//         <input
//           type="number"
//           maxLength={10}
//           placeholder="Mobile number.."
//           onChange={(e) => {
//             setSearchQuery(e.target.value);
//           }}
//           value={searchQuery}
//           className="border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500 w-full"
//         />
//         <span className="inset-y-0 right-0 flex items-center pr-3 absolute">
//           <MagnifyingGlassIcon className="h-6 w-6 text-gray-400" />
//         </span>
//       </div>
//       <Button
//         onClick={() => {
//           router.push(`/mykhata/${searchQuery}`);
//         }}
//         type="button"
//         className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
//       >
//         {"Submit"}
//       </Button>
//     </div>
//   );
// };

// export default page;

"use client";
import React from "react";
import { useSearchParams } from "next/navigation";
import Transaction from "../components/Transaction";
import PublicTransaction from "../components/PublicTransaction";

const page = () => {
  const searchParams = useSearchParams();
  const businessId = searchParams.get("businessId");

  const partyId = searchParams.get("partyId");
  const partyType = searchParams.get("partyType");

  return (
    <PublicTransaction
      partyId={partyId}
      businessId={businessId}
      partyType={partyType}
    />
  );
};

export default page;

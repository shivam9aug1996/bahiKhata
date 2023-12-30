// import Supplier from "@/app/components/Supplier";
// import TransNoItem from "@/app/components/TransNoItem";
const Supplier = dynamic(() => import("@/app/components/Supplier"), {
  loading: () => <LoadingCustomer />,
  ssr: false,
});
import LoadingCustomer from "@/app/components/LoadingCustomer";
import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { Inter } from "next/font/google";
const TransNoItem = dynamic(() => import("@/app/components/TransNoItem"));
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BahiKhata",
  description: "Simplify Business Management",
};

export default function SupplierLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-row justify-center">
      <Supplier />
      {/* <TransNoItem title={"No supplier selected"} /> */}
      {children}
    </div>
  );
}

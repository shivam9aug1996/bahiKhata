import Supplier from "@/app/components/Supplier";
import TransNoItem from "@/app/components/TransNoItem";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

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
    <div className="flex flex-row">
      <Supplier />
      <TransNoItem title={"No supplier selected"} />
      {children}
    </div>
  );
}

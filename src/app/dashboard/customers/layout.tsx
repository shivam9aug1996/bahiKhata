import Customer from "@/app/components/Customer";
import TransNoItem from "@/app/components/TransNoItem";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BahiKhata",
  description: "Simplify Business Management",
};

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-row">
      <Customer />
      <TransNoItem title={"No customer selected"} />
      {children}
    </div>
  );
}

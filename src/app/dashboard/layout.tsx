import type { Metadata } from "next";

import Link from "next/link";
import Dashboard from "../components/Dashboard";
import NavBar from "../components/NavBar";
import Sidebar from "../components/Sidebar";
import MainTab from "../components/Tab";

export const metadata: Metadata = {
  title: "BahiKhata",
  description: "Simplify Business Management",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Dashboard />
      {/* <NavBar /> */}
      <MainTab />
      {/* <Link href={"/dashboard/customers"}>Customer</Link>
      <Link href={"/dashboard/suppliers"}>Supplier</Link> */}
      {children}
    </>
  );
}

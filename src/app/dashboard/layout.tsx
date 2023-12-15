import type { Metadata } from "next";
import dynamic from "next/dynamic";
// import Dashboard from "../components/Dashboard";
// import MainTab from "../components/Tab";
const MainTab = dynamic(() => import("../components/Tab"));
const Dashboard = dynamic(() => import("../components/Dashboard"));

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

import { Tab } from "@headlessui/react";
import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import Dashboard from "../components/Dashboard";
import Logo from "../components/Logo";
import MainTab from "../components/Tab";
//const MainTab = dynamic(() => import("../components/Tab"));
// import DashboardFallback from "../components/DashboardFallback";
// import MainTabFallBack from "../components/MainTabFallBack";

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
      {/* <Suspense fallback={<DashboardFallback />}> */}
      <Dashboard />
      {/* </Suspense> */}
      {/* <Suspense fallback={<MainTabFallBack />}> */}
      <MainTab />
      {/* </Suspense> */}
      {children}
    </>
  );
}

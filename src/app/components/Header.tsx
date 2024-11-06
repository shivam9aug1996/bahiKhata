"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import HeaderNavLink from "./HeaderNavLink";
import Logo from "./Logo";

const Header = () => {
  const pathname = usePathname();

  if (pathname.includes("dashboard")) {
    return null;
  }
  const isMyKhataView = pathname.includes("mykhata");
  return (
    <div
      className="bg-white rounded-lg shadow-md p-4 flex flex-col justify-center items-start sticky top-0"
      style={{ zIndex: isMyKhataView ? 11 : 1 }}
    >
      <div className="flex flex-row items-center justify-between w-full">
        <Link
          className="text-3xl md:text-4xl lg:text-5xl font-bold text-center cursor-pointer"
          style={{ pointerEvents: isMyKhataView ? "none" : "auto" }}
          href={"/"}
        >
          <Logo />
        </Link>
        {isMyKhataView ? null : (
          <div className="flex items-center space-x-4">
            <HeaderNavLink title={"Home"} path={"/"} />
            <HeaderNavLink title={"Login"} path={"/login"} />
            <HeaderNavLink title={"Signup"} path={"/signup"} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;

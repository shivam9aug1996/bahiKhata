"use client";
import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

const HeaderNavLink = ({ path, title }) => {
  const pathname = usePathname();
  console.log(pathname, path);
  const isActive = pathname === path;

  return (
    <Link
      className={`text-base md:text-lg lg:text-xl text-gray-700 hover:text-gray-900 ${
        isActive ? "font-bold text-red-500" : "font-normal hover:text-red-500"
      }`}
      href={path}
    >
      {title}
    </Link>
  );
};

export default HeaderNavLink;

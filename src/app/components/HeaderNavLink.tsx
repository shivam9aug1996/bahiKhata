"use client";
import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

const HeaderNavLink = ({ path, title }) => {
  const pathname = usePathname();

  const isActive = pathname === path;

  return (
    <Link
      className={`text-base md:text-lg lg:text-xl text-gray-700  ${
        isActive ? "font-bold text-red-500" : "font-normal"
      }`}
      href={path}
    >
      {title}
    </Link>
  );
};

export default HeaderNavLink;

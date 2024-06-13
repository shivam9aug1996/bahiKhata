import { Button } from "@nextui-org/react";
import Link from "next/link";
import React from "react";
import DemoButton from "./DemoButton";
import HeroLottie from "./HeroLottie";

const Hero = () => {
  return (
    <header className="max-w-2xl mx-auto py-16 px-4 sm:px-6 lg:px-8 text-center">
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-4">
        Welcome to{" "}
        <span className="logo text-3xl sm:text-4xl md:text-5xl lg:text-5xl text-red-500 md:text-black">
          Bahi
        </span>
        <span className="logo text-3xl sm:text-4xl md:text-5xl lg:text-5xl text-black md:text-red-500">
          Khata
        </span>
      </h1>
      <p className="text-lg text-gray-600">
        Keep track of your trusted customers' credit and debit transactions.
      </p>

      <div className="mt-8 flex flex-col">
        <Link
          className="mt-8 mx-auto   font-bold text-white bg-red-500 hover:bg-red-600 rounded-full shadow-md transition-all duration-300 px-8 py-3 w-fit"
          href={"/signup"}
        >
          Get Started
        </Link>
        <DemoButton />
      </div>
    </header>
  );
};

export default Hero;

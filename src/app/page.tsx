import { CurrencyRupeeIcon } from "@heroicons/react/24/outline";

import React from "react";

import Hero from "./components/Hero";
import HeroLottie from "./components/HeroLottie";

const Home = () => {
  return (
    <div className="bg-gray-100">
      <Hero />

      <section className="bg-white py-16 px-4 sm:px-6 lg:px-8 pt-0">
        <HeroLottie />
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 text-center">
              How BahiKhata works
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CurrencyRupeeIcon className="h-10 w-10 text-red-500" />
              </div>
              <div className="ml-4">
                <h3 className="text-xl md:text-2xl font-bold text-gray-900">
                  Keep track of transactions
                </h3>
                <p className="mt-2 text-gray-600">
                  Record credit (Jama) and debit (Udhar) transactions for your
                  trusted customers, enabling you to keep track of their
                  balances.
                </p>
              </div>
            </div>

            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CurrencyRupeeIcon className="h-10 w-10 text-red-500" />
              </div>
              <div className="ml-4">
                <h3 className="text-xl md:text-2xl font-bold text-gray-900">
                  Manage your customers
                </h3>
                <p className="mt-2 text-gray-600">
                  Easily add, edit, and remove customers from your BahiKhata,
                  making it convenient to keep track of different individuals.
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CurrencyRupeeIcon className="h-10 w-10 text-red-500" />
              </div>
              <div className="ml-4">
                <h3 className="text-xl md:text-2xl font-bold text-gray-900">
                  Manage your suppliers
                </h3>
                <p className="mt-2 text-gray-600">
                  Easily add, edit, and remove suppliers from your BahiKhata,
                  making it convenient to keep track of different individuals.
                </p>
              </div>
            </div>
            {/* Add more features here */}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

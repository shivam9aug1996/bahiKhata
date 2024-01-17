import React from "react";
import {
  ArrowDownTrayIcon,
  BuildingStorefrontIcon,
  CurrencyRupeeIcon,
  PhotoIcon,
  QrCodeIcon,
  UserIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import Hero from "./components/Hero";
import HeroLottie from "./components/HeroLottie";
import { Image } from "@nextui-org/react";

const features = [
  {
    icon: <CurrencyRupeeIcon className="h-10 w-10 text-red-500" />,
    title: "Keep track of transactions",
    description:
      "Record credit (Jama) and debit (Udhar) transactions for your trusted customers.",
  },
  {
    icon: <UserIcon className="h-10 w-10 text-red-500" />,
    title: "Manage your customers",
    description: "Easily add, edit, and remove customers from your BahiKhata.",
  },
  {
    icon: <UsersIcon className="h-10 w-10 text-red-500" />,
    title: "Manage your suppliers",
    description: "Easily add, edit, and remove suppliers from your BahiKhata.",
  },
  {
    icon: <BuildingStorefrontIcon className="h-10 w-10 text-red-500" />,
    title: "Manage Multiple Businesses",
    description:
      "Switch between and manage multiple businesses within your BahiKhata account.",
  },
  {
    icon: <ArrowDownTrayIcon className="h-10 w-10 text-red-500" />,
    title: "Download PDF of Transactions",
    description:
      "Generate and download PDF reports of all transactions for customers or suppliers.",
  },
  {
    icon: <QrCodeIcon className="h-10 w-10 text-red-500" />,
    title: "Login to Other Devices via QR Code",
    description:
      "Scan a QR code to securely log in to your BahiKhata account from any other device.",
  },
];

const Home = () => {
  return (
    <div className="bg-gray-100">
      <Hero />

      <section className="bg-white py-16 px-4 sm:px-6 lg:px-8 pt-0">
        <HeroLottie />
        <div className="mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 text-center">
              Explore{" "}
              <span className="logo text-3xl md:text-4xl lg:text-5xl text-red-500 md:text-black">
                Bahi
              </span>
              <span className="logo text-3xl md:text-4xl lg:text-5xl text-black md:text-red-500">
                Khata
              </span>{" "}
              Features
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                // className="bg-white rounded-lg p-6 shadow-md flex items-start"
                className="bg-white rounded-lg p-6 shadow-md flex items-start transform transition-transform hover:scale-105"
              >
                <div className="flex-shrink-0">{feature.icon}</div>
                <div className="ml-4">
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* New Section: Desktop and Mobile Versions */}
          <div className="mt-12 flex items-center justify-evenly">
            <div className="max-w-lg text-left">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Choose Your Version
              </h3>
              <p className="text-gray-600 text-xl">
                Experience BahiKhata on both desktop and mobile devices.
              </p>
            </div>
            <div className="flex justify-center mt-4 md:ml-8">
              <Image
                isBlurred
                src="/laptop_website.png"
                width={500}
                height={500}
                alt="Desktop Version"
              />
            </div>
          </div>

          {/* add a new section saying that you can use desktop version or mobile version
          <Image src="/laptop_website.png" width={500} height={500} /> */}
        </div>
      </section>
    </div>
  );
};

export default Home;

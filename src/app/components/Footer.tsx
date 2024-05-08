import React from "react";

const Footer = () => {
  return (
    <footer className="bg-white text-gray-800 py-6 shadow-2xl shadow-black absolute bottom-0">
      <div className="mx-auto flex flex-col justify-center items-center px-4 footer-content">
        <p>
          &copy; {new Date().getFullYear()}{" "}
          <span className="text-black-500 font-bold">Bahi</span>
          <span className="text-red-500 font-bold">Khata</span> | Created by
          Shivam Garg
        </p>
        <div>
          <p>Contact: +91 9634396572</p>
          {/* You can add additional contact details, social media links, or any other relevant information here */}
        </div>
      </div>
    </footer>
  );
};

export default Footer;

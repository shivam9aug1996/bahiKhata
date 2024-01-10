import React from "react";

const Footer = () => {
  return (
    <footer className="bg-white text-gray-800 py-6 shadow-2xl shadow-black">
      <div
        className="mx-auto flex flex-col justify-start px-4"
        style={{ marginRight: 60 }}
      >
        <p className="text-sm">
          &copy; {new Date().getFullYear()} BahiKhata | Created by Shivam Garg
        </p>
        <div>
          <p className="text-sm">Contact: +91 9634396572</p>
          {/* You can add additional contact details, social media links, or any other relevant information here */}
        </div>
      </div>
    </footer>
  );
};

export default Footer;

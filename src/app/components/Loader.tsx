"use client";
import React from "react";
import styles from "./loader.module.css";
const Loader = ({ wrapperStyle = {} }) => {
  return (
    <div
      className={`fixed top-0 left-0 w-full h-full flex items-center justify-center bg-white bg-opacity-5`}
      style={{ zIndex: 510000, ...wrapperStyle }}
    >
      {/* <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4"></div> */}
      {/* <h2 className="text-center text-xl text-gray-900">Loading...</h2> */}
      <div className={styles.spinner}></div>
    </div>
  );
};

export default Loader;

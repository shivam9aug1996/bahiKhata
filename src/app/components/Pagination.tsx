"use client";
import React from "react";

const Pagination = ({ totalPages, currentPage, setPage, containerRef }) => {
  const showPages = 3; // Number of pages to display
  const pageNumbers = Array.from(
    { length: totalPages },
    (_, index) => index + 1
  );

  const calculatePagesToShow = () => {
    if (totalPages <= showPages) {
      return pageNumbers;
    } else if (currentPage <= Math.ceil(showPages / 2)) {
      return pageNumbers.slice(0, showPages);
    } else if (currentPage >= totalPages - Math.floor(showPages / 2)) {
      return pageNumbers.slice(-showPages);
    } else {
      return pageNumbers.slice(
        currentPage - Math.floor(showPages / 2) - 1,
        currentPage + Math.ceil(showPages / 2) - 1
      );
    }
  };

  const pagesToShow = calculatePagesToShow();

  return (
    <div className="flex justify-center mt-4 flex-wrap">
      {currentPage > Math.ceil(showPages / 2) && totalPages > showPages && (
        <>
          <button
            className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-200 focus:outline-none m-1"
            onClick={() => {
              setPage(1);
              containerRef?.current?.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
            }}
          >
            1
          </button>
          <span className="px-3 py-1 border border-gray-300 rounded m-1">
            ...
          </span>
        </>
      )}

      {pagesToShow.map((page, index) => (
        <button
          key={index}
          className={`px-3 py-1 border border-gray-300 rounded hover:bg-gray-200 focus:outline-none m-1 ${
            currentPage === page
              ? "bg-gray-400 text-white"
              : "bg-white text-gray-700"
          }`}
          onClick={() => {
            setPage(page);
            containerRef?.current?.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }}
        >
          {page}
        </button>
      ))}

      {currentPage < totalPages - Math.floor(showPages / 2) &&
        totalPages > showPages && (
          <>
            <span className="px-3 py-1 border border-gray-300 rounded m-1">
              ...
            </span>
            <button
              className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-200 focus:outline-none m-1"
              onClick={() => {
                setPage(totalPages);
                containerRef?.current?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
              }}
            >
              {totalPages}
            </button>
          </>
        )}
    </div>
  );
};

export default Pagination;

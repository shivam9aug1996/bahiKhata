import React from "react";
import { Pagination } from "@nextui-org/react";
const PaginationWrapper = ({
  totalPages = 1,
  containerRef,
  currentPage,
  setPage,
}) => {
  const handleSetPage = (data) => {
    containerRef?.current?.scrollIntoView({
      behavior: "instant",
      block: "start",
    });
    setTimeout(() => {
      setPage(data);
    }, 100);
  };
  return (
    <div
      className="flex flex-col gap-5 items-center mt-10"
      style={{ zIndex: 0, position: "relative" }}
    >
      <Pagination
        total={totalPages}
        color="primary"
        page={currentPage}
        onChange={handleSetPage}
        loop
        showControls
      />
    </div>
  );
};

export default PaginationWrapper;

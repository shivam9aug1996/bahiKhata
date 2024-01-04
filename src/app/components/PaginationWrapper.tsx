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
    <div className="flex flex-col gap-5 items-center">
      <p className="text-small text-default-500">
        Selected Page: {currentPage}
      </p>
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

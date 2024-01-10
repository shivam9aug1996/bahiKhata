import React, { memo } from "react";
import { Pagination } from "@nextui-org/react";
const PaginationWrapper = ({
  totalPages = 1,
  containerRef,
  currentPage = 1,
  setPage,
}) => {
  const handleSetPage = (data) => {
    setTimeout(() => {
      containerRef?.current?.scrollIntoView({
        behavior: "instant",
        block: "start",
      });
    }, 200);
    setTimeout(() => {
      setPage(data);
    }, 200);
  };
  console.log(currentPage, totalPages);
  if (currentPage > totalPages) return null;
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

export default memo(PaginationWrapper);

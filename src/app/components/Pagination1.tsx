import React from "react";
import { Pagination, Button } from "@nextui-org/react";

const Pagination1 = ({
  currentPage,
  setCurrentPage,
  containerRef,
  totalPages,
}) => {
  const handleSetPage = (data) => {
    containerRef?.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
    setTimeout(() => {
      setCurrentPage(data);
    }, 350);
  };
  return (
    <div className="flex flex-col gap-5">
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

export default Pagination1;

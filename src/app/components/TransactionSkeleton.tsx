import React from "react";
import Skeleton from "react-loading-skeleton";

const TransactionSkeleton = () => {
  return (
    <>
      <Skeleton duration={0.3} height={42} style={{ marginTop: 16 }} />
      <Skeleton
        duration={0.3}
        count={10}
        height={106}
        style={{ marginTop: 16 }}
      />
    </>
  );
};

export default TransactionSkeleton;

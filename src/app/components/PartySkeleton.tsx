import { Skeleton } from "@nextui-org/react";
import React from "react";
import { Spacer } from "@nextui-org/react";

const PartySkeleton = () => {
  return (
    <>
      <Skeleton style={{ maxWidth: 250, height: 42 }} />
      <Skeleton style={{ marginTop: 16, height: 42 }} />
      <Skeleton style={{ marginTop: 16, height: 102 }} />
      <Skeleton style={{ marginTop: 16, height: 102 }} />
      <Skeleton style={{ marginTop: 16, height: 102 }} />
      <Skeleton style={{ marginTop: 16, height: 102 }} />
      <Skeleton style={{ marginTop: 16, height: 102 }} />
      <Skeleton style={{ marginTop: 16, height: 102 }} />
      <Skeleton style={{ marginTop: 16, height: 102 }} />
      <Skeleton style={{ marginTop: 16, height: 102 }} />
      <Skeleton style={{ marginTop: 16, height: 102 }} />
    </>
  );
};

export default PartySkeleton;

import React, { useEffect, useState } from "react";

const usePageLoader = () => {
  const [pageLoaded, setPageLoaded] = useState(false);
  useEffect(() => {
    setPageLoaded(true);
  }, []);
  return pageLoaded;
};

export default usePageLoader;

import { useEffect } from "react";
import toast from "react-hot-toast";

const usePromiseNotification = (myPromise) => {
  useEffect(() => {
    toast.promise(myPromise, {
      loading: "Loading",
      success: "Got the data",
      error: "Error when fetching",
    });
  }, []);
};

export default usePromiseNotification;

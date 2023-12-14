import { useEffect } from "react";
import toast from "react-hot-toast";

const useErrorNotification = (errorMessage, isError) => {
  useEffect(() => {
    if (isError) {
      toast.error(errorMessage?.substring(0, 50) || "Something went wrong");
    }
  }, [isError, errorMessage, toast]);
};

export default useErrorNotification;

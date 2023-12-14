import { useEffect } from "react";
import toast from "react-hot-toast";

const useErrorNotification = (errorObject, isError) => {
  let error = errorObject?.error || errorObject?.data?.message;
  error = error?.substring(0, 100);
  useEffect(() => {
    if (isError) {
      toast.error(error);
    }
  }, [isError, error]);
};

export default useErrorNotification;

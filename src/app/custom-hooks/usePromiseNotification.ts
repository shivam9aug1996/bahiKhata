import { useEffect } from "react";
import toast from "react-hot-toast";

const usePromiseNotification = (
  myPromise,
  promiseParam,
  success = {
    successCustomMessage: "",
    successObject: {},
    isSuccess: false,
  },
  error = {
    errorCustomMessage: "",
    errorObject: {},
    isError: false,
  },
  loadingMessage = "Loading"
) => {
  let successCustomMessage = success?.successCustomMessage || "";
  let successObject = success?.successObject;
  let isSuccess = success?.isSuccess;
  let errorCustomMessage = error?.errorCustomMessage;
  let errorObject = error?.errorObject;
  let isError = error?.isError;

  let successMessage = successCustomMessage || successObject?.data?.message;
  successMessage = successMessage?.substring(0, 100);
  let errorMessage =
    errorCustomMessage || errorObject?.error || errorObject?.data?.message;
  errorMessage = errorMessage?.substring(0, 100);
  useEffect(() => {
    toast.promise(myPromise, {
      loading: loadingMessage,
      success: successMessage,
      error: errorMessage,
    });
  }, []);
};

export default usePromiseNotification;

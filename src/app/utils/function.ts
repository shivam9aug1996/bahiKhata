import toast from "react-hot-toast";
import getBrowserFingerprint from "get-browser-fingerprint";

export function formatNumberOrStringWithFallback(input = 0) {
  // Convert the input to a number if it's a string representation of a number
  const number = typeof input === "string" ? parseFloat(input) : input;

  let formattedNumber;

  if (!isNaN(number)) {
    try {
      // Attempt to format using 'en-IN' locale
      formattedNumber = number?.toLocaleString("en-IN");
    } catch (error) {
      console.error("Formatting with 'en-IN' locale failed:", error);
      try {
        // Fallback to 'en-US' or any other preferred default locale
        formattedNumber = number?.toLocaleString("en-US");
      } catch (fallbackError) {
        console.error("Fallback to default locale also failed:", fallbackError);
        // If all else fails, return a basic formatting using a fixed method
        formattedNumber = number?.toLocaleString(); // Uses browser's default locale
      }
    }
  } else {
    // If input couldn't be converted to a number, return the input as is
    formattedNumber = input;
  }

  return formattedNumber;
}

// Example usage:
const userInput = "1234567.89"; // User input as a string
const formatted = formatNumberOrStringWithFallback(userInput);

export const countNonEmptyKeys = (obj) => {
  let count = 0;
  for (const key in obj) {
    if (obj[key] !== "" && obj[key] !== undefined && obj[key] !== null) {
      count++;
    }
  }
  return count;
};

export const todayDate = () => {
  // return new Date()
  //   .toLocaleDateString("en-IN")
  //   ?.split("/")
  //   ?.reverse()
  //   ?.join("-");
  return formatDateToYYYYMMDD(new Date());
};

function formatDateToYYYYMMDD(date) {
  const currentDate = new Date(date);

  // Get the year, month, and day
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Month starts from 0
  const day = String(currentDate.getDate()).padStart(2, "0");

  // Create the formatted date string in yyyy-mm-dd format
  const formattedDate = `${year}-${month}-${day}`;
  return formattedDate;
}

export const promiseToast = (
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

  toast.promise(myPromise(promiseParam), {
    loading: loadingMessage,
    success: (data) => JSON.stringify(data),
    error: (data) => JSON.stringify(data),
  });
};

export const deviceData = (window, navigator) => {
  return {
    userAgent: navigator.userAgent,
    screenResolution: `${window.screen.width}x${window.screen.height}`,
    language:
      navigator.language ||
      navigator.userLanguage ||
      navigator.browserLanguage ||
      navigator.systemLanguage ||
      "",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "",
  };
};

export const getFp = async () => {
  // const fp = await FingerprintJS.load();
  // const { visitorId } = await fp.get();

  // return visitorId;

  const fingerprint = getBrowserFingerprint();
  return fingerprint;
};

export const isValidData = (data) => {
  if (
    data === null ||
    data === undefined ||
    data === "" ||
    data == "null" ||
    data == "undefined"
  ) {
    return false;
  }

  if (typeof data === "object" && Object.keys(data).length === 0) {
    return false;
  }

  return true;
};

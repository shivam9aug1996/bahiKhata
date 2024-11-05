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

  // if (typeof data === "object" && Object.keys(data).length === 0) {
  //   return false;
  // }

  return true;
};

// export const transactionType = {
//   customer: {
//     ["Customer Ko Maal Becha"]: "Maal Becha",
//     ["Customer Se Bhugtan Prapt"]: "Bhugtan Prapt",
//     ["Bakaya Rashi Customer Se"]: "Bakaya Rashi",
//     ["Adhik Bhugtan Customer Se"]: "Adhik Bhugtan",
//   },
//   supplier: {
//     ["Supplier Ko Payment Ki"]: "Payment Ki",
//     ["Supplier Se Maal Khareeda"]: "Maal Khareeda",
//     ["Bakaya Rashi Supplier Ko"]: "Bakaya Rashi",
//     ["Adhik Bhugtan Supplier Ko"]: "Adhik Bhugtan",
//   },
// };

export const transactionType = {
  customer: {
    ["Customer Ko Maal Becha"]: "Goods Sold",
    ["Customer Se Bhugtan Prapt"]: "Payment Received",
    ["Bakaya Rashi Customer Se"]: "Customer will Pay",
    ["Adhik Bhugtan Customer Se"]: "Business will pay",
    ["Last Payment Received"]: "PR",
    ["Last Goods Sold"]: "GS",
    ["Dukandaar Se Maal Khareeda"]: "Goods Purchased",
    ["Dukandaar Ko Payment Ki"]: "Payment Made",
  },
  supplier: {
    ["Supplier Ko Payment Ki"]: "Payment Made",
    ["Supplier Se Maal Khareeda"]: "Goods Purchased",
    ["Bakaya Rashi Supplier Ko"]: "Business will Pay",
    ["Adhik Bhugtan Supplier Ko"]: "Supplier will pay",
    ["Dukandaar Ko Maal Becha"]: "Goods Sold",
    ["Dukandaar Se Bhugtan Prapt"]: "Payment Received",
  },
};

// export const transactionType = {
//   customer: {
//     ["Customer Ko Maal Becha"]: "Customer Ko Maal Becha",
//     ["Customer Se Bhugtan Prapt"]: "Customer Se Bhugtan Prapt",
//     ["Bakaya Rashi Customer Se"]: "Bakaya Rashi Customer Se",
//     ["Adhik Bhugtan Customer Se"]: "Adhik Bhugtan Customer Se",
//   },
//   supplier: {
//     ["Supplier Ko Payment Ki"]: "Supplier Ko Payment Ki",
//     ["Supplier Se Maal Khareeda"]: "Supplier Se Maal Khareeda",
//     ["Bakaya Rashi Supplier Ko"]: "Bakaya Rashi Supplier Ko",
//     ["Adhik Bhugtan Supplier Ko"]: "Adhik Bhugtan Supplier Ko",
//   },
// };

export const calculateDuration = (dateStr) => {
  // Parse the date string into a Date object
  const inputDate = new Date(dateStr);

  // Get the current date
  const currentDate = new Date();

  // Calculate the difference in milliseconds
  const differenceInMilliseconds = currentDate.getTime() - inputDate.getTime();

  // Convert the difference to days
  const differenceInDays = Math.floor(
    differenceInMilliseconds / (1000 * 60 * 60 * 24)
  );

  // Determine if the input date is in the past or future
  const isPast = differenceInDays > 0;

  // Calculate years, months, and remaining days
  const years = Math.floor(differenceInDays / 365);
  const remainingDaysAfterYears = differenceInDays % 365;
  const months = Math.floor(remainingDaysAfterYears / 30);
  const days = remainingDaysAfterYears % 30;

  // Construct the duration string based on the calculated values
  let durationStr = "";

  if (years > 0) {
    durationStr += years + " year" + (years === 1 ? "" : "s");
    if (months > 0 || days > 0) {
      durationStr += ", ";
    }
  }

  if (months > 0) {
    durationStr += months + " month" + (months === 1 ? "" : "s");
    if (days > 0) {
      durationStr += ", ";
    }
  }

  if (days > 0) {
    durationStr += days + " day" + (days === 1 ? "" : "s");
  }

  if (durationStr === "") {
    durationStr = "Today";
  } else {
    // Add "ago" for past dates, "from now" for future dates
    durationStr += isPast ? " ago" : " from now";
  }

  return durationStr;
};

export const calculateSecondsElapsed = (initialTime) => {
  // Get the current time in milliseconds
  let currentTime = new Date().getTime();

  // Calculate the difference in milliseconds
  let timeElapsedInMilliseconds = currentTime - initialTime;

  // Convert milliseconds to seconds
  let timeElapsedInSeconds = timeElapsedInMilliseconds / 1000;

  return timeElapsedInSeconds;
};

export const truncateString = (str = "", maxLength = 20) => {
  return str?.length > maxLength ? str?.slice(0, maxLength - 3) + "..." : str;
};

export const isDemoUser = (mobileNumber: string | number) => {
  if (mobileNumber == "999999999" || mobileNumber == 999999999) {
    demoError();
    return true;
  } else {
    return false;
  }
};

export const demoError = () =>
  toast.error("Demo user cannot perform this action.");

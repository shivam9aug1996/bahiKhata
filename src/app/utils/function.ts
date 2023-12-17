export function formatNumberOrStringWithFallback(input = 0) {
  // Convert the input to a number if it's a string representation of a number
  const number = typeof input === "string" ? parseFloat(input) : input;

  let formattedNumber;

  if (!isNaN(number)) {
    try {
      // Attempt to format using 'en-IN' locale
      formattedNumber = number.toLocaleString("en-IN");
    } catch (error) {
      console.error("Formatting with 'en-IN' locale failed:", error);
      try {
        // Fallback to 'en-US' or any other preferred default locale
        formattedNumber = number.toLocaleString("en-US");
      } catch (fallbackError) {
        console.error("Fallback to default locale also failed:", fallbackError);
        // If all else fails, return a basic formatting using a fixed method
        formattedNumber = number.toLocaleString(); // Uses browser's default locale
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
console.log("Formatted Number:", formatted);

export const countNonEmptyKeys = (obj) => {
  let count = 0;
  for (const key in obj) {
    console.log("kjuytr4567890", key, obj[key]);
    if (obj[key] !== "" && obj[key] !== undefined && obj[key] !== null) {
      count++;
    }
  }
  return count;
};

export const todayDate = () => {
  return new Date()
    .toLocaleDateString("en-IN")
    ?.split("/")
    ?.reverse()
    ?.join("-");
};

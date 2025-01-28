import type { App } from "vue";

// Define the price formatting logic
function formatPrice(value: number): string {
  // Handle the case where the value is zero
  if (value === 0) {
    return "0.0";
  }

  // Round to 12 decimal places for precision
  const roundedValue = value.toFixed(12);
  const [integerPart, decimalPart] = roundedValue.split(".");

  if (!decimalPart) {
    return "0."; // No decimal part
  }

  // Check if there are leading zeros
  const firstNonZeroIndex = decimalPart.search(/[^0]/);
  if (firstNonZeroIndex === 0) {
    // No leading zeros, return the rounded value as is
    return roundedValue;
  }

  // Count the number of leading zeros after the decimal
  const zeroCount = firstNonZeroIndex; // Number of leading zeros
  const remainingDigits = decimalPart.slice(zeroCount); // Digits after the leading zeros

  // Display logic: show one zero explicitly, count of remaining zeros as subscript, and digits
  const displayedZeroCount = zeroCount > 1 ? `<sub>${zeroCount - 1}</sub>` : "";

  return `0.0${displayedZeroCount}${remainingDigits}`;
}

// Plugin to register the formatting logic
export default function (app: App) {
  app.config.globalProperties.$formatPrice = formatPrice;
}

// Optional: Export the function for external usage or testing
export { formatPrice };

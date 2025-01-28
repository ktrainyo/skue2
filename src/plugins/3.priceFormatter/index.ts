import type { App } from "vue";

// Define the price formatting logic
export function formatPrice(value: number): string {
  // Handle the case where the value is zero
  if (value === 0) {
    return "0.0";
  }

  // For values >= 10001, round to the nearest 1000 and append "k"
  if (value >= 10001) {
    const roundedValue = Math.round(value / 1000); // Nearest thousand
    return `${roundedValue}k`;
  }

  // For values >= 1 and <= 10000, round to the nearest whole number
  if (value >= 1 && value <= 10000) {
    return `${Math.round(value).toLocaleString()}`; // Use commas for readability
  }

  // For values >= 0.0001 and < 1, show up to 8 decimal points
  if (value >= 0.0001) {
    return `${value.toFixed(8)}`;
  }

  // For values < 0.0001, use subscript for leading zeros after "0.0"
  const roundedValue = value.toFixed(12); // Ensure precision to 12 decimal places
  const [integerPart, decimalPart] = roundedValue.split(".");

  if (!decimalPart) {
    return "0."; // No decimal part
  }

  // Find the first non-zero index in the decimal part
  const firstNonZeroIndex = decimalPart.search(/[^0]/);
  if (firstNonZeroIndex === -1) {
    return "0.0"; // Edge case: all zeros
  }

  const zeroCount = firstNonZeroIndex; // Number of leading zeros
  const remainingDigits = decimalPart.slice(zeroCount); // Remaining digits after leading zeros
  const displayedZeroCount = zeroCount > 1 ? `<sub>${zeroCount - 1}</sub>` : "";

  return `0.0${displayedZeroCount}${remainingDigits}`;
}

// Plugin to register the formatting logic
export default function (app: App) {
  app.config.globalProperties.$formatPrice = formatPrice;
}

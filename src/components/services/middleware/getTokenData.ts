import axios from "axios";

const BASE_URL = "http://192.168.50.226:8082";

export async function getTokenData(token: string) {
  console.log("Token received:", token);
  const apiUrl = `${BASE_URL}/tokens/${token}`;
  console.log("Sending request to API:", apiUrl);
  try {
    const response = await axios.get(apiUrl);
    if (response.status === 200) {
      return "Successfully fetched token data.";
    } else {
      throw new Error("Failed to fetch token data.");
    }
  } catch (error) {
    const err = error as any;
    if (err.response) {
      // Server responded with a status other than 200 range
      console.error("Error response:", err.response.data);
      throw new Error(
        `Failed to fetch token data: ${err.response.data.message}`
      );
    } else if (err.request) {
      // Request was made but no response received
      console.error("Error request:", err.request);
      throw new Error(
        "Failed to fetch token data: No response received from server."
      );
    } else {
      // Something else happened while setting up the request
      console.error("Error message:", err.message);
      throw new Error(`Failed to fetch token data: ${err.message}`);
    }
  }
}

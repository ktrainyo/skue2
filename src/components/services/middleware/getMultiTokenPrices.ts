const BASE_URL = "http://192.168.50.226:8082";

export async function getMultiTokenPrices(tokens: string[]): Promise<any> {
  if (!tokens || tokens.length === 0)
    throw new Error("Tokens parameter is required and cannot be empty");

  const queryString = tokens.join(",");
  const response = await fetch(`${BASE_URL}/price/multi?tokens=${queryString}`);
  if (!response.ok) {
    throw new Error(
      `Failed to fetch multi-token prices: ${response.statusText}`
    );
  }

  return await response.json();
}

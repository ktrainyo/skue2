const BASE_URL = "http://192.168.50.226:8082";

export async function getTokenTrades(token: string): Promise<any> {
  if (!token) {
    throw new Error("Token parameter is required");
  }
  const response = await fetch(`${BASE_URL}/trades/${token}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch token trades: ${response.statusText}`);
  }
  return await response.json();
}

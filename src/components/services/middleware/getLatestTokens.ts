const BASE_URL = "http://192.168.50.226:8082";

export async function getLatestTokens(page: number = 1): Promise<any> {
  if (page < 1 || page > 10) {
    throw new Error("Page parameter must be between 1 and 10");
  }
  const response = await fetch(`${BASE_URL}/tokens/latest?page=${page}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch latest tokens: ${response.statusText}`);
  }
  return await response.json();
}

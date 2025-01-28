const BASE_URL = "http://192.168.50.226:8082";

export async function getFirstBuyers(token: string): Promise<any> {
  if (!token) throw new Error("Token parameter is required");
  const response = await fetch(`${BASE_URL}/first-buyers/${token}`);
  if (!response.ok)
    throw new Error(`Failed to fetch first buyers: ${response.statusText}`);

  return await response.json();
}

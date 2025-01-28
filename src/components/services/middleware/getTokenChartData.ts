const BASE_URL = "http://192.168.50.226:8082";

export async function getTokenChartData(
  token: string,
  type: string = "5m",
  timeFrom?: number,
  timeTo?: number
): Promise<any> {
  if (!token) {
    throw new Error("Token parameter is required");
  }

  const params = new URLSearchParams();
  params.append("type", type);
  if (timeFrom) params.append("time_from", timeFrom.toString());
  if (timeTo) params.append("time_to", timeTo.toString());

  const response = await fetch(
    `${BASE_URL}/chart/${token}?${params.toString()}`
  );
  if (!response.ok) {
    throw new Error(`Failed to fetch chart data: ${response.statusText}`);
  }
  return await response.json();
}

import axios from "axios";
import qs from "qs";

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

// Create axios instance with base configuration
export const strapiClient = axios.create({
  baseURL: `${STRAPI_URL}/api`,
  headers: {
    "Content-Type": "application/json",
    ...(STRAPI_API_TOKEN && { Authorization: `Bearer ${STRAPI_API_TOKEN}` }),
  },
});

// Helper function to build query parameters
export function buildQuery(params: Record<string, any>) {
  return qs.stringify(params, { encodeValuesOnly: true });
}

// Generic GET request
export async function get<T>(
  endpoint: string,
  params?: Record<string, any>
): Promise<T> {
  const query = params ? `?${buildQuery(params)}` : "";
  const response = await strapiClient.get<T>(`${endpoint}${query}`);
  return response.data;
}

// Generic POST request
export async function post<T>(endpoint: string, data: any): Promise<T> {
  try {
    const response = await strapiClient.post<T>(endpoint, { data });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.error("Strapi API Error Response:", {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
      });
    }
    throw error;
  }
}

// Generic PUT request
export async function put<T>(endpoint: string, data: any): Promise<T> {
  const response = await strapiClient.put<T>(endpoint, { data });
  return response.data;
}

// Generic DELETE request
export async function del<T>(endpoint: string): Promise<T> {
  const response = await strapiClient.delete<T>(endpoint);
  return response.data;
}

// Helper to get media URL
export function getStrapiMediaUrl(url: string | null | undefined): string {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `${STRAPI_URL}${url}`;
}

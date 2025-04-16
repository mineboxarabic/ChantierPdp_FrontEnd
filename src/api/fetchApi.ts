// api.ts
import axios, { AxiosResponse, AxiosRequestConfig } from 'axios';

export interface ApiResponse<T> {
    message?: string;
    data?: T;
}

// Create axios instance with default configuration
const api = axios.create({
    baseURL: 'http://localhost:8080',
    timeout: 10000, // 10 seconds timeout
    withCredentials: true // Important for CORS with credentials
});

const getHeaders = (): Record<string, string> => {
    const token = localStorage.getItem("token");
    return {
        "Content-Type": "application/json",
        "Accept": "application/json",
        // IMPORTANT: Remove these headers as they're causing CORS issues
        // "Access-Control-Allow-Origin": "*",
        // "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
};

/**
 * Enhanced fetch function with proper CORS handling
 * @param url API endpoint
 * @param method HTTP method
 * @param data Request payload
 * @param errors Custom error messages
 * @returns Promise with response data
 */
export async function fetchApi<T>(
    url: string,
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    data: any = null,
    errors: Array<{ status: number, message: string }> = []
): Promise<ApiResponse<T>> {
    try {
        // Configure the request
        const config: AxiosRequestConfig = {
            method,
            url,
            headers: getHeaders(),
            data: method !== 'GET' ? data : undefined,
        };

        // Make the request using our configured axios instance
        const response = await api(config);


        return response.data;
    } catch (error: any) {
        console.group(`API Error: ${url}`);
        console.error(error);

        // Special handling for CORS errors
        if (error.message && error.message.includes('Network Error')) {
            console.error('This appears to be a CORS issue. Server must set proper CORS headers.');
        }
        // if error status is 401, it means the token is expired
        if (error.response?.status === 401) {
            console.error('Token expired. Please log in again.');
            localStorage.removeItem("token");
            window.location.reload();
        }

        console.groupEnd();

        const status = error.response?.status || -1;
        const customError = errors.find(err => err.status === status);

        if (customError) {
            throw new Error(customError.message);
        } else if (error.response) {
            throw new Error(`Server error: ${error.response.status} ${error.response.statusText}`);
        } else {
            throw error;
        }
    }
}

export default fetchApi;
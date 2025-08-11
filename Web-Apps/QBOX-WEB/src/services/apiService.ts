import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// Environment variables for domain and prefix URL
const DOMAIN = import.meta.env.VITE_API_DOMAIN;
// const PRIFIX_URL = import.meta.env.VITE_API_MASTER_PREFIX_URL;

let axiosInstance: AxiosInstance = axios.create();

// Function to get the base URL dynamically based on the port
const getApiBaseUrl = (port: string, PRIFIX_URL: string): string => {
    return `${DOMAIN}:${port}${PRIFIX_URL}`;
};

// Reinitialize Axios instance after getting the user-defined port
const initializeAxiosInstance = (port: string, PRIFIX_URL: string) => {
    const baseURL = getApiBaseUrl(port, PRIFIX_URL);

    axiosInstance = axios.create({
        baseURL,
        headers: {
            'Content-Type': 'application/json',
        },
        timeout: 10000, // Default timeout of 10 seconds
    });

    // console.log('Axios Instance Initialized with Base URL:', baseURL);
};

// A simple Circuit Breaker implementation (Basic Version)
class CircuitBreaker {
    private failureCount: number = 0;
    private threshold: number = 3; // Threshold of failures before circuit breaks
    private open: boolean = false;
    private resetTimeout: any;

    constructor(private resetTimeoutMs: number = 30000) { }

    public async call<T>(apiCall: () => Promise<T>): Promise<T> {
        if (this.open) {
            throw new Error('Circuit is open, temporarily unavailable.');
        }

        try {
            const result = await apiCall();
            this.failureCount = 0; // Reset failure count on success
            return result;
        } catch (error) {
            this.failureCount += 1;

            if (this.failureCount >= this.threshold) {
                this.openCircuit();
            }

            throw error;
        }
    }

    private openCircuit() {
        this.open = true;
        // console.log('Circuit is open due to too many failures');
        this.resetTimeout = setTimeout(() => this.closeCircuit(), this.resetTimeoutMs);
    }

    private closeCircuit() {
        this.open = false;
        this.failureCount = 0;
        // console.log('Circuit is closed again');
    }
}

// Initialize the Circuit Breaker
const circuitBreaker = new CircuitBreaker();

interface ApiServiceConfig extends AxiosRequestConfig {
    headers?: Record<string, string>;
    port?: string; // Accepts an optional port number
    PRIFIX_URL?: string;
}

// API Service with dynamic Axios instance
export const apiService = {
    get: async <T>(endpoint: string, port: string, PRIFIX_URL: string, config: ApiServiceConfig = {}): Promise<T> => {
        initializeAxiosInstance(port, PRIFIX_URL); // Ensure Axios is configured with the correct port
        const response = await circuitBreaker.call<T>(async () => {
            const res = await axiosInstance.get(endpoint, {
                ...config,
                headers: {
                    ...config.headers,
                },
            });

            return res.data;
        });

        return response;
    },

    post: async <T>(endpoint: string, data: any, port: string, PRIFIX_URL: string, config: ApiServiceConfig = {}): Promise<T> => {
        initializeAxiosInstance(port, PRIFIX_URL); // Ensure Axios is configured with the correct port
        const response = await circuitBreaker.call<T>(async () => {
            const res = await axiosInstance.post(endpoint, data, {
                ...config,
                headers: {
                    ...config.headers,
                },
            });

            return res.data;
        });

        return response;
    },

    put: async <T>(endpoint: string, data: any, port: string, PRIFIX_URL: string, config: ApiServiceConfig = {}): Promise<T> => {
        initializeAxiosInstance(port, PRIFIX_URL); // Ensure Axios is configured with the correct port
        const response = await circuitBreaker.call<T>(async () => {
            const res = await axiosInstance.put(endpoint, data, {
                ...config,
                headers: {
                    ...config.headers,
                },
            });

            return res.data;
        });

        return response;
    },

    delete: async <T>(endpoint: string, port: string, PRIFIX_URL: string, config: ApiServiceConfig = {}): Promise<T> => {
        initializeAxiosInstance(port, PRIFIX_URL); // Ensure Axios is configured with the correct port
        const response = await circuitBreaker.call<T>(async () => {
            const res = await axiosInstance.delete(endpoint, {
                ...config,
                headers: {
                    ...config.headers,
                },
            });

            return res.data;
        });

        return response;
    },
};

// Helper function to get Authorization token if needed
const getAuthHeaders = (): Record<string, string> => {
    const token = localStorage.getItem('authToken'); // Example: Getting JWT from localStorage
    if (token) {
        return { Authorization: `Bearer ${token}` };
    }
    return {}; // Return an empty object if no token
};

// Example of a secure GET request with JWT authentication
const secureGet = async <T>(endpoint: string, port: string, PRIFIX_URL: string): Promise<T> => {
    const authHeaders = getAuthHeaders();
    return apiService.get<T>(endpoint, port, PRIFIX_URL, { headers: authHeaders });
};

// Example of a secure POST request with JWT authentication
const securePost = async <T>(endpoint: string, data: any, port: string, PRIFIX_URL: string): Promise<T> => {
    const authHeaders = getAuthHeaders();
    return apiService.post<T>(endpoint, data, port, PRIFIX_URL, { headers: authHeaders });
};


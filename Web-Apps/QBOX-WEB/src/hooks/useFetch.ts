// import { useState, useEffect, useCallback } from 'react';
// import { apiService } from '../services/apiService'; // Assuming you export it from apiService.ts
// const DOMAIN = import.meta.env.VITE_API_DOMAIN;
// const PRIFIX_URL = import.meta.env.VITE_API_MASTER_PREFIX_URL;
// const PORT_NUMBER = import.meta.env.VITE_API_QBOX_MASTER_PORT;

// interface FetchState<T> {
//     data: T | null;
//     error: string | null;
//     loading: boolean;
// }

// type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

// interface UseFetchOptions {
//     method?: HttpMethod;
//     payload?: any; // For POST and PUT requests
//     config?: Record<string, any>; // Additional Axios config
//     port?: string; // Port number for the request
//     baseUrl?: string; // Base URL of the API
// }

// export const useFetch = <T>(
//     endpoint: string,
//     options: UseFetchOptions = { method: 'GET' }
// ): [FetchState<T>, () => void] => {
//     const {
//         method = 'GET',
//         payload = null,
//         config = {},
//         port = '8091',
//         baseUrl = 'http://localhost', // Default base URL
//     } = options;

//     // Construct the full URL dynamically
//     const url = `${baseUrl}:${port}${endpoint}`;

//     const [state, setState] = useState<FetchState<T>>({
//         data: null,
//         error: null,
//         loading: true,
//     });

//     const fetchData = useCallback(async () => {
//         setState({ data: null, error: null, loading: true });
//         try {
//             let response: T;

//             // Use appropriate apiService method based on the HTTP method
//             switch (method) {
//                 case 'GET':
//                     response = await apiService.get<T>(url, config);
//                     break;
//                 case 'POST':
//                     response = await apiService.post<T>(url, payload, config);
//                     break;
//                 case 'PUT':
//                     response = await apiService.put<T>(url, payload, config);
//                     break;
//                 case 'DELETE':
//                     response = await apiService.delete<T>(url, config);
//                     break;
//                 default:
//                     throw new Error(`Unsupported HTTP method: ${method}`);
//             }

//             setState({ data: response, error: null, loading: false });
//         } catch (error: any) {
//             setState({ data: null, error: error.message || 'An error occurred', loading: false });
//         }
//     }, [url, method, payload, config]);

//     useEffect(() => {
//         fetchData();
//     }, [fetchData]);

//     return [state, fetchData];
// };

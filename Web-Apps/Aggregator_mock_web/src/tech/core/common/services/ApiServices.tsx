import axios from "axios";

const ApiService = async (
  PORT_NUMBER: any,
  method: any,
  url: any,
  data = {},
  params = null
) => {
  // const DOMAIN = "http://40.81.234.172";
  const DOMAIN = "http://192.168.1.22";

  const BASE_URL = `${DOMAIN}:${PORT_NUMBER}/api/v1/masters`;

  try {
    // const token = sessionStorage.getItem('token')??null;
    // if (!token) {
    //   throw new Error("Token not found in sessionStorage");
    // }

    const axiosInstance = axios.create({
      baseURL: BASE_URL,
      timeout: 100000,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });

    let response;
    switch (method.toLowerCase()) {
      case "get":
        response = await axiosInstance.get(url, { params });
        break;
      case "post":
        response = await axiosInstance.post(url, data);
        break;
      case "put":
        response = await axiosInstance.put(url, data);
        break;
      case "delete":
        response = await axiosInstance.delete(url);
        break;
      default:
        throw new Error(`Unsupported method: ${method}`);
    }

    return response.data;
  } catch (error) {
    console.error(`Error ${method.toUpperCase()}ing data at ${url}:`, error);
    throw error;
  }
};

export default ApiService;

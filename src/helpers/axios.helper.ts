import axios, { AxiosRequestConfig, AxiosResponse, AxiosInstance } from 'axios';
import CookieManager from '../lib/cookies';
import { v4 as uuidv4 } from 'uuid';

const getAuthorizationToken = () => {
  const cookieManager: CookieManager = new CookieManager;
  const cookieName: string = 'authToken';
  const authToken = cookieManager.getCookie(cookieName);
  return authToken || '';
};

const generateCorrelationId = () => uuidv4();

/**
 * Validates that the base API URL is available in environment variables.
 * Throws an error if not defined.
 * @returns The base API URL as a string.
 */

const getApiBaseUrl = (): string => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) {
    console.error('API URL is not defined');
    throw new Error('API URL is not defined');
  }
  if (!apiUrl) {
    throw new Error("API base URL is not defined in environment variables");
  }
  return apiUrl;
}

export const axiosWrapper = async <T>(config: AxiosRequestConfig): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await axios({
      ...config,
      headers: {
        Authorization: `Bearer ${getAuthorizationToken() || ''}`,
        'correlation-id': generateCorrelationId(),
        ...config.headers,
      },
    });
    return response.data;
  } catch (error: unknown) {
    console.log(error, error)

    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data || error.message || 'Unknown error occurred';
      throw new Error(`Axios request failed: ${errorMessage}`);
    } else {
      throw new Error(`Unexpected error: ${(error as Error).message}`);
    }
  }
};


/**
 * ApiService class to manage Axios instance and API calls.
 */
class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: getApiBaseUrl(),
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  /**
   * Gets the Axios instance.
   * @returns The Axios instance configured for API calls.
   */

  public getApiInstance(): AxiosInstance {
    return this.api;
  }
}
const apiServiceInstance = new ApiService();

export default apiServiceInstance;

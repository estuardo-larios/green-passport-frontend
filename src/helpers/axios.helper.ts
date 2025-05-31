import axios, { AxiosRequestConfig, AxiosResponse, AxiosInstance } from 'axios';
import CookieManager from '../lib/cookies';
import { v4 as uuidv4 } from 'uuid';

/**
 * Obtiene el token de autorización desde la cookie.
 * @returns El token de autenticación como string, o cadena vacía si no existe.
 */
const getAuthorizationToken = (): string => {
  const cookieManager = new CookieManager();
  const cookieName = 'authToken';
  const authToken = cookieManager.getCookie(cookieName);
  return authToken || '';
};

/**
 * Genera un identificador único de correlación para el seguimiento de la petición.
 * @returns UUID versión 4 como string.
 */
const generateCorrelationId = (): string => uuidv4();

/**
 * Valida que la URL base de la API esté definida en las variables de entorno.
 * @throws Error si no está definida.
 * @returns La URL base de la API como string.
 */
const getApiBaseUrl = (): string => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) {
    console.error('API URL no está definida en las variables de entorno');
    throw new Error('API URL no está definida');
  }
  return apiUrl;
}

/**
 * Wrapper genérico para realizar peticiones Axios con configuración personalizada.
 * Incluye token de autorización y correlación.
 * @param config Configuración de la petición Axios.
 * @returns Los datos del tipo genérico T extraídos de la respuesta.
 * @throws Error con mensaje descriptivo en caso de fallo.
 */
export const axiosWrapper = async <T>(config: AxiosRequestConfig): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await axios({
      ...config,
      headers: {
        Authorization: `Bearer ${getAuthorizationToken()}`,
        'correlation-id': generateCorrelationId(),
        ...config.headers,
      },
    });
    return response.data;
  } catch (error: unknown) {
    console.error('Error en la petición Axios:', error);

    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data || error.message || 'Error desconocido';
      throw new Error(`Fallo en la petición Axios: ${errorMessage}`);
    } else {
      throw new Error(`Error inesperado: ${(error as Error).message}`);
    }
  }
};

/**
 * Clase para gestionar la instancia Axios con configuración predeterminada.
 */
class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: getApiBaseUrl(),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Obtiene la instancia de Axios configurada para llamadas a la API.
   * @returns Instancia Axios.
   */
  public getApiInstance(): AxiosInstance {
    return this.api;
  }
}

const apiServiceInstance = new ApiService();

export default apiServiceInstance;

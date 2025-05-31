import { axiosWrapper } from '@/helpers/axios.helper';
import { AxiosError } from 'axios';
import { IUser, IUserCredentials } from '@/interfaces/user.interface';
import { IloginResponse } from '@/interfaces/login.interface';
import CookieManager from '../lib/cookies';

/**
 * Constante que representa el tipo de acción para el inicio de sesión.
 */
export const LOGIN = 'LOGIN';

/**
 * Constante que representa el tipo de acción para el cierre de sesión.
 */
export const LOGOUT = 'LOGOUT';

/**
 * Instancia del gestor de cookies para manejo de tokens de autenticación.
 */
const cookieManager = new CookieManager();

/**
 * Nombre de la cookie donde se almacenará el token de autenticación.
 */
const cookieName: string = 'authToken';

/**
 * Acción asíncrona para iniciar sesión en la aplicación.
 * 
 * Este thunk recibe las credenciales del usuario, realiza una petición
 * HTTP POST al endpoint de autenticación, y en caso de éxito:
 * - Almacena el token JWT en una cookie con duración de 1 día.
 * - Despacha la acción LOGIN con los datos del usuario obtenidos.
 * 
 * En caso de error, captura y maneja la excepción, imprimiendo un
 * mensaje en consola y relanzando el error para su posible manejo externo.
 * 
 * @param {IUserCredentials} credentials - Objeto que contiene usuario y contraseña para autenticación.
 * @returns {Function} Función thunk que recibe dispatch para actualizar el estado global.
 * 
 * @throws {AxiosError} Error lanzado cuando la petición a la API falla o hay un problema de red.
 */
export const login = (credentials: IUserCredentials) => async (
  dispatch: (action: { type: string; payload?: IUser }) => void
) => {
  try {
    // Obtiene la URL base de la API desde las variables de entorno.
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) {
      console.error('API URL is not defined');
      throw new Error('API URL is not defined');
    }
    // Realiza la petición POST para autenticarse.
    const response = await axiosWrapper<IloginResponse>({
      method: 'POST',
      url: `https://api.thebytecenter.com/auth/login`,
      data: credentials,
    });

    // Extrae token y usuario desde la respuesta.
    const { token, user } = response;

    // Almacena el token en una cookie por 1 día.
    cookieManager.setCookie(cookieName, token, 1);

    // Despacha la acción de login con el usuario como payload.
    dispatch({ type: LOGIN, payload: user });
  } catch (error: unknown) {
    const axiosError = error as AxiosError;
    if (error instanceof Error) {
      console.error('Login failed:', axiosError);
    } else {
      console.error('Login failed with an unexpected error:', axiosError);
    }
    // Relanza el error para que pueda ser manejado en otra parte de la aplicación.
    throw axiosError;
  }
};

/**
 * Acción síncrona para cerrar sesión en la aplicación.
 * 
 * Despacha una acción LOGOUT para limpiar el estado del usuario autenticado.
 * No realiza llamadas a API ni manipula cookies, por lo que se recomienda
 * complementar con limpieza local si fuera necesario.
 * 
 * @returns {Function} Función que recibe dispatch para actualizar el estado global.
 */
export const logout = () => (dispatch: (action: { type: string }) => void) => {
  dispatch({ type: LOGOUT });
};

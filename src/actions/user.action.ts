import { axiosWrapper } from "@/helpers/axios.helper";
import { IUser } from "@/interfaces/user.interface";
import { AxiosError } from 'axios';
import { AppDispatch } from "../redux/store";

import {
  FETCH_USERS_REQUEST,
  FETCH_USERS_SUCCESS,
  FETCH_USERS_FAILURE,
} from "@/interfaces/user.interface";

/**
 * Constante que representa el tipo de acción cuando el registro de usuario es exitoso.
 */
export const REGISTER_SUCCESS = "REGISTER_SUCCESS";

/**
 * Constante que representa el tipo de acción cuando se obtiene un usuario correctamente.
 */
export const FETCH_USER_SUCCESS = "FETCH_USER_SUCCESS";

/**
 * Constante que representa el tipo de acción cuando ocurre un error relacionado con usuarios.
 */
export const USER_FAILURE = "USER_FAILURE";

/**
 * Constante que representa el tipo de acción cuando se obtiene un usuario por correo electrónico con éxito.
 */
export const FETCH_USER_BY_EMAIL_SUCCESS = 'FETCH_USER_BY_EMAIL_SUCCESS';

/**
 * Acción que indica que se inició la solicitud para obtener la lista de usuarios.
 * 
 * @returns {object} Acción con tipo FETCH_USERS_REQUEST para ser despachada.
 */
export const fetchUsersRequest = () => ({
  type: FETCH_USERS_REQUEST,
});

/**
 * Acción que indica que se obtuvo la lista de usuarios correctamente.
 * 
 * @param {IUser[]} users - Arreglo de objetos usuario obtenidos.
 * @returns {object} Acción con tipo FETCH_USERS_SUCCESS y payload con usuarios.
 */
export const fetchUsersSuccess = (users: IUser[]) => ({
  type: FETCH_USERS_SUCCESS,
  payload: users,
});

/**
 * Acción que indica que hubo un error al obtener la lista de usuarios.
 * 
 * @param {string} error - Mensaje de error.
 * @returns {object} Acción con tipo FETCH_USERS_FAILURE y payload con mensaje de error.
 */
export const fetchUsersFailure = (error: string) => ({
  type: FETCH_USERS_FAILURE,
  payload: error,
});

/**
 * Acción que indica que se obtuvo un usuario por correo electrónico exitosamente.
 * 
 * @param {IUser} user - Objeto usuario obtenido.
 * @returns {object} Acción con tipo FETCH_USER_BY_EMAIL_SUCCESS y payload con usuario.
 */
const fetchUserByEmailSuccess = (user: IUser) => ({
    type: FETCH_USER_BY_EMAIL_SUCCESS,
    payload: user,
});

/**
 * Acción que indica que el registro de usuario fue exitoso.
 * 
 * @param {IUser} user - Objeto usuario registrado.
 * @returns {object} Acción con tipo REGISTER_SUCCESS y payload con usuario.
 */
export const registerSuccess = (user: IUser) => ({
  type: REGISTER_SUCCESS,
  payload: user,
});

/**
 * Acción que indica que se obtuvo un usuario correctamente.
 * 
 * @param {IUser} user - Objeto usuario obtenido.
 * @returns {object} Acción con tipo FETCH_USER_SUCCESS y payload con usuario.
 */
export const fetchUserSuccess = (user: IUser) => ({
  type: FETCH_USER_SUCCESS,
  payload: user,
});

/**
 * Acción que indica que hubo un error relacionado con usuarios.
 * 
 * @param {string} error - Mensaje de error.
 * @returns {object} Acción con tipo USER_FAILURE y payload con mensaje de error.
 */
export const userFailure = (error: string) => ({
  type: USER_FAILURE,
  payload: error,
});

/**
 * URL base de la API obtenida desde las variables de entorno.
 * 
 * Se valida que esté definida al momento de cargar el módulo.
 * En caso contrario, se lanza un error y se muestra en consola.
 */
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
if (!apiUrl) {
  console.error('API URL is not defined');
  throw new Error('API URL is not defined');
}

/**
 * Thunk para registrar un nuevo usuario.
 * 
 * Realiza una petición POST al endpoint `/user` enviando
 * username, email, password y role. En caso de éxito,
 * despacha la acción registerSuccess con el usuario registrado.
 * En caso de error, despacha userFailure con el mensaje y relanza el error.
 * 
 * @param {string} username - Nombre de usuario a registrar.
 * @param {string} email - Correo electrónico del usuario.
 * @param {string} password - Contraseña para el usuario.
 * @param {string} role - Rol asignado al usuario.
 * @returns {Function} Función thunk que recibe dispatch para actualizar el estado global.
 * 
 * @throws {AxiosError} Error lanzado cuando la petición falla.
 */
export const registerUser = (
  username: string,
  email: string,
  password: string,
  role: string
) => async (dispatch: AppDispatch) => {
  try {
    const response = await axiosWrapper<IUser>({
      method: 'POST',
      url: `https://api.thebytecenter.com/user`,
      data: { username, email, password, role },
    });
    dispatch(registerSuccess(response));
  } catch (error) {
    console.error('Error registering user:', error);
    const axiosError = error as AxiosError;
    dispatch(userFailure(axiosError.message));
    throw axiosError;
  }
};

/**
 * Thunk para obtener un usuario por su ID.
 * 
 * Realiza una petición GET al endpoint `/user/{userId}`.
 * En caso de éxito despacha fetchUserSuccess con el usuario obtenido.
 * En caso de error despacha userFailure y muestra el error en consola.
 * 
 * @param {number} userId - Identificador numérico del usuario a obtener.
 * @returns {Function} Función thunk que recibe dispatch para actualizar el estado global.
 */
export const fetchUser = (userId: number) => async (dispatch: AppDispatch) => {
  try {
    const response = await axiosWrapper<IUser>({
      method: 'GET',
      url: `https://api.thebytecenter.com/user/${userId}`,
    });
    dispatch(fetchUserSuccess(response));
  } catch (error) {
    const axiosError = error as AxiosError;
    dispatch(userFailure(axiosError.message));
    console.error('Error fetching user:', axiosError.message);
  }
};

/**
 * Thunk para obtener un usuario por su correo electrónico.
 * 
 * Realiza una petición GET al endpoint `/user/email/{email}`.
 * En caso de éxito despacha fetchUserByEmailSuccess y retorna el usuario.
 * En caso de error despacha userFailure, muestra el error en consola y retorna null.
 * 
 * @param {string} email - Correo electrónico del usuario a buscar.
 * @returns {Function} Función thunk que recibe dispatch para actualizar el estado global.
 * @returns {Promise<IUser | null>} Usuario obtenido o null si falla la petición.
 */
export const fetchUserByEmail = (email: string) => async (dispatch: AppDispatch) => {
  try {
      const response = await axiosWrapper<IUser>({
          method: 'GET',
          url:  `https://api.thebytecenter.com/user/email/${email}`,
      });
      dispatch(fetchUserByEmailSuccess(response));
      return response;
  } catch (error) {
      const axiosError = error as AxiosError;
      dispatch(userFailure(axiosError.message));
      console.error('Error fetching user by email:', axiosError.message);
      return null;
  }
};

/**
 * Thunk para obtener la lista completa de usuarios.
 * 
 * Despacha fetchUsersRequest para indicar que inicia la solicitud,
 * luego realiza la petición GET a `/user`. Si es exitosa,
 * despacha fetchUsersSuccess con el arreglo de usuarios y retorna la respuesta.
 * En caso de error despacha fetchUsersFailure, muestra el error y relanza el error.
 * 
 * @returns {Function} Función thunk que recibe dispatch para actualizar el estado global.
 * @returns {Promise<IUser[]>} Arreglo de usuarios obtenidos.
 * 
 * @throws {AxiosError} Error lanzado cuando la petición falla.
 */
export const fetchUsers = () => async (dispatch: AppDispatch) => {
  dispatch(fetchUsersRequest());
  try {
    const response = await axiosWrapper<IUser[]>({
      method: "GET",
      url: `https://api.thebytecenter.com/user`,
    });
    dispatch(fetchUsersSuccess(response));
    return response;
  } catch (error) {
    const axiosError = error as AxiosError;
    dispatch(fetchUsersFailure(axiosError.message));
    console.error("Error fetching users:", axiosError.message);
    throw axiosError;
  }
};

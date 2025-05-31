import { IUser } from "./user.interface";

/**
 * Interfaz para la respuesta del servicio de inicio de sesión.
 * @property user - Objeto del usuario autenticado.
 * @property token - Token JWT recibido tras autenticarse.
 */
export interface IloginResponse {
  user: IUser;
  token: string;
}

/**
 * Interfaz para la solicitud de inicio de sesión.
 * @property email - Correo electrónico del usuario.
 * @property password - Contraseña del usuario.
 */
export interface IloginRequest {
  email: string;
  password: string;
}

/**
 * Interfaz que representa el estado de autenticación en el store.
 * @property user - Usuario autenticado o null si no hay sesión activa.
 * @property isLoggedIn - Indica si hay una sesión activa.
 * @property error - Mensaje de error en caso de fallo en la autenticación.
 */
export interface LoginState {
  user: IUser | null;
  isLoggedIn: boolean;
  error: string | null;
}

import { IUser } from "./user.interface";

// *AUTENTICACIÓN

/**
 * Acción que representa el inicio de sesión.
 */
export const LOGIN = "LOGIN";

/**
 * Acción que representa el cierre de sesión.
 */
export const LOGOUT = "LOGOUT";

/**
 * Interfaz para la acción de inicio de sesión.
 * @property type - Tipo de acción (LOGIN).
 * @property payload - Objeto del usuario autenticado.
 */
export interface LoginAction {
  type: typeof LOGIN;
  payload: IUser;
}

/**
 * Interfaz para la acción de cierre de sesión.
 * @property type - Tipo de acción (LOGOUT).
 */
export interface LogoutAction {
  type: typeof LOGOUT;
}

/**
 * Tipo unificado para las acciones relacionadas con autenticación.
 */
export type AuthActionTypes = LoginAction | LogoutAction;

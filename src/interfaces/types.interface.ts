// src/interfaces/user.interface.ts
import { IUser } from './user.interface';

// *ACCIONES RELACIONADAS CON EL USUARIO

/** Acción para registrar un usuario exitosamente. */
export const REGISTER_SUCCESS = 'REGISTER_SUCCESS';

/** Acción para obtener datos del usuario exitosamente. */
export const FETCH_USER_SUCCESS = 'FETCH_USER_SUCCESS';

/** Acción para obtener datos del usuario por correo electrónico exitosamente. */
export const FETCH_USER_BY_EMAIL_SUCCESS = 'FETCH_USER_BY_EMAIL_SUCCESS';

/** Acción que representa un error en alguna operación relacionada con el usuario. */
export const USER_FAILURE = 'USER_FAILURE';

// *ACCIONES RELACIONADAS CON LOS ELEMENTOS DEL USUARIO

/** Acción para iniciar la solicitud de elementos del usuario. */
export const FETCH_USER_ITEMS_REQUEST = "FETCH_USER_ITEMS_REQUEST";

/** Acción para obtener exitosamente los elementos del usuario. */
export const FETCH_USER_ITEMS_SUCCESS = "FETCH_USER_ITEMS_SUCCESS";

/** Acción para indicar error al obtener los elementos del usuario. */
export const FETCH_USER_ITEMS_FAILURE = "FETCH_USER_ITEMS_FAILURE";

/** Acción para iniciar la solicitud de actualización de un elemento del usuario. */
export const UPDATE_USER_ITEM_REQUEST = "UPDATE_USER_ITEM_REQUEST";

/** Acción para indicar actualización exitosa de un elemento del usuario. */
export const UPDATE_USER_ITEM_SUCCESS = "UPDATE_USER_ITEM_SUCCESS";

/** Acción para indicar error al actualizar un elemento del usuario. */
export const UPDATE_USER_ITEM_FAILURE = "UPDATE_USER_ITEM_FAILURE";

// *INTERFACES PARA ACCIONES RELACIONADAS CON USUARIO

/**
 * Acción para registrar un usuario exitosamente.
 * @property type - Tipo de la acción.
 * @property payload - Usuario registrado.
 */
export interface RegisterSuccessAction {
  type: typeof REGISTER_SUCCESS;
  payload: IUser;
}

/**
 * Acción para obtener datos del usuario exitosamente.
 * @property type - Tipo de la acción.
 * @property payload - Usuario obtenido.
 */
export interface FetchUserSuccessAction {
  type: typeof FETCH_USER_SUCCESS;
  payload: IUser;
}

/**
 * Acción para obtener usuario por correo electrónico exitosamente.
 * @property type - Tipo de la acción.
 * @property payload - Usuario correspondiente al correo.
 */
export interface FetchUserByEmailSuccessAction {
  type: typeof FETCH_USER_BY_EMAIL_SUCCESS;
  payload: IUser;
}

/**
 * Acción para representar un error relacionado con el usuario.
 * @property type - Tipo de la acción.
 * @property payload - Mensaje de error.
 */
export interface UserFailureAction {
  type: typeof USER_FAILURE;
  payload: string;
}

/**
 * Tipo unificado para las acciones posibles relacionadas con el usuario.
 */
export type UserActions =
  | RegisterSuccessAction
  | FetchUserSuccessAction
  | FetchUserByEmailSuccessAction
  | UserFailureAction;

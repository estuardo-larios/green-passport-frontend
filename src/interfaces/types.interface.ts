// src/interfaces/user.interface.ts
import { IUser } from './user.interface';


export const REGISTER_SUCCESS = 'REGISTER_SUCCESS';
export const FETCH_USER_SUCCESS = 'FETCH_USER_SUCCESS';
export const FETCH_USER_BY_EMAIL_SUCCESS = 'FETCH_USER_BY_EMAIL_SUCCESS';
export const USER_FAILURE = 'USER_FAILURE';

export const FETCH_USER_ITEMS_REQUEST = "FETCH_USER_ITEMS_REQUEST";
export const FETCH_USER_ITEMS_SUCCESS = "FETCH_USER_ITEMS_SUCCESS";
export const FETCH_USER_ITEMS_FAILURE = "FETCH_USER_ITEMS_FAILURE";

export const UPDATE_USER_ITEM_REQUEST = "UPDATE_USER_ITEM_REQUEST";
export const UPDATE_USER_ITEM_SUCCESS = "UPDATE_USER_ITEM_SUCCESS";
export const UPDATE_USER_ITEM_FAILURE = "UPDATE_USER_ITEM_FAILURE";


// Definir las interfaces para cada acción
export interface RegisterSuccessAction {
  type: typeof REGISTER_SUCCESS;
  payload: IUser;
}

export interface FetchUserSuccessAction {
  type: typeof FETCH_USER_SUCCESS;
  payload: IUser;
}

export interface FetchUserByEmailSuccessAction {
  type: typeof FETCH_USER_BY_EMAIL_SUCCESS;
  payload: IUser;
}

export interface UserFailureAction {
  type: typeof USER_FAILURE;
  payload: string; // En caso de error, pasaremos un mensaje de error
}

// Definir un tipo de acción que pueda ser cualquiera de los anteriores
export type UserActions =
  | RegisterSuccessAction
  | FetchUserSuccessAction
  | FetchUserByEmailSuccessAction
  | UserFailureAction;

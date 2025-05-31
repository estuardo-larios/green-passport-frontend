import { IUser } from "./user.interface";

// *AUTHENTICATION

export const LOGIN = "LOGIN";
export const LOGOUT = "LOGOUT";

export interface LoginAction {
  type: typeof LOGIN;
  payload: IUser;
}

export interface LogoutAction {
  type: typeof LOGOUT;
}

export type AuthActionTypes = LoginAction | LogoutAction;




import { IUser } from "./user.interface";

export interface IloginResponse {
  user: IUser;
  token: string;
}

export interface IloginRequest {
  email: string;
  password: string;
}

export interface LoginState {
  user: IUser | null; // El usuario autenticado o null si no hay ninguno
  isLoggedIn: boolean; // Estado de autenticación
  error: string | null; // Mensaje de error si ocurre un problema
}
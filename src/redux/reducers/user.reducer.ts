// src/reducers/user.reducer.ts
import {
  REGISTER_SUCCESS,
  FETCH_USER_SUCCESS,
  FETCH_USER_BY_EMAIL_SUCCESS,
  USER_FAILURE,
} from '@/interfaces/types.interface';
import { FETCH_USERS_SUCCESS } from '@/interfaces/user.interface';

/**
 * Representa un usuario.
 */
export interface User {
  id: string;
  name: string;
  email: string;
  // Agregar otros campos necesarios
}

/**
 * Estado del módulo usuario.
 */
export interface UserState {
  user: User | null;
  users?: User[];
  error: string | null;
  loading?: boolean;
}

/**
 * Acción exitosa de registro.
 */
interface RegisterSuccessAction {
  type: typeof REGISTER_SUCCESS;
  payload: User;
}

/**
 * Acción exitosa de obtención de usuario.
 */
interface FetchUserSuccessAction {
  type: typeof FETCH_USER_SUCCESS;
  payload: User;
}

/**
 * Acción exitosa de obtención de usuario por email.
 */
interface FetchUserByEmailSuccessAction {
  type: typeof FETCH_USER_BY_EMAIL_SUCCESS;
  payload: User;
}

/**
 * Acción exitosa de obtención de múltiples usuarios.
 */
interface FetchUsersSuccessAction {
  type: typeof FETCH_USERS_SUCCESS;
  payload: User[];
}

/**
 * Acción que representa error relacionado a usuario.
 */
interface UserFailureAction {
  type: typeof USER_FAILURE;
  payload: string;
}

/**
 * Tipos de acción para el reducer usuario.
 */
export type UserActionTypes =
  | RegisterSuccessAction
  | FetchUserSuccessAction
  | FetchUserByEmailSuccessAction
  | FetchUsersSuccessAction
  | UserFailureAction;

/**
 * Estado inicial del reducer usuario.
 */
const initialState: UserState = {
  user: null,
  error: null,
};

/**
 * Reducer que maneja el estado del usuario.
 * @param state Estado actual.
 * @param action Acción disparada.
 * @returns Nuevo estado.
 */
const userReducer = (
  state = initialState,
  action: UserActionTypes
): UserState => {
  switch (action.type) {
    case REGISTER_SUCCESS:
    case FETCH_USER_SUCCESS:
    case FETCH_USER_BY_EMAIL_SUCCESS:
      return {
        ...state,
        user: action.payload,
        error: null,
      };
    case FETCH_USERS_SUCCESS:
      return {
        ...state,
        users: action.payload,
        loading: false,
        error: null,
      };
    case USER_FAILURE:
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default userReducer;

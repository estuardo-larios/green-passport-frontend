import { IUser } from "@/interfaces/user.interface";
import { AuthActionTypes, LOGIN, LOGOUT } from "@/interfaces/action.interfaces";

/**
 * Estado para la autenticación del usuario.
 */
export interface LoginState {
  user: IUser | null; // Usuario autenticado o null si no hay sesión
}

/**
 * Estado inicial para el reducer de login.
 */
const initialState: LoginState = {
  user: null,
};

/**
 * Reducer para manejar el estado de autenticación.
 * @param state Estado actual.
 * @param action Acción disparada.
 * @returns Nuevo estado.
 */
const loginReducer = (state = initialState, action: AuthActionTypes): LoginState => {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        user: action.payload,
      };
    case LOGOUT:
      return {
        ...state,
        user: null,
      };
    default:
      return state;
  }
};

export default loginReducer;

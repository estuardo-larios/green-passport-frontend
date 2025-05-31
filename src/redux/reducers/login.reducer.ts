import { IUser } from "@/interfaces/user.interface";
import { AuthActionTypes, LOGIN, LOGOUT } from "@/interfaces/action.interfaces";

export interface LoginState {
  user: IUser | null;
}

const initialState: LoginState = {
  user: null,
};

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

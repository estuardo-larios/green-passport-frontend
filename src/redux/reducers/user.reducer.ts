// src/reducers/user.reducer.ts
import {
  REGISTER_SUCCESS,
  FETCH_USER_SUCCESS,
  FETCH_USER_BY_EMAIL_SUCCESS,
  USER_FAILURE,
} from '@/interfaces/types.interface';
import { FETCH_USERS_SUCCESS } from '@/interfaces/user.interface';

// src/types/userTypes.ts (o agrégalo directamente al reducer)

export interface User {
  id: string;
  name: string;
  email: string;
  // agrega otros campos necesarios
}

export interface UserState {
  user: User | null;
  users?: User[];
  error: string | null;
  loading?: boolean;
}

interface RegisterSuccessAction {
  type: typeof REGISTER_SUCCESS;
  payload: User;
}

interface FetchUserSuccessAction {
  type: typeof FETCH_USER_SUCCESS;
  payload: User;
}

interface FetchUserByEmailSuccessAction {
  type: typeof FETCH_USER_BY_EMAIL_SUCCESS;
  payload: User;
}

interface FetchUsersSuccessAction {
  type: typeof FETCH_USERS_SUCCESS;
  payload: User[];
}

interface UserFailureAction {
  type: typeof USER_FAILURE;
  payload: string;
}

export type UserActionTypes =
  | RegisterSuccessAction
  | FetchUserSuccessAction
  | FetchUserByEmailSuccessAction
  | FetchUsersSuccessAction
  | UserFailureAction;


const initialState: UserState = {
  user: null,
  error: null,
};

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

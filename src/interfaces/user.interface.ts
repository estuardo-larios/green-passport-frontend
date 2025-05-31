

export interface IUser {
  id: number;
  username: string;
  email: string;
  password: string;
  role: string;
  createdAt: string;
}


interface IActionButtonProps {
  label: string;
  onClick: () => void;
}

export interface IToolbarProps<T> {
  data: T[];
  onFilter: (filteredData: T[]) => void;
  actionButton: IActionButtonProps;
}

export interface IToolbarRolesProps {
  data: IRoles[];
  onFilter: (filteredData: IRoles[]) => void;
  actionButton: IActionButtonProps;
}

export interface IUserCredentials {
  email: string;
  password: string;
}

export interface IRoles {
  id: number;
  name: string;
  description: string;
}

interface RegisterSuccessAction {
  type: 'REGISTER_SUCCESS';
  payload: IUser;
}

interface FetchUserSuccessAction {
  type: 'FETCH_USER_SUCCESS';
  payload: IUser;
}

interface FetchUserByEmailSuccessAction {
  type: 'FETCH_USER_BY_EMAIL_SUCCESS';
  payload: IUser;
}

interface UserFailureAction {
  type: 'USER_FAILURE';
  payload: string;
}


export type UserActions =
  | RegisterSuccessAction
  | FetchUserSuccessAction
  | FetchUserByEmailSuccessAction
  | UserFailureAction;

// *User actions
export const FETCH_USERS_REQUEST = 'FETCH_USERS_REQUEST';
export const FETCH_USERS_SUCCESS = 'FETCH_USERS_SUCCESS';
export const FETCH_USERS_FAILURE = 'FETCH_USERS_FAILURE';
export const ADD_USER_SUCCESS = 'ADD_USER_SUCCESS';
export const ADD_USER_FAILURE = 'ADD_USER_FAILURE';
export const UPDATE_USER_SUCCESS = 'UPDATE_USER_SUCCESS';
export const UPDATE_USER_FAILURE = 'UPDATE_USER_FAILURE';
export const DELETE_USER_SUCCESS = 'DELETE_USER_SUCCESS';
export const FETCH_USER_BY_EMAIL_SUCCESS = 'FETCH_USER_BY_EMAIL_SUCCESS';
export const FETCH_USER_SUCCESS = "FETCH_USER_SUCCESS";
export const REGISTER_SUCCESS = "REGISTER_SUCCESS";
export const DELETE_USER_FAILURE = 'DELETE_USER_FAILURE';
export const USER_FAILURE = "USER_FAILURE";
import { axiosWrapper } from "@/helpers/axios.helper";
import { IUser } from "@/interfaces/user.interface";
import { AxiosError } from 'axios';
import { AppDispatch } from "../redux/store";

import {
  FETCH_USERS_REQUEST,
  FETCH_USERS_SUCCESS,
  FETCH_USERS_FAILURE,
} from "@/interfaces/user.interface";

export const REGISTER_SUCCESS = "REGISTER_SUCCESS";
export const FETCH_USER_SUCCESS = "FETCH_USER_SUCCESS";
export const USER_FAILURE = "USER_FAILURE";
export const FETCH_USER_BY_EMAIL_SUCCESS = 'FETCH_USER_BY_EMAIL_SUCCESS';


export const fetchUsersRequest = () => ({
  type: FETCH_USERS_REQUEST,
});

export const fetchUsersSuccess = (users: IUser[]) => ({
  type: FETCH_USERS_SUCCESS,
  payload: users,
});

export const fetchUsersFailure = (error: string) => ({
  type: FETCH_USERS_FAILURE,
  payload: error,
});

// Acciones
const fetchUserByEmailSuccess = (user: IUser) => ({
    type: FETCH_USER_BY_EMAIL_SUCCESS,
    payload: user,
});

export const registerSuccess = (user: IUser) => ({
  type: REGISTER_SUCCESS,
  payload: user,
});

export const fetchUserSuccess = (user: IUser) => ({
  type: FETCH_USER_SUCCESS,
  payload: user,
});

export const userFailure = (error: string) => ({
  type: USER_FAILURE,
  payload: error,
});

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
if (!apiUrl) {
  console.error('API URL is not defined');
  throw new Error('API URL is not defined');
}

export const registerUser = (
  username: string,
  email: string,
  password: string,
  role: string
) => async (dispatch: AppDispatch) => {
  try {
    const response = await axiosWrapper<IUser>({
      method: 'POST',
      url: `https://api.thebytecenter.com/user`,
      data: { username, email, password, role },
    });
    dispatch(registerSuccess(response));
  } catch (error) {
    console.error('Error registering user:', error);
    const axiosError = error as AxiosError;
    dispatch(userFailure(axiosError.message));
    
    // Lanza el error para que se capture en el componente
    throw axiosError;
  }
};


// Fetch user action
export const fetchUser = (userId: number) => async (dispatch: AppDispatch) => {
  try {
    const response = await axiosWrapper<IUser>({
      method: 'GET',
      url: `https://api.thebytecenter.com/user/${userId}`,
    });
    dispatch(fetchUserSuccess(response));
  } catch (error) {
    const axiosError = error as AxiosError;
    dispatch(userFailure(axiosError.message));
    console.error('Error fetching user:', axiosError.message);
  }
};

export const fetchUserByEmail = (email: string) => async (dispatch: AppDispatch) => {
  try {
      const response = await axiosWrapper<IUser>({
          method: 'GET',
          url:  `https://api.thebytecenter.com/user/email/${email}`,
      });
      dispatch(fetchUserByEmailSuccess(response));
      return response;
  } catch (error) {
      const axiosError = error as AxiosError;
      dispatch(userFailure(axiosError.message));
      console.error('Error fetching user by email:', axiosError.message);
      return null;
  }
};

export const fetchUsers = () => async (dispatch: AppDispatch) => {
  dispatch(fetchUsersRequest());
  try {
    const response = await axiosWrapper<IUser[]>({
      method: "GET",
      url: `https://api.thebytecenter.com/user`,
    });
    dispatch(fetchUsersSuccess(response));
    return response;
  } catch (error) {
    const axiosError = error as AxiosError;
    dispatch(fetchUsersFailure(axiosError.message));
    console.error("Error fetching users:", axiosError.message);
    throw axiosError;
  }
};


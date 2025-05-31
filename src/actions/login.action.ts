import { axiosWrapper } from '@/helpers/axios.helper';
import { AxiosError } from 'axios';
import { IUser, IUserCredentials } from '@/interfaces/user.interface';
import { IloginResponse } from '@/interfaces/login.interface';
import CookieManager from '../lib/cookies';

export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';
const cookieManager = new CookieManager;
const cookieName: string = 'authToken';


export const login = (credentials: IUserCredentials) => async (dispatch: (action: { type: string; payload?: IUser }) => void) => {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) {
      console.error('API URL is not defined');
      throw new Error('API URL is not defined');
    }
    const response = await axiosWrapper<IloginResponse>({
      method: 'POST',
      url: `https://api.thebytecenter.com/auth/login`,
      data: credentials,
    });
    const { token, user } = response;
    cookieManager.setCookie(cookieName, token, 1);
    dispatch({ type: LOGIN, payload: user });
  } catch (error: unknown) {
    const axiosError = error as AxiosError;
    if (error instanceof Error) {
      console.error('Login failed:', axiosError);
    } else {
      console.error('Login failed with an unexpected error:', axiosError);
    }
    throw axiosError;
  }
};

export const logout = () => (dispatch: (action: { type: string }) => void) => {
  dispatch({ type: LOGOUT });
};

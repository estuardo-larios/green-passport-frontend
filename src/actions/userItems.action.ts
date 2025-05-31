import { axiosWrapper } from "@/helpers/axios.helper";
import { AxiosError } from "axios";
import { AppDispatch } from "../redux/store";
import { FETCH_USER_ITEMS_REQUEST, FETCH_USER_ITEMS_SUCCESS, FETCH_USER_ITEMS_FAILURE, UPDATE_USER_ITEM_REQUEST, UPDATE_USER_ITEM_SUCCESS, UPDATE_USER_ITEM_FAILURE } from "@/interfaces/types.interface";
import { UserItem } from "@/interfaces/userItems.interface";


const apiUrl = process.env.NEXT_PUBLIC_API_URL;
if (!apiUrl) {
  console.error('API URL is not defined');
  throw new Error('API URL is not defined');
}

// Action creators para fetch user items
const fetchUserItemsRequest = () => ({
  type: FETCH_USER_ITEMS_REQUEST,
});

const fetchUserItemsSuccess = (items: UserItem[]) => ({
  type: FETCH_USER_ITEMS_SUCCESS,
  payload: items,
});

const fetchUserItemsFailure = (error: string) => ({
  type: FETCH_USER_ITEMS_FAILURE,
  payload: error,
});

// Thunk para obtener items por email
export const fetchUserItemsByEmail = (email: string) => async (dispatch: AppDispatch) => {
  dispatch(fetchUserItemsRequest());
  try {
    const response = await axiosWrapper<UserItem[]>({
      method: "GET",
      url: `https://api.thebytecenter.com/user-items/progress-by-email/${encodeURIComponent(email)}`,
    });
    dispatch(fetchUserItemsSuccess(response));
    return response;
  } catch (error) {
    const axiosError = error as AxiosError;
    dispatch(fetchUserItemsFailure(axiosError.message));
    console.error("Error fetching user items by email:", axiosError.message);
    return null;
  }
};

// Action creators para update user item
const updateUserItemRequest = () => ({
  type: UPDATE_USER_ITEM_REQUEST,
});

const updateUserItemSuccess = (updatedItem: UserItem) => ({
  type: UPDATE_USER_ITEM_SUCCESS,
  payload: updatedItem,
});

const updateUserItemFailure = (error: string) => ({
  type: UPDATE_USER_ITEM_FAILURE,
  payload: error,
});

// Thunk para actualizar flag completed de un item de usuario
export const updateUserItemCompleted = (
  userId: number,
  itemId: number,
  score?: number
) => async (dispatch: AppDispatch) => {
  dispatch(updateUserItemRequest());
  try {
    console.log("Updating user item:", { userId, itemId, score });
    const response = await axiosWrapper<UserItem>({
      method: "POST",
      url: `https://api.thebytecenter.com/user-items/complete`,
      data: { userId, itemId, score },
    });
    dispatch(updateUserItemSuccess(response));
    return response;
  } catch (error) {
    const axiosError = error as AxiosError;
    dispatch(updateUserItemFailure(axiosError.message));
    console.error("Error updating user item:", axiosError.message);
    return null;
  }
};

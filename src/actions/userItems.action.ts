import { axiosWrapper } from "@/helpers/axios.helper";
import { AxiosError } from "axios";
import { AppDispatch } from "../redux/store";
import {
  FETCH_USER_ITEMS_REQUEST,
  FETCH_USER_ITEMS_SUCCESS,
  FETCH_USER_ITEMS_FAILURE,
  UPDATE_USER_ITEM_REQUEST,
  UPDATE_USER_ITEM_SUCCESS,
  UPDATE_USER_ITEM_FAILURE,
} from "@/interfaces/types.interface";
import { UserItem } from "@/interfaces/userItems.interface";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
if (!apiUrl) {
  console.error('API URL is not defined');
  throw new Error('API URL is not defined');
}

/**
 * Crea una acción para indicar el inicio de la petición de obtención de items del usuario.
 * @returns {object} Acción para el inicio de la petición.
 */
const fetchUserItemsRequest = () => ({
  type: FETCH_USER_ITEMS_REQUEST,
});

/**
 * Crea una acción para indicar la obtención exitosa de los items del usuario.
 * @param {UserItem[]} items - Arreglo de items del usuario obtenidos.
 * @returns {object} Acción con los items como payload.
 */
const fetchUserItemsSuccess = (items: UserItem[]) => ({
  type: FETCH_USER_ITEMS_SUCCESS,
  payload: items,
});

/**
 * Crea una acción para indicar un fallo en la obtención de items del usuario.
 * @param {string} error - Mensaje de error recibido.
 * @returns {object} Acción con el mensaje de error.
 */
const fetchUserItemsFailure = (error: string) => ({
  type: FETCH_USER_ITEMS_FAILURE,
  payload: error,
});

/**
 * Thunk para obtener los items de un usuario por su correo electrónico.
 * @param {string} email - Correo electrónico del usuario.
 * @returns {Promise<UserItem[] | null>} Arreglo de items o null en caso de error.
 */
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

/**
 * Crea una acción para indicar el inicio de la petición de actualización de un item del usuario.
 * @returns {object} Acción para el inicio de la actualización.
 */
const updateUserItemRequest = () => ({
  type: UPDATE_USER_ITEM_REQUEST,
});

/**
 * Crea una acción para indicar la actualización exitosa de un item del usuario.
 * @param {UserItem} updatedItem - Item actualizado del usuario.
 * @returns {object} Acción con el item actualizado como payload.
 */
const updateUserItemSuccess = (updatedItem: UserItem) => ({
  type: UPDATE_USER_ITEM_SUCCESS,
  payload: updatedItem,
});

/**
 * Crea una acción para indicar un fallo en la actualización de un item del usuario.
 * @param {string} error - Mensaje de error recibido.
 * @returns {object} Acción con el mensaje de error.
 */
const updateUserItemFailure = (error: string) => ({
  type: UPDATE_USER_ITEM_FAILURE,
  payload: error,
});

/**
 * Thunk para actualizar el estado "completed" de un item de usuario.
 * @param {number} userId - ID del usuario.
 * @param {number} itemId - ID del item a actualizar.
 * @param {number} [score] - Puntaje opcional asignado al item.
 * @returns {Promise<UserItem | null>} Item actualizado o null en caso de error.
 */
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

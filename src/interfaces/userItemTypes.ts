import {
  UserItem,
  FETCH_USER_ITEMS_REQUEST,
  FETCH_USER_ITEMS_SUCCESS,
  FETCH_USER_ITEMS_FAILURE,
  UPDATE_USER_ITEM_REQUEST,
  UPDATE_USER_ITEM_SUCCESS,
  UPDATE_USER_ITEM_FAILURE,
} from "./userItems.interface";

/**
 * Estado para el manejo de ítems de usuario.
 */
export interface UserItemState {
  /** Lista de ítems asociados al usuario */
  items: UserItem[];

  /** Indica si se está cargando la lista de ítems */
  loading: boolean;

  /** Mensaje de error en la carga de ítems o null si no hay error */
  error: string | null;

  /** Indica si se está actualizando un ítem */
  updating: boolean;

  /** Mensaje de error en la actualización o null si no hay error */
  updateError: string | null;
}

/** Acción para iniciar la solicitud de carga de ítems de usuario */
interface FetchUserItemsRequestAction {
  type: typeof FETCH_USER_ITEMS_REQUEST;
}

/** Acción que indica la carga exitosa de ítems con el payload correspondiente */
interface FetchUserItemsSuccessAction {
  type: typeof FETCH_USER_ITEMS_SUCCESS;
  payload: UserItem[];
}

/** Acción que indica un fallo en la carga de ítems con un mensaje de error */
interface FetchUserItemsFailureAction {
  type: typeof FETCH_USER_ITEMS_FAILURE;
  payload: string;
}

/** Acción para iniciar la solicitud de actualización de un ítem de usuario */
interface UpdateUserItemRequestAction {
  type: typeof UPDATE_USER_ITEM_REQUEST;
}

/** Acción que indica la actualización exitosa de un ítem con el ítem actualizado */
interface UpdateUserItemSuccessAction {
  type: typeof UPDATE_USER_ITEM_SUCCESS;
  payload: UserItem;
}

/** Acción que indica un fallo en la actualización de un ítem con mensaje de error */
interface UpdateUserItemFailureAction {
  type: typeof UPDATE_USER_ITEM_FAILURE;
  payload: string;
}

/**
 * Tipo que agrupa todas las acciones relacionadas con los ítems de usuario.
 */
export type UserItemActionTypes =
  | FetchUserItemsRequestAction
  | FetchUserItemsSuccessAction
  | FetchUserItemsFailureAction
  | UpdateUserItemRequestAction
  | UpdateUserItemSuccessAction
  | UpdateUserItemFailureAction;

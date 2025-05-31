// src/types/userItemTypes.ts
import { UserItem, FETCH_USER_ITEMS_REQUEST, FETCH_USER_ITEMS_SUCCESS, FETCH_USER_ITEMS_FAILURE, UPDATE_USER_ITEM_REQUEST, UPDATE_USER_ITEM_SUCCESS, UPDATE_USER_ITEM_FAILURE } from "./userItems.interface";

export interface UserItemState {
    items: UserItem[];
    loading: boolean;
    error: string | null;
    updating: boolean;
    updateError: string | null;
  }
  
  interface FetchUserItemsRequestAction {
    type: typeof FETCH_USER_ITEMS_REQUEST;
  }
  
  interface FetchUserItemsSuccessAction {
    type: typeof FETCH_USER_ITEMS_SUCCESS;
    payload: UserItem[];
  }
  
  interface FetchUserItemsFailureAction {
    type: typeof FETCH_USER_ITEMS_FAILURE;
    payload: string;
  }
  
  interface UpdateUserItemRequestAction {
    type: typeof UPDATE_USER_ITEM_REQUEST;
  }
  
  interface UpdateUserItemSuccessAction {
    type: typeof UPDATE_USER_ITEM_SUCCESS;
    payload: UserItem;
  }
  
  interface UpdateUserItemFailureAction {
    type: typeof UPDATE_USER_ITEM_FAILURE;
    payload: string;
  }
  
  export type UserItemActionTypes =
    | FetchUserItemsRequestAction
    | FetchUserItemsSuccessAction
    | FetchUserItemsFailureAction
    | UpdateUserItemRequestAction
    | UpdateUserItemSuccessAction
    | UpdateUserItemFailureAction;
  
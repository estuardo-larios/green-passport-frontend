export const FETCH_USER_ITEMS_REQUEST = "FETCH_USER_ITEMS_REQUEST";
export const FETCH_USER_ITEMS_SUCCESS = "FETCH_USER_ITEMS_SUCCESS";
export const FETCH_USER_ITEMS_FAILURE = "FETCH_USER_ITEMS_FAILURE";

export const UPDATE_USER_ITEM_REQUEST = "UPDATE_USER_ITEM_REQUEST";
export const UPDATE_USER_ITEM_SUCCESS = "UPDATE_USER_ITEM_SUCCESS";
export const UPDATE_USER_ITEM_FAILURE = "UPDATE_USER_ITEM_FAILURE";


export interface UserItem {
    id: number;
    userId: number;
    itemId: number;
    completed: boolean;
    score?: number;
    createdAt: string;
    updatedAt: string;
  }
  
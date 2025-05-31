// src/reducers/userItems.reducer.ts
import { FETCH_USER_ITEMS_REQUEST, FETCH_USER_ITEMS_SUCCESS, FETCH_USER_ITEMS_FAILURE, UPDATE_USER_ITEM_REQUEST, UPDATE_USER_ITEM_SUCCESS, UPDATE_USER_ITEM_FAILURE } from "@/interfaces/userItems.interface";

import { UserItemState, UserItemActionTypes } from "@/interfaces/userItemTypes";

/**
 * Estado inicial para el reducer de user items.
 */
const initialState: UserItemState = {
  items: [],
  loading: false,
  error: null,
  updating: false,
  updateError: null,
};

/**
 * Reducer para manejar el estado de los user items.
 * @param state Estado actual.
 * @param action Acción disparada.
 * @returns Nuevo estado.
 */
const userItemsReducer = (state = initialState, action: UserItemActionTypes): UserItemState => {
  switch (action.type) {
    case FETCH_USER_ITEMS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_USER_ITEMS_SUCCESS:
      return {
        ...state,
        loading: false,
        items: action.payload,
        error: null,
      };
    case FETCH_USER_ITEMS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case UPDATE_USER_ITEM_REQUEST:
      return {
        ...state,
        updating: true,
        updateError: null,
      };
    case UPDATE_USER_ITEM_SUCCESS:
      const updatedItem = action.payload;
      return {
        ...state,
        updating: false,
        items: state.items.map((item) => (item.id === updatedItem.id ? updatedItem : item)),
        updateError: null,
      };
    case UPDATE_USER_ITEM_FAILURE:
      return {
        ...state,
        updating: false,
        updateError: action.payload,
      };

    default:
      return state;
  }
};

export default userItemsReducer;

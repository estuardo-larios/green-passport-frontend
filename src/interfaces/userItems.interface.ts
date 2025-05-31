/** Constante para la acción de solicitud de obtención de ítems del usuario */
export const FETCH_USER_ITEMS_REQUEST = "FETCH_USER_ITEMS_REQUEST";

/** Constante para la acción de éxito en la obtención de ítems del usuario */
export const FETCH_USER_ITEMS_SUCCESS = "FETCH_USER_ITEMS_SUCCESS";

/** Constante para la acción de fallo en la obtención de ítems del usuario */
export const FETCH_USER_ITEMS_FAILURE = "FETCH_USER_ITEMS_FAILURE";

/** Constante para la acción de solicitud de actualización de un ítem del usuario */
export const UPDATE_USER_ITEM_REQUEST = "UPDATE_USER_ITEM_REQUEST";

/** Constante para la acción de éxito en la actualización de un ítem del usuario */
export const UPDATE_USER_ITEM_SUCCESS = "UPDATE_USER_ITEM_SUCCESS";

/** Constante para la acción de fallo en la actualización de un ítem del usuario */
export const UPDATE_USER_ITEM_FAILURE = "UPDATE_USER_ITEM_FAILURE";

/**
 * Representa un ítem asociado a un usuario, con su estado y metadata.
 */
export interface UserItem {
  /** Identificador único del ítem de usuario */
  id: number;

  /** Identificador del usuario asociado */
  userId: number;

  /** Identificador del ítem relacionado */
  itemId: number;

  /** Indica si el ítem ha sido completado */
  completed: boolean;

  /** Puntaje opcional asignado al ítem */
  score?: number;

  /** Fecha de creación del registro */
  createdAt: string;

  /** Fecha de última actualización del registro */
  updatedAt: string;
}

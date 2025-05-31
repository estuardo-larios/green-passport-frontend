// *Interfaces y tipos relacionados con usuarios y roles

/**
 * Representa un usuario del sistema.
 */
export interface IUser {
  id: number;
  username: string;
  email: string;
  password: string;
  role: string;
  createdAt: string;
}

/**
 * Props para un botón de acción dentro de una barra de herramientas.
 */
interface IActionButtonProps {
  label: string;
  onClick: () => void;
}

/**
 * Props genéricas para una barra de herramientas con filtrado y botón de acción.
 * @template T - Tipo de datos manejados por la barra de herramientas.
 */
export interface IToolbarProps<T> {
  data: T[];
  onFilter: (filteredData: T[]) => void;
  actionButton: IActionButtonProps;
}

/**
 * Props específicas para una barra de herramientas que trabaja con roles.
 */
export interface IToolbarRolesProps {
  data: IRoles[];
  onFilter: (filteredData: IRoles[]) => void;
  actionButton: IActionButtonProps;
}

/**
 * Representa las credenciales de acceso de un usuario.
 */
export interface IUserCredentials {
  email: string;
  password: string;
}

/**
 * Representa un rol asignado a un usuario.
 */
export interface IRoles {
  id: number;
  name: string;
  description: string;
}

// *Acciones relacionadas con usuarios (tipado de Redux)

/**
 * Acción para registrar un usuario exitosamente.
 */
interface RegisterSuccessAction {
  type: 'REGISTER_SUCCESS';
  payload: IUser;
}

/**
 * Acción para obtener un usuario exitosamente.
 */
interface FetchUserSuccessAction {
  type: 'FETCH_USER_SUCCESS';
  payload: IUser;
}

/**
 * Acción para obtener un usuario por su correo electrónico exitosamente.
 */
interface FetchUserByEmailSuccessAction {
  type: 'FETCH_USER_BY_EMAIL_SUCCESS';
  payload: IUser;
}

/**
 * Acción para representar un fallo en alguna operación de usuario.
 */
interface UserFailureAction {
  type: 'USER_FAILURE';
  payload: string;
}

/**
 * Tipo unificado para todas las acciones posibles sobre usuarios.
 */
export type UserActions =
  | RegisterSuccessAction
  | FetchUserSuccessAction
  | FetchUserByEmailSuccessAction
  | UserFailureAction;

// *Constantes de tipos de acción para Redux

/** Solicitud para obtener todos los usuarios. */
export const FETCH_USERS_REQUEST = 'FETCH_USERS_REQUEST';

/** Éxito al obtener la lista de usuarios. */
export const FETCH_USERS_SUCCESS = 'FETCH_USERS_SUCCESS';

/** Error al obtener la lista de usuarios. */
export const FETCH_USERS_FAILURE = 'FETCH_USERS_FAILURE';

/** Éxito al agregar un nuevo usuario. */
export const ADD_USER_SUCCESS = 'ADD_USER_SUCCESS';

/** Error al agregar un nuevo usuario. */
export const ADD_USER_FAILURE = 'ADD_USER_FAILURE';

/** Éxito al actualizar un usuario. */
export const UPDATE_USER_SUCCESS = 'UPDATE_USER_SUCCESS';

/** Error al actualizar un usuario. */
export const UPDATE_USER_FAILURE = 'UPDATE_USER_FAILURE';

/** Éxito al eliminar un usuario. */
export const DELETE_USER_SUCCESS = 'DELETE_USER_SUCCESS';

/** Error al eliminar un usuario. */
export const DELETE_USER_FAILURE = 'DELETE_USER_FAILURE';

/** Éxito al obtener un usuario por su correo electrónico. */
export const FETCH_USER_BY_EMAIL_SUCCESS = 'FETCH_USER_BY_EMAIL_SUCCESS';

/** Éxito al obtener un usuario. */
export const FETCH_USER_SUCCESS = 'FETCH_USER_SUCCESS';

/** Registro exitoso de usuario. */
export const REGISTER_SUCCESS = 'REGISTER_SUCCESS';

/** Error general relacionado con usuarios. */
export const USER_FAILURE = 'USER_FAILURE';

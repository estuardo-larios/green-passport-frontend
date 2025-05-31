// src/root.reducer.ts
import { combineReducers } from 'redux';
import loginReducer from './reducers/login.reducer';
import userReducer from './reducers/user.reducer';
import userItemsReducer from './reducers/userItems.reducer';

/**
 * Combina todos los reducers principales de la aplicación en un único rootReducer.
 * Cada clave del objeto representa una sección del estado global gestionada por su reducer correspondiente.
 */
const rootReducer = combineReducers({
  login: loginReducer,
  user: userReducer,
  userItems: userItemsReducer,
});

export default rootReducer;

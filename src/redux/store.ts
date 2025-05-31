import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './root.reducer';

/**
 * Configura y crea la store de Redux.
 * @returns La store configurada.
 */

const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>
export default store;
export type AppDispatch = typeof store.dispatch
export type AppStore = typeof store

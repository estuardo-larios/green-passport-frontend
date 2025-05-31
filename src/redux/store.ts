import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './root.reducer';

/**
 * Configures and creates the Redux store.
 * @returns The configured store.
 */

const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>
export default store;
export type AppDispatch = typeof store.dispatch
export type AppStore = typeof store

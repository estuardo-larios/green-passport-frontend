// src/root.reducer.ts
import { combineReducers } from 'redux';
import loginReducer from './reducers/login.reducer';
import userReducer from './reducers/user.reducer';
import userItemsReducer from './reducers/userItems.reducer';

const rootReducer = combineReducers({
  login: loginReducer,
  user: userReducer,
  userItems: userItemsReducer,
});


export default rootReducer;

import { combineReducers } from 'redux';
import AuthReducer from './AuthReducer';
// add reducers here 

// add reducers here

import { createStore, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

export const Reducers =  combineReducers({
  auth: AuthReducer,
});

//app store
export const Store = createStore(Reducers, {}, composeWithDevTools(applyMiddleware(ReduxThunk)));

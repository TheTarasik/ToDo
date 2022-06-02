import { combineReducers, configureStore } from '@reduxjs/toolkit';
import menu from './reducers/menu';
import todo from './reducers/todo';

const rootReducer = combineReducers({
     menu,
     todo
});

export const store = configureStore({
    reducer: rootReducer
});
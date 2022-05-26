import { combineReducers, configureStore } from '@reduxjs/toolkit';
import main from './reducers/main';
import menu from './reducers/menu';
import todo from './reducers/todo';

const rootReducer = combineReducers({
     main,
     menu,
     todo
});

export const store = configureStore({
    reducer: rootReducer
});
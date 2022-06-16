import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'
import menu from './reducers/menu';
import todo from './reducers/todo';

const rootReducer = combineReducers({
     menu,
     todo
});

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['todo']
}

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    })
});

export const persistor = persistStore(store);
import { createAction, createReducer } from '@reduxjs/toolkit';

const initialState = {
    show: false
};

export const showMenu = createAction('SHOW_MENU');

export default createReducer(initialState, {
    [showMenu]: (state, data) => {
        state.show = data.payload !== undefined ? data.payload : !state.show;
    }
});
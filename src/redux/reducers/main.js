import { createAction, createReducer } from '@reduxjs/toolkit';

const initialState = {
    count: 0
};

export const increment = createAction('INCREMENT');

export default createReducer(initialState, {
    [increment]: (state, payload) => {
        state.count = state.count + 1;
    },
});
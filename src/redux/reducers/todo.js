import { createAction, createReducer } from '@reduxjs/toolkit';

const initialState = {
     tasks: null
};

export const setTasks = createAction('SET_TASKS');

export default createReducer(initialState, {
    [setTasks]: (state, action) => {
        state.tasks = action.payload;
    }
});
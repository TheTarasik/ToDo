import { createAction, createReducer } from '@reduxjs/toolkit';

const initialState = {
     tasks: null,
     pageCount: null
};

export const setTasks = createAction('SET_TASKS');
export const setPageCount = createAction('SET_PAGE_COUNT');

export default createReducer(initialState, {
    [setTasks]: (state, action) => {
        state.tasks = action.payload;
    },
    [setPageCount]: (state, action) => {
        state.pageCount = action.payload;
    }
});
import { createAction, createReducer } from '@reduxjs/toolkit';

const initialState = {
     tasks: [],
     pageCount: null,
     sort: []
};

export const setTasks = createAction('SET_TASKS');
export const changeTask = createAction('CHANGE_TASK');
export const setPageCount = createAction('SET_PAGE_COUNT');
export const setSortType = createAction('SET_SORT_TYPE');

export default createReducer(initialState, {
    [setTasks]: (state, action) => {
        action.payload.forEach((task) => {
            if (task.isActive === undefined) {
                task.isActive = false;
            }

            if (task.isEdit === undefined) {
                task.isEdit = false;
            }
        });

        state.tasks = action.payload;
    },
    [changeTask]: (state, action) => {
        state.tasks = state.tasks.reduce((a, b) => {
            if (b.id === action.payload.id) {
                b = Object.assign(b, action.payload.data);
            }
            a.push(b);
            return a;
        }, []);
    },
    [setPageCount]: (state, action) => {
        state.pageCount = action.payload;
    },
    [setSortType]: (state, action) => {
        state.sort.includes(action.payload.type) ? 
            state.sort = state.sort.filter((a) => a !== action.payload.type)
            : 
            state.sort.push(action.payload.type);
    }
});
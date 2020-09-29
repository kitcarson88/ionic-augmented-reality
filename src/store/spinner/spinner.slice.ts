import { createSlice } from '@reduxjs/toolkit';

import { INITIAL_STATE_SPINNER } from './spinner.model';

const spinnerSlice = createSlice({
    name: 'spinner',
    initialState: INITIAL_STATE_SPINNER,
    reducers: {
        show() {
            return true;
        },
        hide() {
            return false;
        }
    }
});

const { actions, reducer } = spinnerSlice;

export const spinnerReducer = reducer;
export const { show, hide } = actions;
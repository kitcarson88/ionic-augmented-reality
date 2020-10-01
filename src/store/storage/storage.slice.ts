import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { StorageState, INITIAL_STATE_STORAGE } from './storage.model';

const storageSlice = createSlice({
    name: 'storage',
    initialState: INITIAL_STATE_STORAGE,
    reducers: {
        addPoi(state: StorageState, action: PayloadAction) {

        },
        removePoi(state: StorageState, action: PayloadAction) {

        },
        resetPois(state: StorageState, action: PayloadAction) {

        },
    }
});

const { actions, reducer } = storageSlice;

export const storageReducer = reducer;
export const { addPoi, removePoi, resetPois,  } = actions;
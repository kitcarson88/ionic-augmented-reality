import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { GpsState, INITIAL_STATE_GPS } from './gps.model';

const gpsSlice = createSlice({
    name: 'gps',
    initialState: INITIAL_STATE_GPS,
    reducers: {
        setCoordinates(state: GpsState, action: PayloadAction<any>) {
            state.coordinates = action.payload;
        },
        setFilteredCoordinates(state: GpsState, action: PayloadAction<any>) {
            state.distanceFilteredCoordinates = action.payload;
        },
        resetCoordinates(state: GpsState, action: PayloadAction) {
            return {
                ...state,
                coordinates: null
            }
        },
    }
});

const { actions, reducer } = gpsSlice;

export const gpsReducer = reducer;
export const { setCoordinates, setFilteredCoordinates, resetCoordinates } = actions;
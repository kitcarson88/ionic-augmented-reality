import { GpsState, INITIAL_STATE_GPS } from './gps.model';
import { GpsActions, GpsAction } from './gps.actions';

export function gpsReducer(state: GpsState = INITIAL_STATE_GPS, action: GpsAction): GpsState
{
    switch (action.type) {
        case GpsActions.SET_COORDINATES: {
            return {
                ...state,
                coordinates: (action as GpsAction).payload
            };
        }
        case GpsActions.SET_FILTERED_COORDINATES: {
            return {
                ...state,
                distanceFilteredCoordinates: (action as GpsAction).payload
            }
        }
        case GpsActions.RESET_COORDINATES: {
            return {
                ...state,
                coordinates: null
            };
        }
    }

    return state;
}

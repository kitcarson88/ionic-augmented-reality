import { MagnetometerState, INITIAL_STATE_MAGNETOMETER } from './magnetometer.model';
import { MagnetometerActions, MagnetometerAction } from './magnetometer.actions';

export function magnetometerReducer(state: MagnetometerState = INITIAL_STATE_MAGNETOMETER, action: MagnetometerAction): MagnetometerState
{
    switch (action.type) {
        case MagnetometerActions.SET_INTENSITIES: {
            return {
                ...state,
                coordinates: (action as MagnetometerAction).payload,
                error: false
            };
        }
        case MagnetometerActions.RESET_INTENSITIES: {
            return {
                ...state,
                coordinates: null,
                error: false
            };
        }
        case MagnetometerActions.ERROR_INTENSITIES: {
            return {
                ...state,
                error: true
            };
        }
    }

    return state;
}

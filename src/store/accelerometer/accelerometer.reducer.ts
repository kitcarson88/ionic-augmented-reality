import { AccelerometerState, INITIAL_STATE_ACCELEROMETER } from './accelerometer.model';
import { AccelerometerActions, AccelerometerAction } from './accelerometer.actions';

export function accelerometerReducer(state: AccelerometerState = INITIAL_STATE_ACCELEROMETER, action: AccelerometerAction): AccelerometerState
{
    switch (action.type) {
        case AccelerometerActions.SET_ACCELERATIONS: {
            return {
                ...state,
                coordinates: (action as AccelerometerAction).payload,
                error: false
            };
        }
        case AccelerometerActions.RESET_ACCELERATIONS: {
            return {
                ...state,
                coordinates: null,
                error: false
            };
        }
        case AccelerometerActions.ERROR_ACCELERATIONS: {
            return {
                ...state,
                error: true
            };
        }
    }

    return state;
}

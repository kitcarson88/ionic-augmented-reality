import { GyroscopeState, INITIAL_STATE_GYROSCOPE } from './gyroscope.model';
import { GyroscopeActions, GyroscopeAction } from './gyroscope.actions';

export function gyroscopeReducer(state: GyroscopeState = INITIAL_STATE_GYROSCOPE, action: GyroscopeAction): GyroscopeState
{
    switch (action.type) {
        case GyroscopeActions.SET_ANGLES: {
            return {
                ...state,
                coordinates: (action as GyroscopeAction).payload,
                error: false
            };
        }
        case GyroscopeActions.RESET_ANGLES: {
            return {
                ...state,
                coordinates: null,
                error: false
            };
        }
        case GyroscopeActions.ERROR_ANGLES: {
            return {
                ...state,
                error: true
            };
        }
    }

    return state;
}

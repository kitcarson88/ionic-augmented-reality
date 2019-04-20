import { AccelerometerState, INITIAL_STATE_ACCELEROMETER } from './accelerometer.model';
import { AccelerometerActions, AccelerometerAction } from './accelerometer.actions';

import { Utils } from '../../util/utils';

export function accelerometerReducer(state: AccelerometerState = INITIAL_STATE_ACCELEROMETER, action: AccelerometerAction): AccelerometerState
{
    switch (action.type) {
        case AccelerometerActions.SET_ACCELERATIONS: {
            let oldValues = null;

            if (state.coordinates)
                oldValues = [state.coordinates['x'], state.coordinates['y'], state.coordinates['z']];

            let payload = (action as AccelerometerAction).payload;
            let newValues = [Number(payload['x']), Number(payload['y']), Number(payload['z'])];

            let smoothedCoordinates = Utils.exponentialSmoothing(newValues, oldValues, 0.2);
            console.log("Smoothed accelerometer: ", smoothedCoordinates);

            let accelerometerData = {
                x: smoothedCoordinates[0],
                y: smoothedCoordinates[1],
                z: smoothedCoordinates[2],
                timestamp: payload.timestamp
            };

            return {
                ...state,
                coordinates: accelerometerData,
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

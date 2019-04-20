import { MagnetometerState, INITIAL_STATE_MAGNETOMETER } from './magnetometer.model';
import { MagnetometerActions, MagnetometerAction } from './magnetometer.actions';

import { MagneticFieldDTO } from '../../entities/dto/magneticFieldDTO';

import { Utils } from '../../util/utils';

export function magnetometerReducer(state: MagnetometerState = INITIAL_STATE_MAGNETOMETER, action: MagnetometerAction): MagnetometerState
{
    switch (action.type) {
        case MagnetometerActions.SET_INTENSITIES: {
            let oldValues = null;
            //let newValues = null;

            let oldCoordinates: MagneticFieldDTO = state.coordinates as MagneticFieldDTO | null;
            if (oldCoordinates)
                oldValues = [ oldCoordinates.x, oldCoordinates.y, oldCoordinates.z ];

            let newCoordinates: MagneticFieldDTO = (action as MagnetometerAction).payload as MagneticFieldDTO;
            //if (newCoordinates)
                let newValues = [ Number(newCoordinates.x), Number(newCoordinates.y), Number(newCoordinates.z) ];

            let smoothedCoordinates = Utils.exponentialSmoothing(oldValues, newValues, 0.5);
            console.log("Smoothed magnetometer: ", smoothedCoordinates);

            return {
                ...state,
                coordinates: new MagneticFieldDTO(smoothedCoordinates[0], smoothedCoordinates[1], smoothedCoordinates[2], newCoordinates.magnitude),
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

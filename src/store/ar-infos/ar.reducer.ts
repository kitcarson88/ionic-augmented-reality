import { ARState, INITIAL_STATE_AR } from './ar.model';
import { ARActions, ARAction } from './ar.actions';

export function arReducer(state: ARState = INITIAL_STATE_AR, action: ARAction): ARState
{
    switch (action.type) {
        case ARActions.SET_CAMERA_FOV: {
            return {
                ...state,
                cameraFov: (action as ARAction).payload as number
            };
        }
        case ARActions.SET_PIN_ARRAY: {
            return {
                ...state,
                pinArray: (action as ARAction).payload
            };
        }
        case ARActions.SET_FUSION_COORDINATES: {
            return {
                ...state,
                fusionCoordinates: (action as ARAction).payload
            };
        }
        case ARActions.SET_SPOT_ARRAY: {
            return {
                ...state,
                spotArray: (action as ARAction).payload
            };
        }
    }

    return state;
}

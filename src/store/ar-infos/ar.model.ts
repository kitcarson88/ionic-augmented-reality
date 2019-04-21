import { constants } from '../../util/constants';

export interface ARState {
    cameraFov: number,
    fusionCoordinates: any,
    pinArray: any[],
    spotArray: any[]
}

export const INITIAL_STATE_AR: ARState = {
    cameraFov: constants.CAMERA_DEFAULT_FOV,
    fusionCoordinates: null,
    pinArray: null,
    spotArray: null
};
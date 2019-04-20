export interface MagnetometerState {
    coordinates: any;
    error: boolean;
}

export const INITIAL_STATE_MAGNETOMETER: MagnetometerState = {
    coordinates: null,
    error: false
};
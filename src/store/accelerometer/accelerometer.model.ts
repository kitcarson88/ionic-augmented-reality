export interface AccelerometerState {
    coordinates: any;
    error: boolean;
}

export const INITIAL_STATE_ACCELEROMETER: AccelerometerState = {
    coordinates: null,
    error: false
};
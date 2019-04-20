export interface GyroscopeState {
    coordinates: any;
    error: boolean;
}

export const INITIAL_STATE_GYROSCOPE: GyroscopeState = {
    coordinates: null,
    error: false
};
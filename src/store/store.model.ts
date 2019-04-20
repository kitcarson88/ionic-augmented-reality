import { Action } from 'redux';

// import every model
import { AccelerometerState, INITIAL_STATE_ACCELEROMETER } from './accelerometer/accelerometer.model';
import { GyroscopeState, INITIAL_STATE_GYROSCOPE } from './gyroscope/gyroscope.model';
import { MagnetometerState, INITIAL_STATE_MAGNETOMETER } from './magnetometer/magnetometer.model';

export interface AppState
{
    accelerometer: AccelerometerState,
    gyroscope: GyroscopeState,
    magnetometer: MagnetometerState,
}

export const INITIAL_STATE: AppState = {
    accelerometer: INITIAL_STATE_ACCELEROMETER,
    gyroscope: INITIAL_STATE_GYROSCOPE,
    magnetometer: INITIAL_STATE_MAGNETOMETER,
};

export interface PayloadAction extends Action
{
    payload?: any;
}
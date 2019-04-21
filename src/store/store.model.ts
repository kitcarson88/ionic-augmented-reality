import { Action } from 'redux';

// import every model
import { GpsState, INITIAL_STATE_GPS } from './gps/gps.model';
import { AccelerometerState, INITIAL_STATE_ACCELEROMETER } from './accelerometer/accelerometer.model';
import { GyroscopeState, INITIAL_STATE_GYROSCOPE } from './gyroscope/gyroscope.model';
import { MagnetometerState, INITIAL_STATE_MAGNETOMETER } from './magnetometer/magnetometer.model';
import { PoiApiState, INITIAL_STATE_POI } from './poi-api/poi.model';

export interface AppState
{
    gps: GpsState,
    accelerometer: AccelerometerState,
    gyroscope: GyroscopeState,
    magnetometer: MagnetometerState,
    poi: PoiApiState
}

export const INITIAL_STATE: AppState = {
    gps: INITIAL_STATE_GPS,
    accelerometer: INITIAL_STATE_ACCELEROMETER,
    gyroscope: INITIAL_STATE_GYROSCOPE,
    magnetometer: INITIAL_STATE_MAGNETOMETER,
    poi: INITIAL_STATE_POI
};

export interface PayloadAction extends Action
{
    payload?: any;
}
import { Action } from 'redux';

// import every model
import { SpinnerState, INITIAL_STATE_SPINNER } from './spinner/spinner.model';
import { GpsState, INITIAL_STATE_GPS } from './gps/gps.model';
import { AccelerometerState, INITIAL_STATE_ACCELEROMETER } from './accelerometer/accelerometer.model';
import { GyroscopeState, INITIAL_STATE_GYROSCOPE } from './gyroscope/gyroscope.model';
import { MagnetometerState, INITIAL_STATE_MAGNETOMETER } from './magnetometer/magnetometer.model';
import { PoiApiState, INITIAL_STATE_POI } from './poi-api/poi.model';
import { ARState, INITIAL_STATE_AR } from './ar-infos/ar.model';

export interface AppState
{
    spinner: SpinnerState,
    gps: GpsState,
    accelerometer: AccelerometerState,
    gyroscope: GyroscopeState,
    magnetometer: MagnetometerState,
    poi: PoiApiState
    ar: ARState,
}

export const INITIAL_STATE: AppState = {
    spinner: INITIAL_STATE_SPINNER,
    gps: INITIAL_STATE_GPS,
    accelerometer: INITIAL_STATE_ACCELEROMETER,
    gyroscope: INITIAL_STATE_GYROSCOPE,
    magnetometer: INITIAL_STATE_MAGNETOMETER,
    poi: INITIAL_STATE_POI,
    ar: INITIAL_STATE_AR
};

export interface PayloadAction extends Action
{
    payload?: any;
}
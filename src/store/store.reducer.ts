//import { composeReducers, defaultFormReducer } from "@angular-redux/form";

import { combineReducers } from "redux";
import { routerReducer } from '@angular-redux/router';

import { persistReducer } from 'redux-persist';

import { AppState, INITIAL_STATE } from './store.model';

import { spinnerReducer } from './spinner/spinner.reducer';
import { splashReducer } from './splash/splash.reducer';
import { platformDeviceReducer } from "./platform-device/platform-device.reduces";
import { gpsReducer } from "./gps/gps.reducer";
import { accelerometerReducer } from "./accelerometer/accelerometer.reducer";
import { gyroscopeReducer } from "./gyroscope/gyroscope.reducer";
import { magnetometerReducer } from "./magnetometer/magnetometer.reducer";
import { arReducer } from './ar-infos/ar.reducer';
import { wsReducer } from './ws/ws.reducer';
import { storageReducer } from './storage/storage.reducer';

export default function reduceReducers(...reducers)
{
  return (previous, current) => reducers.reduce((p, r) => r(p, current), previous);
}

export function rootReducer(storage)
{
  const storagePersistConfig = {
    key: 'storage',
    storage,
    blacklist: []
  };
  const storagePersistedReducer = persistReducer(storagePersistConfig, storageReducer);

  return reduceReducers(
    combineReducers({
      router: routerReducer,
      spinner: spinnerReducer,
      splash: splashReducer,
      platformDevice: platformDeviceReducer,
      gps: gpsReducer,
      accelerometer: accelerometerReducer,
      gyroscope: gyroscopeReducer,
      magnetometer: magnetometerReducer,
      ar: arReducer,
      ws: wsReducer,
      storage: storagePersistedReducer
    }),
    mainReducer
  );
}

export function mainReducer(state: AppState = INITIAL_STATE, action: any): any
{
  return state;
}
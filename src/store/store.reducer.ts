import { createStoredReducer, createSecureStoredReducer } from '@redux-multipurpose/core';

import { appPlatformDeviceReducer } from './app-platform-device/app-platform-device.slice';
import { spinnerReducer } from './spinner/spinner.slice';
import { gpsReducer } from './gps/gps.slice';

export function rootReducer(storage)
{
  return {
    appPlatformDevice: appPlatformDeviceReducer,
		spinner: spinnerReducer,
		gps: gpsReducer
  };
}

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
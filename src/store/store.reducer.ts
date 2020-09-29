import { createStoredReducer, createSecureStoredReducer } from '@redux-multipurpose/core';

import { appPlatformDeviceReducer } from './app-platform-device/app-platform-device.slice';
import { spinnerReducer } from './spinner/spinner.slice';

export function rootReducer(storage)
{
  return {
    appPlatformDevice: appPlatformDeviceReducer,
		spinner: spinnerReducer
  };
}

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
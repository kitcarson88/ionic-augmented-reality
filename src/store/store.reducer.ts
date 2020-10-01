import { createStoredReducer, createSecureStoredReducer } from '@redux-multipurpose/core';

import { appPlatformDeviceReducer } from './app-platform-device/app-platform-device.slice';
import { spinnerReducer } from './spinner/spinner.slice';
import { gpsReducer } from './gps/gps.slice';
import { storageReducer } from './storage/storage.slice';

export function rootReducer(storage)
{
  const storagePersistedReducer = createStoredReducer('storage', storage, storageReducer);

	return {
    	appPlatformDevice: appPlatformDeviceReducer,
		spinner: spinnerReducer,
		gps: gpsReducer,
		storage: storagePersistedReducer
  };
}

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
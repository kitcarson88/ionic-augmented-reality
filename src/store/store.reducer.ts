import { createStoredReducer, createSecureStoredReducer } from '@redux-multipurpose/core';

import { appPlatformDeviceReducer } from './app-platform-device/app-platform-device.slice';

export function rootReducer(storage)
{
  return {
    appPlatformDevice: appPlatformDeviceReducer
  };
}

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AppPlatformDeviceInfos, AppPlatformDeviceState, INITIAL_STATE_APP_PLATFORM_DEVICE } from './app-platform-device.model';

const appPlatformDeviceSlice = createSlice({
    name: 'appPlatformDevice',
    initialState: INITIAL_STATE_APP_PLATFORM_DEVICE,
    reducers: {
        initInfos(state: AppPlatformDeviceState, action: PayloadAction<AppPlatformDeviceInfos>) {
            return {
                infos: {
                    appName: action.payload.appName,
                    appPackageName: action.payload.appPackageName,
                    appVersion: action.payload.appVersion,
                    appBuild: action.payload.appBuild,
                    manufacturer: action.payload.manufacturer,
                    model: action.payload.model,
                    uuid: action.payload.uuid,
                    os: action.payload.os,
                    version: action.payload.version,
                    platform: action.payload.platform,
                    integration: action.payload.integration,
                    virtual: action.payload.virtual,
                    width: action.payload.width,
                    height: action.payload.height,
                    freeDiskSpace: action.payload.freeDiskSpace,
                    totalDiskSpace: action.payload.totalDiskSpace,
                    memoryUsage: action.payload.memoryUsage
                }
            };
        },
    }
});

const { actions, reducer } = appPlatformDeviceSlice;

export const appPlatformDeviceReducer = reducer;
export const { initInfos } = actions;
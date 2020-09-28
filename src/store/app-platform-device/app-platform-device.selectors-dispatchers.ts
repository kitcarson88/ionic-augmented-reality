import { Injectable } from '@angular/core';

import { dispatch } from '@redux-multipurpose/core';

import { AppPlatformDeviceInfos } from './app-platform-device.model';

import {
    initInfos as initInfosAction,
} from './app-platform-device.slice';

@Injectable()
export class AppPlatformDeviceActions
{
    @dispatch()
    initializeInfos = (options: AppPlatformDeviceInfos) => {
        return initInfosAction(options);
    };
    
}
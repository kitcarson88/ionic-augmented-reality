import { Injectable } from "@angular/core";
import { dispatch } from "@angular-redux/store";
import { Action } from "redux";

export interface PlatformDeviceAction extends Action
{
    payload?: any;
}

@Injectable()
export class PlatformDeviceActions
{
    static readonly INIT_INFOS = 'INIT_INFOS';

    constructor() { }

    @dispatch()
    initializeInfos = (
        manufacturer: string,
        model: string,
        uuid: string,
        serial: string,
        os: 'ios' | 'android' | 'other',
        version: string,
        platform: string,
        integration: 'cordova' | 'electron' | 'none',
        width: number,
        height: number
    ): PlatformDeviceAction => ({
        type: PlatformDeviceActions.INIT_INFOS, payload: {
            manufacturer,
            model,
            uuid,
            serial,
            os,
            version,
            platform,
            integration,
            width,
            height
        }
    });
}
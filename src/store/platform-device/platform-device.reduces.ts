import { PlatformDeviceState, INITIAL_STATE_PLATFORM_DEVICE } from './platform-device.model';
import { PlatformDeviceActions, PlatformDeviceAction } from './platform-device.actions';

export function platformDeviceReducer(state: PlatformDeviceState = INITIAL_STATE_PLATFORM_DEVICE, action: PlatformDeviceAction): PlatformDeviceState
{
    switch (action.type)
    {
        case PlatformDeviceActions.INIT_INFOS:
            return {
                infos: {
                    manufacturer: action.payload.manufacturer,
                    model: action.payload.model,
                    uuid: action.payload.uuid,
                    serial: action.payload.serial,
                    os: action.payload.os,
                    version: action.payload.version,
                    platform: action.payload.platform,
                    integration: action.payload.integration,
                    width: action.payload.width,
                    height: action.payload.height
                }
            };
    }

    return state;
}

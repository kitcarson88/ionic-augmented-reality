export interface PlatformDeviceState
{
    infos: {
        manufacturer: string;
        model: string;  //a code that identifies device model
        uuid: string;
        serial: string;
        os: 'ios' | 'android' | 'other';
        version: string;    //A device version
        platform: string;   //The os platform
        integration: 'cordova' | 'electron' | 'none';
        width: number;
        height: number;
    };
};

export const INITIAL_STATE_PLATFORM_DEVICE: PlatformDeviceState = {
    infos: null
};
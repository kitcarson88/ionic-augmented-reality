
import { Platform } from '@ionic/angular';

import { DeviceInfo } from '@capacitor/core';

export class Utils
{
    public static isIos(plt: Platform): boolean
    {
        return plt.is("ios");
    }

    public static isAndroid(plt: Platform): boolean
    {
        return plt.is("android");
    }

    static hasIosMinVersion(version: string, minVersion: number = 12): boolean
    {
        try
        {
            return version && parseInt(version) >= minVersion;
        }
        catch (exception)
        {
            return false;
        }
    }

    public static isiPhoneX(plt: Platform, dev: DeviceInfo)
    {
        return Utils.isIos(plt) && Utils.hasIosMinVersion(dev.osVersion, 11) && plt.width() === 375 && plt.height() === 812;
    }

    public static isiPhoneXMax(plt: Platform, dev: DeviceInfo)
    {
        return Utils.isIos(plt) && Utils.hasIosMinVersion(dev.osVersion, 11) && plt.width() === 414 && plt.height() === 896;
    }

    public static isGpsInError(gpsData: any)
    {
        return !(gpsData && gpsData['coords'] && gpsData['coords']['latitude'] && gpsData['coords']['longitude']);
    }
}
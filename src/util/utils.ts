import { Platform } from '@ionic/angular';

export class Utils
{
    public static exponentialSmoothing(input: number[], output: number[], alpha: number)
    {
        if (!input)
            return output;
        if (!output) 
            return input;

        for (let i = 0; i < input.length; i++)
             output[i] = output[i] + alpha * (input[i] - output[i]);

        return output;
    }

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
        return version && parseInt(version) >= minVersion;
    }
}

export class AugmentedRealityUtils
{
    private static readonly DEG2RAD = Math.PI / 180;
    private static readonly EARTH_RADIUS = 6371;  //Earth radius in km

    public static calculateDistance(lat1: number, long1: number, lat2: number, long2: number): number {
        //return 11 * 10000 * Math.sqrt(Math.pow(lat1 - lat2, 2) + Math.pow(long1 - long2, 2));
        var R = AugmentedRealityUtils.EARTH_RADIUS; // Radius of the earth in km
        var dLat = (lat2 - lat1) * AugmentedRealityUtils.DEG2RAD;  //Latitude delta in rad
        var dLon = (long2 - long1) * AugmentedRealityUtils.DEG2RAD;  //Latitude delta in rad
        var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(AugmentedRealityUtils.DEG2RAD * lat1) * Math.cos(AugmentedRealityUtils.DEG2RAD * lat2) * 
          Math.sin(dLon/2) * Math.sin(dLon/2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
        var d = R * c; // Distance in km
        return d;
    }
}
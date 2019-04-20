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
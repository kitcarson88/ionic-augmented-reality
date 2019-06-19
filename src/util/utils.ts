import { Platform } from '@ionic/angular';

import { constants } from './constants';

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

    public static relativePosition(pin, position): any
    {
        //The pin is enriched with distance and relative to user position bearing informations
        if (pin && position)
        {
          let pinLat: number = pin.latitude;
          let pinLng: number = pin.longitude;
          let dLat: number = (position.latitude - pinLat) * Math.PI / 180;
          let dLon: number = (position.longitude - pinLng) * Math.PI / 180;
          let lat1: number = pinLat * Math.PI / 180;
          let lat2: number = position.latitude * Math.PI / 180;
          let y: number = Math.sin(dLon) * Math.cos(lat2);
          let x: number = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
          let bearing: number = Math.atan2(y, x) * 180 / Math.PI;
          bearing = bearing + 180;
          pin['bearing'] = bearing;
    
          let a: number = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
          let c: number = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    
          let distance: Object = {
            miles: 3958.76 * c,
            meter: (3958.76 * c) * 1609.34
          };
          pin['distance'] = distance;
        }
    
        return pin;
    }

    public static calculateDirection(angleHorizontal: number, angleVertical: number, pinArray: any[], cameraFOV: number): any[]
    { 
        let spotArray = [];

        //A spot array is enriched. For each pin contained in the camera field of view a spot data is created and
        //pushed into the spot array
        for (let pin of pinArray)
        {
            let pinBearing = pin.bearing;
            let userDegrees = angleHorizontal;

            //Adjusting fov calculation when user has an orientation greater than 0 degrees (and near to it)
            // and the pin bearing is less than 360 (but near to it)
            if (userDegrees <= cameraFOV / 2 && 360 - pinBearing < cameraFOV / 2 - userDegrees)
                pinBearing -= 360;

            //Adjusting fov calculation when pin bearing has an orientation greater than 0 degrees (and near to it)
            // and the user orientation is less than 360 (but near to it)
            if (pinBearing <= cameraFOV / 2 && 360 -  userDegrees < cameraFOV / 2 - pinBearing)
                userDegrees -= 360;

            //The angle displacement between user and pin
            let angleDisplacement: number = pinBearing - userDegrees;

            //If    -cameraFOV / 2 <= angleDisplacement <= cameraFOV / 2
            //the pin is included into camera field of view. So the app creates
            //a spot that contains informations about screen displacement to draw a marker
            if (Math.abs(angleDisplacement) <= cameraFOV / 2)
            {                
                let screenRelativePositionX: number = angleDisplacement;
                screenRelativePositionX += cameraFOV / 2;
                screenRelativePositionX = (screenRelativePositionX / cameraFOV) * 100;

                let screenRelativePositionY: number;
                //100 * (180 - angleVertical) / 180;  Modified to set top value from -80% to 180%
                //screenRelativePositionY = 220 * (180 - angleVertical) / 180 - 80;

                if (88 < angleVertical && angleVertical < 92)
                    screenRelativePositionY = 20;
                else if (angleVertical >= 92)  //Phone pointed toward the ground -> must move pin to the top of the screen
                    screenRelativePositionY = 100 * (180 - angleVertical) / 88 - 80;
                else if (angleVertical <= 88) //Phone pointed toward sky -> must move pin to the bottom of the screen
                    screenRelativePositionY = 160 * (88 - angleVertical) / 88 + 20;

                let relativeSize = 85 * (1 - pin.distance.meter / constants.RADAR_POI_RADIUS) + 15;

                spotArray.push({
                    id: pin.latitude + pin.longitude + pin.distance.meter,
                    title: pin.title,
                    description: pin.description,
                    distance: pin.distance.meter,
                    screenRelativePositionX: screenRelativePositionX,
                    screenRelativePositionY: screenRelativePositionY,
                    relativeSize: relativeSize
                });
            }
        }

        return spotArray;
    }
}
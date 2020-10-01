import { Injectable } from '@angular/core';

import { Plugins } from '@capacitor/core';
const { Geolocation } = Plugins;

import { dispatch } from '@redux-multipurpose/core';

import {
    setCoordinates as setCoordinatesAction,
    setFilteredCoordinates as setFilteredCoordinatesAction,
    resetCoordinates as resetCoordinatesAction,
} from './gps.slice';

import { constants } from '../../utils/constants';

@Injectable()
export class GpsActions
{
    private locationWatchId: any = null;


    @dispatch()
    setCoordinates = (data: any) => {
        return setCoordinatesAction(data);
    };
    
    @dispatch()
    setFilteredCoordinates = (data) => {
        return setFilteredCoordinatesAction(data);
    };
    
    @dispatch()
    resetCoordinates = () => {
        return resetCoordinatesAction();
    };
    
    startService = () => {
        let options = {
            maximumAge: constants.GPS_MAXIMUM_AGE,
            enableHighAccuracy: constants.GPS_ENABLE_HIGH_ACCURACY
        }

        if (constants.GPS_TIMEOUT_ENABLED)
            options['timeout'] = constants.GPS_TIMEOUT;

        this.locationWatchId = Geolocation.watchPosition(options, position => {
            if (position.coords !== undefined)
                this.setCoordinates(position);
        });
    };

    stopService = () => {
        if (this.locationWatchId)
        {
            Geolocation.clearWatch(this.locationWatchId);
            this.locationWatchId = null;
        }
        this.resetCoordinates();
    };

    getPosition = async () =>
    {
        let options = {
            maximumAge: constants.GPS_MAXIMUM_AGE,
            enableHighAccuracy: constants.GPS_ENABLE_HIGH_ACCURACY
        }

        if (constants.GPS_TIMEOUT_ENABLED)
            options['timeout'] = constants.GPS_TIMEOUT;

        let p = await Geolocation.getCurrentPosition(options);
        console.log("current position: ", p);
        this.setCoordinates(p);
        return p;
    };
}
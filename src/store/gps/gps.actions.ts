import { Injectable } from "@angular/core";
import { filter } from 'rxjs/operators';
import { Geolocation } from '@ionic-native/geolocation/ngx';

import { dispatch } from "@angular-redux/store";
import { Action } from "redux";

import { constants } from "../../utils/constants";

export interface GpsAction extends Action {
    payload?: any;
}

@Injectable()
export class GpsActions
{
    static readonly SET_COORDINATES = "SET_COORDINATES";
    static readonly SET_FILTERED_COORDINATES = "SET_FILTERED_COORDINATES";
    static readonly RESET_COORDINATES = "RESET_COORDINATES";

    private locationServiceSubscription: any = null;

    constructor(private locationService: Geolocation) { }

    @dispatch()
    setCoordinates = (data: any): GpsAction => ({ type: GpsActions.SET_COORDINATES, payload: data});

    @dispatch()
    setDistanceFilteredCoordinates = (data: any): GpsAction => ({ type: GpsActions.SET_FILTERED_COORDINATES, payload: data});

    @dispatch()
    resetCoordinates = (): GpsAction => ({ type: GpsActions.RESET_COORDINATES });

    startService = () => {
        let options = {
            maximumAge: constants.GPS_MAXIMUM_AGE,
            enableHighAccuracy: constants.GPS_ENABLE_HIGH_ACCURACY
        }

        if (constants.GPS_TIMEOUT_ENABLED)
            options['timeout'] = constants.GPS_TIMEOUT;

        this.locationServiceSubscription = this.locationService.watchPosition(options)
            .pipe(filter((p) => p.coords !== undefined))    //Filter Out Errors
            .subscribe(position => {
                this.setCoordinates(position);
            });
    };

    stopService = () => {
        if (this.locationServiceSubscription)
        {
            this.locationServiceSubscription.unsubscribe();
            this.locationServiceSubscription = null;
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

        let p = await this.locationService.getCurrentPosition(options);
        console.log("P: ", p);
        this.setCoordinates(p);
        return p;

        /*this.locationService.getCurrentPosition(options).then(p =>
        {
            console.log("p: ", p);
            if (p && p.coords)
                this.setCoordinates(p);
        });*/
    };
}

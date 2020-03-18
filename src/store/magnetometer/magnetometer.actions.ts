import { Injectable } from "@angular/core";

import { dispatch } from "@angular-redux/store";
import { Action } from "redux";

import { Magnetometer, MagnetometerReading } from '@ionic-native/magnetometer/ngx';

import { MagneticFieldDTO } from "../../entities/dto/magneticFieldDTO";

import { constants } from "../../utils/constants";

export interface MagnetometerAction extends Action {
    payload?: any;
}

@Injectable()
export class MagnetometerActions
{
    static readonly SET_INTENSITIES = "SET_INTENSITIES";
    static readonly ERROR_INTENSITIES = "ERROR_INTENSITIES";
    static readonly RESET_INTENSITIES = "RESET_INTENSITIES";

    private magnetometerServiceSubscription: any = null;

    constructor(private magnetometerService: Magnetometer) {}

    @dispatch()
    setIntensity = (data: any): MagnetometerAction => ({ type: MagnetometerActions.SET_INTENSITIES, payload: data });

    @dispatch()
    setSensorInError = (): MagnetometerAction => ({ type: MagnetometerActions.ERROR_INTENSITIES });

    @dispatch()
    resetIntensity = (): MagnetometerAction => ({ type: MagnetometerActions.RESET_INTENSITIES });

    startService = () => {
        try
        {
            this.magnetometerServiceSubscription = this.magnetometerService.watchReadings()
                .subscribe((reading: MagnetometerReading) => {
                    this.setIntensity(reading);
                });
        }
        catch (err)
        {
            console.log("Magnetometer sensor error: ", err);
            this.stopService();
            this.setSensorInError();
        }
    };

    stopService = () => {
        if (this.magnetometerServiceSubscription)
        {
            this.magnetometerServiceSubscription.unsubscribe();
            this.magnetometerServiceSubscription = null;
        }
        this.resetIntensity();
    };
}

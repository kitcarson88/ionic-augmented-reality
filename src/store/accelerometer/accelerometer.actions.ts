import { Injectable } from "@angular/core";
import { DeviceMotion, DeviceMotionAccelerationData, DeviceMotionAccelerometerOptions } from '@ionic-native/device-motion/ngx';

import { dispatch, NgRedux } from "@angular-redux/store";
import { Action } from "redux";
import { AppState } from '../store.model';

import { constants } from '../../util/constants';

export interface AccelerometerAction extends Action {
    payload?: any;
}

@Injectable()
export class AccelerometerActions
{
    static readonly SET_ACCELERATIONS = "SET_ACCELERATIONS";
    static readonly ERROR_ACCELERATIONS = "ERROR_ACCELERATIONS";
    static readonly RESET_ACCELERATIONS = "RESET_ACCELERATIONS";

    private accelerometerServiceSubscription: any = null;

    isAlive: boolean = true;

    constructor(private ngRedux: NgRedux<AppState>, private accelerometerService: DeviceMotion) {}

    @dispatch()
    setAcceleration = (data: any): AccelerometerAction => ({ type: AccelerometerActions.SET_ACCELERATIONS, payload: data });

    @dispatch()
    setSensorInError = (): AccelerometerAction => ({ type: AccelerometerActions.ERROR_ACCELERATIONS });

    @dispatch()
    resetAcceleration = (): AccelerometerAction => ({ type: AccelerometerActions.RESET_ACCELERATIONS });

    startService = () => {
        let options: DeviceMotionAccelerometerOptions = {
            frequency: constants.ACCELEROMETER_FREQUENCY
        };

        try
        {
            this.accelerometerServiceSubscription = this.accelerometerService.watchAcceleration(options)
                .subscribe((motion: DeviceMotionAccelerationData) => {
                    this.setAcceleration(motion);
                });
        }
        catch (err)
        {
            console.log("Accelerometer sensor error: ", err);
            this.stopService();
            this.setSensorInError();
        }
    };

    stopService = () => {
        if (this.accelerometerServiceSubscription)
        {
            this.accelerometerServiceSubscription.unsubscribe();
            this.accelerometerServiceSubscription = null;
        }
        this.resetAcceleration();
    };

    ngOnDestroy(): void {
        this.isAlive = false;
    }
}

import { Injectable } from "@angular/core";
import { Gyroscope, GyroscopeOrientation, GyroscopeOptions } from '@ionic-native/gyroscope/ngx';

import { dispatch, NgRedux } from "@angular-redux/store";
import { Action } from "redux";
import { AppState } from '../store.model';

import { constants } from "../../util/constants";

export interface GyroscopeAction extends Action {
    payload?: any;
}

@Injectable()
export class GyroscopeActions
{
    static readonly SET_ANGLES = "SET_ANGLES";
    static readonly ERROR_ANGLES = "ERROR_ANGLES";
    static readonly RESET_ANGLES = "RESET_ANGLES";

    private gyroscopeServiceSubscription: any = null;


    isAlive: boolean = true;

    constructor(private ngRedux: NgRedux<AppState>, private gyroscopeService: Gyroscope) {}

    @dispatch()
    setOrientation = (data: any): GyroscopeAction => ({ type: GyroscopeActions.SET_ANGLES, payload: data });

    @dispatch()
    setSensorInError = (): GyroscopeAction => ({ type: GyroscopeActions.ERROR_ANGLES });

    @dispatch()
    resetOrientation = (): GyroscopeAction => ({ type: GyroscopeActions.RESET_ANGLES });

    startService = () => {
        let options: GyroscopeOptions = {
            frequency: constants.GYROSCOPE_FREQUENCY
        };

        try
        {
            this.gyroscopeServiceSubscription = this.gyroscopeService.watch(options)
                .subscribe((orientation: GyroscopeOrientation) => {
                    this.setOrientation(orientation);
                });
        }
        catch (err)
        {
            console.log("Gyroscope sensor error: ", err);
            this.stopService();
            this.setSensorInError();
        }
    };

    stopService = () => {
        if (this.gyroscopeServiceSubscription)
        {
            this.gyroscopeServiceSubscription.unsubscribe();
            this.gyroscopeServiceSubscription = null;
        }
        this.resetOrientation();
    };

    ngOnDestroy(): void {
        this.isAlive = false;
    }
}

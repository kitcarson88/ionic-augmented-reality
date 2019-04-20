import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { dispatch, NgRedux } from "@angular-redux/store";
import { Action } from "redux";
import { AppState } from '../store.model';

import { MagneticFieldDTO } from "../../entities/dto/magneticFieldDTO";

import { constants } from "../../util/constants";

export interface MagnetometerAction extends Action {
    payload?: any;
}

@Injectable()
export class MagnetometerActions
{
    static readonly SET_INTENSITIES = "SET_INTENSITIES";
    static readonly ERROR_INTENSITIES = "ERROR_INTENSITIES";
    static readonly RESET_INTENSITIES = "RESET_INTENSITIES";

    private magnetometerSubscription: any = null;

    isAlive: boolean = true;

    constructor(private ngRedux: NgRedux<AppState>) {}

    @dispatch()
    setIntensity = (data: any): MagnetometerAction => ({ type: MagnetometerActions.SET_INTENSITIES, payload: data });

    @dispatch()
    setSensorInError = (): MagnetometerAction => ({ type: MagnetometerActions.ERROR_INTENSITIES });

    @dispatch()
    resetIntensity = (): MagnetometerAction => ({ type: MagnetometerActions.RESET_INTENSITIES });

    startService = () => {
        if (constants.MAGNETOMETER_MOCKED)
        {
            let reading = {
                magnitude: 27.70505933038224,
                x: -16.619998931884766,
                y: -12.420000076293945,
                z: -18.35999870300293
            };

            this.setIntensity(new MagneticFieldDTO(reading['x'], reading['y'], reading['z'], reading['magnitude']));

            this.magnetometerSubscription = setInterval(() => {
                this.setIntensity(new MagneticFieldDTO(reading['x'], reading['y'], reading['z'], reading['magnitude']));
            }, constants.MAGNETOMETER_MOCK_FREQUENCY);
        }
        else
        {
            if (window['cordova'] && window['cordova']['plugins'] && window['cordova']['plugins']['magnetometer'])
            {
                let magnetometerService = window['cordova']['plugins']['magnetometer'];
                this.magnetometerSubscription = magnetometerService.watchReadings((reading) => {
                    this.setIntensity(new MagneticFieldDTO(reading['x'], reading['y'], reading['z'], reading['magnitude']));
                }, err => {
                    let magnetometerService = window['cordova']['plugins']['magnetometer'];
                    magnetometerService.stop([this.magnetometerSubscription]);
                    
                    this.setSensorInError();
                });
            }
            else this.setSensorInError();
        }
    };

    stopService = () => {
        if (constants.MAGNETOMETER_MOCKED)
        {
            clearInterval(this.magnetometerSubscription);
        }
        else
        {
            if (window['cordova'] && window['cordova']['plugins'] && window['cordova']['plugins']['magnetometer'])
            {
                let magnetometerService = window['cordova']['plugins']['magnetometer'];
                magnetometerService.stop([this.magnetometerSubscription]);
            }
            else this.setSensorInError();
        }
    };

    ngOnDestroy(): void {
        this.isAlive = false;
    }
}

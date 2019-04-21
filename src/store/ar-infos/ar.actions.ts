import { Injectable } from "@angular/core";

import { dispatch, NgRedux } from "@angular-redux/store";
import { Action } from "redux";
import { AppState } from '../store.model';

export interface ARAction extends Action {
    payload?: any;
}

@Injectable()
export class ARActions
{
    static readonly SET_CAMERA_FOV = "SET_CAMERA_FOV";
    static readonly SET_PIN_ARRAY = "SET_PIN_ARRAY";
    static readonly SET_FUSION_COORDINATES = "SET_FUSION_COORDINATES";
    static readonly SET_SPOT_ARRAY = "SET_SPOT_ARRAY";

    isAlive: boolean = true;

    constructor(private ngRedux: NgRedux<AppState>) {}

    @dispatch()
    setCameraFov = (fov: number): ARAction => ({ type: ARActions.SET_CAMERA_FOV, payload: fov });

    @dispatch()
    setPinArray = (data: any): ARAction => ({ type: ARActions.SET_PIN_ARRAY, payload: data });

    @dispatch()
    setFusionCoordinates = (coordinates: any): ARAction => ({ type: ARActions.SET_FUSION_COORDINATES, payload: coordinates });

    @dispatch()
    setSpotArray = (data: any): ARAction => ({ type: ARActions.SET_SPOT_ARRAY, payload: data });

    ngOnDestroy(): void {
        this.isAlive = false;
    }
}

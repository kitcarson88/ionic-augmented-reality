import { Injectable } from "@angular/core";

import { dispatch } from "@angular-redux/store";
import { Action } from "redux";

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

    constructor() {}

    @dispatch()
    setCameraFov = (fov: number): ARAction => ({ type: ARActions.SET_CAMERA_FOV, payload: fov });

    @dispatch()
    setPinArray = (data: any): ARAction => ({ type: ARActions.SET_PIN_ARRAY, payload: data });

    @dispatch()
    setFusionCoordinates = (coordinates: any): ARAction => ({ type: ARActions.SET_FUSION_COORDINATES, payload: coordinates });

    @dispatch()
    setSpotArray = (data: any): ARAction => ({ type: ARActions.SET_SPOT_ARRAY, payload: data });
}

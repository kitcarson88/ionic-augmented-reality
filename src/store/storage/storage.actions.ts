
import { Injectable } from "@angular/core";

import { dispatch } from "@angular-redux/store";
import { Action } from "redux";

export interface StorageAction extends Action {
    payload?: any;
}

@Injectable()
export class StorageActions
{
    static readonly ADD_POI = 'ADD_POI';
    static readonly REMOVE_POI = 'REMOVE_POI';
    static readonly RESET_POIS = 'RESET_POIS';
    constructor() {}

    @dispatch()
    addPoi = (poi): StorageAction => ({ type: StorageActions.ADD_POI, payload: poi });

    @dispatch()
    removePoi = (lat: number, lng: number) => ({ type: StorageActions.REMOVE_POI, payload: {lat, lng} });

    @dispatch()
    resetPois = (): StorageAction => ({ type: StorageActions.RESET_POIS });
}

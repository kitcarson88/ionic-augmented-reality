import { Injectable } from "@angular/core";

import { dispatch } from "@angular-redux/store";
import { Action } from "redux";

export interface WsAction extends Action
{
    payload?: any;
}

@Injectable()
export class WsActions
{
    static readonly RETRIEVE_POIS = 'RETRIEVE_POIS';
    static readonly RETRIEVE_POIS_LOADING = 'RETRIEVE_POIS_LOADING';
    static readonly RETRIEVE_POIS_SUCCESS = 'RETRIEVE_POIS_SUCCESS';
    static readonly RETRIEVE_POIS_ERROR = 'RETRIEVE_POIS_ERROR';

    constructor() { }
}

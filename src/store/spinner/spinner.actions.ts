import { Injectable } from "@angular/core";

import { dispatch } from "@angular-redux/store";
import { Action } from "redux";

export interface SpinnerAction extends Action
{
    payload?: any;
}

@Injectable()
export class SpinnerActions
{
    static readonly SHOW_SPINNER = 'SHOW_SPINNER';
    static readonly HIDE_SPINNER = 'HIDE_SPINNER';

    constructor() { }

    @dispatch()
    showLoader = (): SpinnerAction => ({
        type: SpinnerActions.SHOW_SPINNER
    });

    @dispatch()
    dismissLoader = (): SpinnerAction => ({
        type: SpinnerActions.HIDE_SPINNER
    });
}

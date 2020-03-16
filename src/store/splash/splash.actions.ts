import { Injectable } from "@angular/core";

import { dispatch } from "@angular-redux/store";
import { Action } from "redux";

export interface SplashAction extends Action
{
    payload?: any;
}

@Injectable()
export class SplashActions
{
    static readonly HIDE_SPLASH = 'HIDE_SPLASH';
    static readonly SET_SPLASH_STATE = 'SET_SPLASH_STATE';

    constructor() { }

    @dispatch()
    hideSplash = (): SplashAction => ({ type: SplashActions.HIDE_SPLASH });
}

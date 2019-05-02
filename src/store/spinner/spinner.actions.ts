import { Injectable } from "@angular/core";

import { dispatch, NgRedux } from "@angular-redux/store";
import { Action } from "redux";
import { AppState } from '../store.model';

import { environment } from '../../environments/environment';
import { constants } from '../../util/constants';

export interface SpinnerAction extends Action {
    payload?: any;
}

@Injectable()
export class SpinnerActions
{
    static readonly SHOW_SPINNER = 'SHOW_SPINNER';
    static readonly HIDE_SPINNER = 'HIDE_SPINNER';

    isAlive: boolean = true;

    constructor(private ngRedux: NgRedux<AppState>) { }

    @dispatch()
    showLoader = (): SpinnerAction => ({
        type: SpinnerActions.SHOW_SPINNER
    });

    @dispatch()
    dismissLoader = (): SpinnerAction => ({
        type: SpinnerActions.HIDE_SPINNER
    });

    ngOnDestroy(): void {
        this.isAlive = false;
    }
}

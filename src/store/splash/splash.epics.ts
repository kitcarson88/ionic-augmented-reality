import { Injectable } from '@angular/core';
import { Epic, ofType } from 'redux-observable-es6-compat';
import { delay, mergeMap } from 'rxjs/operators';
import { of, concat } from 'rxjs';

import { AppState } from '../store.model';

import { SplashActions } from './splash.actions';

import { constants } from '../../utils/constants';

@Injectable()
export class SplashEpics
{
    constructor() { }

    createSplashAnimation(): Epic<any, any, AppState>
    {
        console.log("Registering epic createSplashAnimation on splash/HIDE_SPLASH");

        return (action$, _) => action$.pipe(ofType(SplashActions.HIDE_SPLASH),
            mergeMap(_ => concat(
                of(({ type: SplashActions.SET_SPLASH_STATE, payload: 'fadeIn' })).pipe(delay(constants.SPLASH_ANIMATION_FADE_IN_DELAY)),
                of(({ type: SplashActions.SET_SPLASH_STATE, payload: 'animation' })).pipe(delay(constants.SPLASH_ANIMATION_DELAY)),
                of(({ type: SplashActions.SET_SPLASH_STATE, payload: 'fadeOut' })).pipe(delay(constants.SPLASH_ANIMATION_FADE_OUT_DELAY)),
                of(({ type: SplashActions.SET_SPLASH_STATE, payload: 'inactive' })).pipe(delay(800))
            ))
        );
    }
}
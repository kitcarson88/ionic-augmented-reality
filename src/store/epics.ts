import { Injectable } from '@angular/core';

//import { combineEpics } from 'redux-observable';
import { combineEpics } from 'redux-observable-es6-compat';

import { SplashEpics } from './splash/splash.epics';
import { WsEpics } from './ws/ws.epics';

@Injectable()
export class RootEpics
{
    constructor(
        private splashEpics: SplashEpics,
        private wsEpics: WsEpics
    ) { }

    createEpics()
    {
        return combineEpics(
            this.splashEpics.createSplashAnimation(),
            this.wsEpics.createRetrievePoisEpic()
        );
    }
}
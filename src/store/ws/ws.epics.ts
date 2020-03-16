import { Injectable } from '@angular/core';
import { Epic, ofType } from 'redux-observable-es6-compat';
import { mergeMap, filter, catchError } from 'rxjs/operators';
import { of, concat } from 'rxjs';

import { AppState } from '../store.model';

import { WsActions } from './ws.actions';

import { PoisProvider } from '../../providers';

@Injectable()
export class WsEpics
{
    constructor(private pois: PoisProvider) { }

    createRetrievePoisEpic(): Epic<any, any, AppState>
    {
        console.log("Registering epic createRetrievePoisEpic on ws/RETRIEVE_POIS");

        return (action$, state$) => action$.pipe(ofType(WsActions.RETRIEVE_POIS),
            mergeMap(action => concat(
                of(({ type: WsActions.RETRIEVE_POIS_LOADING })),
                this.pois.getPoisList(action.payload.latitude, action.payload.longitude, action.payload.radius).pipe(
                    mergeMap(data => of(({ type: WsActions.RETRIEVE_POIS_SUCCESS, payload: data }))),
                    catchError(_ => of(({ type: WsActions.RETRIEVE_POIS_ERROR }))),
                )
            ))
        );
    }
}

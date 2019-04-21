import { Injectable } from "@angular/core";

import { dispatch, NgRedux } from "@angular-redux/store";
import { Action } from "redux";
import { AppState } from '../store.model';

import { environment } from '../../environments/environment';
import { constants } from '../../util/constants';

export interface PoiApiAction extends Action {
    payload?: any;
    meta?: {
        offline?: {
            effect?: any;
            commit?: any;
            rollback?: any;
        }
    };
}

@Injectable()
export class PoiApiActions
{
    static readonly LATITUDE_URL_KEY = "lat";
    static readonly LONGITUDE_URL_KEY = "lon";
    static readonly RADIUS_URL_KEY = "rad";

    static readonly RETRIEVE_POI = 'RETRIEVE_POI';
    static readonly RETRIEVE_POI_COMPLETED = 'RETRIEVE_POI_COMPLETED';
    static readonly RETRIEVE_POI_ERROR = 'RETRIEVE_POI_ERROR';

    isAlive: boolean = true;

    constructor(private ngRedux: NgRedux<AppState>) { }

    @dispatch()
    retrievePoi = (url): PoiApiAction => ({
        type: PoiApiActions.RETRIEVE_POI,
        meta: {
            offline: {
                effect: { url: url, method: 'GET' },
                commit: { type: PoiApiActions.RETRIEVE_POI_COMPLETED },
                rollback: { type: PoiApiActions.RETRIEVE_POI_ERROR },
            }
        }
    });
    
    getCurrentPoiList = (latitude: number, longitude: number, radius: number) => {
        this.retrievePoi(
            environment.mock? 
                '../../assets/mock-data/poi-list.json' : 
                environment.baseUrl + environment.apiVersion + constants.poiListEndpoint + "?" + PoiApiActions.LATITUDE_URL_KEY + "=" + latitude + "&" +
                PoiApiActions.LONGITUDE_URL_KEY + "=" + longitude + "&" + PoiApiActions.RADIUS_URL_KEY + "=" + radius
        );
    };

    ngOnDestroy(): void {
        this.isAlive = false;
    }
}

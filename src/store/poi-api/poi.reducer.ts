import { PoiApiState, INITIAL_STATE_POI } from './poi.model';
import { PoiApiActions, PoiApiAction } from './poi.actions';

export function poiReducer(state: PoiApiState = INITIAL_STATE_POI, action: PoiApiAction): PoiApiState
{
    switch (action.type) {
        case PoiApiActions.RETRIEVE_POI: {
            return {
                ...state,
                poiLoading: true,
                poiError: false,
                poi: null
            };
        }
        case PoiApiActions.RETRIEVE_POI_COMPLETED: {
            return {
                ...state,
                poi: (action as PoiApiAction).payload,
                poiLoading: false,
                poiError: false
            };
        }
        case PoiApiActions.RETRIEVE_POI_ERROR: {
            return {
                ...state,
                poiError: true,
                poiLoading: false,
                poi: null
            };
        }
    }

    return state;
}

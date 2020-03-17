import { StorageState, INITIAL_STATE_STORAGE } from './storage.model';
import { StorageActions, StorageAction } from './storage.actions';

import { Poi } from '../../entities/form/poi';

export function storageReducer(state: StorageState = INITIAL_STATE_STORAGE, action: StorageAction): StorageState
{
    switch (action.type)
    {
        case StorageActions.ADD_POI:
            return {
                ...state,
                pois: [...state.pois, action.payload]
            };
        case StorageActions.REMOVE_POI:
            let currentPois = state.pois;

            for (let i = 0; i < currentPois.length; ++i)
                if (currentPois[i].latitude == action.payload.lat && currentPois[i].longitude == action.payload.lng)
                {
                    console.log("action.payload.lat, action.payload.lng: ", {lat: action.payload.lat, lng: action.payload.lng});
                    currentPois.splice(i, 1);
                }

            return {
                ...state,
                pois: currentPois
            };
        case StorageActions.RESET_POIS:
            return {
                ...state,
                pois: INITIAL_STATE_STORAGE.pois
            };
    }

    return state;
}

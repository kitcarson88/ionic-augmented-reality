import { StorageState, INITIAL_STATE_STORAGE } from './storage.model';
import { StorageActions, StorageAction } from './storage.actions';

export function storageReducer(state: StorageState = INITIAL_STATE_STORAGE, action: StorageAction): StorageState
{
    switch (action.type)
    {
        case StorageActions.ADD_POI:
            return {
                ...state,
                pois: [...state.pois, action.payload]
            };
        case StorageActions.RESET_POIS:
            return {
                ...state,
                pois: INITIAL_STATE_STORAGE.pois
            };
    }

    return state;
}

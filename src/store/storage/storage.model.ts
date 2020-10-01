import { Poi } from '../../entities/form/poi';

export interface StorageState
{
    pois: Poi[]
}

export const INITIAL_STATE_STORAGE: StorageState = {
    pois: []
};

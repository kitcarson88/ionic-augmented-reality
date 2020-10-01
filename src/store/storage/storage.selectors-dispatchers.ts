import { Injectable } from '@angular/core';

import { dispatch } from '@redux-multipurpose/core';

import {
    addPoi as addPoiAction,
    removePoi as removePoiAction,
    resetPois as resetPoisAction,
} from './storage.slice';

@Injectable()
export class StorageActions
{
    @dispatch()
    addPoi = () => {
        return addPoiAction();
    };
    
    @dispatch()
    removePoi = () => {
        return removePoiAction();
    };
    
    @dispatch()
    resetPois = () => {
        return resetPoisAction();
    };
    
}
import { Injectable } from '@angular/core';

import { dispatch } from '@redux-multipurpose/core';

import {
    show as showAction,
    hide as hideAction,
} from './spinner.slice';

@Injectable()
export class SpinnerActions
{
    @dispatch()
    show = () => {
        return showAction();
    };
    
    @dispatch()
    hide = () => {
        return hideAction();
    };
    
}
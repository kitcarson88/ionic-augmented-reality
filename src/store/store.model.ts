import { Action } from 'redux';

// import every model

export interface AppState
{

}

export const INITIAL_STATE: AppState = {

};

export interface PayloadAction extends Action
{
    payload?: any;
}
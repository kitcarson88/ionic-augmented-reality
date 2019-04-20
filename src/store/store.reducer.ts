//import { routerReducer } from "@angular-redux/router";
//import { composeReducers, defaultFormReducer } from "@angular-redux/form";

import { combineReducers } from "redux";

import { AppState, INITIAL_STATE } from "./store.model";

export default function reduceReducers(...reducers)
{
  return (previous, current) => reducers.reduce((p, r) => r(p, current), previous);
}

export const rootReducer = reduceReducers(
  /*combineReducers({
  }),*/
  mainReducer
);

export function mainReducer(state: AppState = INITIAL_STATE, action: any): any
{
  return state;
}

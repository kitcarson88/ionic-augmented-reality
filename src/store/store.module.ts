import { NgModule, Optional, SkipSelf } from "@angular/core";
import { Router } from '@angular/router';

import { initializeStore } from '@redux-multipurpose/core';
import { configureRouterReducer } from '@redux-multipurpose/angular-router';
import storage from 'redux-persist/lib/storage';

import
{
  AppPlatformDeviceActions,
	SpinnerActions,
	GpsActions,
	StorageActions
} from './index';

import rootReducer from './store.reducer';
import rootEpic from './epics';
import rootSaga from './sagas';

const ACTIONS = [
  AppPlatformDeviceActions,
	SpinnerActions,
	GpsActions,
	StorageActions
];

const RESOLVERS = [
];

@NgModule({
  imports: [],
  providers: [...ACTIONS, ...RESOLVERS]
})
export class StoreModule
{
  constructor(
    @Optional() @SkipSelf() parentModule: StoreModule,
    private router: Router
  )
  {
    if (parentModule)
      throw new Error("StoreModule is already loaded. Import it in the AppModule only");

    const middlewares = [  ];

    initializeStore({
      reducers: rootReducer(storage),
      devTools: true,
      middlewares,
      epics: rootEpic(),
      sagas: rootSaga,
      enablePersistence: true,
      enableResponsiveness: {
        breakpoints: {
          extraSmall: 320,
          small: 480,
          medium: 768,
          large: 1280,
          extraLarge: 1920,
          infinity: "infinity"
        }
      },
      router: configureRouterReducer('router', this.router),
      logLevel: 'log'
    });
  }
}
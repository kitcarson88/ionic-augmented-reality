import { CommonModule } from "@angular/common";
import { NgModule, Optional, SkipSelf } from "@angular/core";

import { NgReduxModule, NgRedux, DevToolsExtension } from "@angular-redux/store";
import { NgReduxRouter, NgReduxRouterModule } from '@angular-redux/router';
import { createLogger } from "redux-logger";
import { persistStore } from 'redux-persist';
import { FluxStandardAction } from 'flux-standard-action';
import { createEpicMiddleware } from 'redux-observable-es6-compat';
import createSagaMiddleware from 'redux-saga';

import { rootReducer } from "./store.reducer";
import { AppState, INITIAL_STATE } from "./store.model";

import
{
  SpinnerActions,
  SplashActions,
  PlatformDeviceActions,
  GpsActions,
  AccelerometerActions,
  GyroscopeActions,
  MagnetometerActions,
  ARActions,
  WsActions,
  StorageActions
} from "./index";

import { RootEpics } from './epics';
import rootSaga from './sagas';

import { SplashEpics } from './splash/splash.epics';
import { WsEpics } from './ws/ws.epics';

import { StorageService } from "../services/storage.service";

import { Converter } from "../utils/converter";

const ACTIONS = [
  SpinnerActions,
  SplashActions,
  PlatformDeviceActions,
  GpsActions,
  AccelerometerActions,
  GyroscopeActions,
  MagnetometerActions,
  ARActions,
  WsActions,
  StorageActions
];

const RESOLVERS = [
  RootEpics,
  SplashEpics,
  WsEpics
];

@NgModule({
  imports: [CommonModule, NgReduxModule, NgReduxRouterModule.forRoot()],
  providers: [...ACTIONS, ...RESOLVERS]
})
export class StoreModule
{
  constructor(
    @Optional()
    @SkipSelf()
    parentModule: StoreModule,
    public ngRedux: NgRedux<AppState>,
    devTools: DevToolsExtension,
    storageService: StorageService,
    rootEpics: RootEpics,
    ngReduxRouter: NgReduxRouter,
  )
  {
    if (parentModule)
    {
      throw new Error(
        "StoreModule is already loaded. Import it in the AppModule only"
      );
    }

    //MIDDLEWARES
    const dataNormalizer = () => store => next => action =>
    {
      if (action.payload)
      {
        switch (action.type)
        {
          case GpsActions.SET_COORDINATES:
            action.payload = Converter.gpsInfoDTOToGpsCoordinatesDTO(action.payload);
            break;
          case WsActions.RETRIEVE_POIS_SUCCESS:
            action.payload = Converter.poiDTOArrayToPoiArray(action.payload);
            break;
        }
      }

      return next(action);
    };

    const epicMiddleware = createEpicMiddleware<FluxStandardAction<any, any>, FluxStandardAction<any, any>, AppState>();

    const sagaMiddleware = createSagaMiddleware();

    const logger = createLogger({ level: 'log' });

    const middlewares = [dataNormalizer(), epicMiddleware, sagaMiddleware, logger];

    //ENHANCERS
    const enhancers = devTools.isEnabled() ? [devTools.enhancer()] : [];

    ngRedux.configureStore(
      rootReducer(storageService),
      INITIAL_STATE,
      middlewares,
      enhancers as any
    );

    // Enable syncing of Angular router state with our Redux store.
    if (ngReduxRouter)
      ngReduxRouter.initialize();

    persistStore(ngRedux);

    //Executing epics
    epicMiddleware.run(rootEpics.createEpics());

    //Executing sagas
    sagaMiddleware.run(rootSaga);
  }
}
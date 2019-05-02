import { CommonModule } from "@angular/common";
import { NgModule, Optional, SkipSelf } from "@angular/core";

import { delay, timeout } from 'rxjs/operators';

import { NgReduxModule, NgRedux, DevToolsExtension, dispatch } from "@angular-redux/store";
import { TranslateService } from "@ngx-translate/core";
import { createLogger } from "redux-logger";
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { createOffline } from '@redux-offline/redux-offline';
import offlineConfig from '@redux-offline/redux-offline/lib/defaults/index';
import createSagaMiddleware from 'redux-saga';

import { environment } from '../environments/environment';

import { rootReducer } from "./store.reducer";
import { AppState, INITIAL_STATE } from "./store.model";
import {
  SpinnerActions,
  GpsActions,
  AccelerometerActions,
  GyroscopeActions,
  MagnetometerActions,
  PoiApiActions,
  ARActions
} from "./index";

import rootSaga from './sagas';

import { Api } from "../providers/api/api";

//import { NetworkService } from "../services/network.service";
import { StorageService } from "../services/storage.service";
/*import { ToastService } from "../services/toast.service";
import { ErrorManagerService } from "../services/error.service";*/

import { Converter } from "../util/converter";
import { ToastService } from 'src/services/toast.service';
import { constants } from "../util/constants";

const ACTIONS = [
  SpinnerActions,
  GpsActions,
  AccelerometerActions,
  GyroscopeActions,
  MagnetometerActions,
  PoiApiActions,
  ARActions
];

const RESOLVERS = [  ];

@NgModule({
  imports: [CommonModule, NgReduxModule ],
  providers: [...ACTIONS, ...RESOLVERS ]
})
export class StoreModule
{
  constructor(
    @Optional()
    @SkipSelf()
    parentModule: StoreModule,
    public ngRedux: NgRedux<AppState>,
    devTools: DevToolsExtension,
    api: Api,
    //networkService: NetworkService,
    storageService: StorageService,
    toastService: ToastService,
    translateService: TranslateService,
    //errorService: ErrorManagerService
  ) {
    if (parentModule) {
      throw new Error(
        "StoreModule is already loaded. Import it in the AppModule only"
      );
    }
    const persistConfig = {
      key: 'root',
      storage: storageService,
      //storage,
      blacklist: [ 'spinner', 'gps', 'accelerometer', 'gyroscope', 'magnetometer', 'poi', 'ar' ]
    }
    //const persistedReducer = persistReducer(persistConfig, rootReducer);

    const {
      middleware: offlineMiddleware,
      enhanceReducer: offlineEnhanceReducer,
      enhanceStore: offlineEnhanceStore
    } = createOffline({
      ...offlineConfig,
      persist: false,
      effect: (effect, action) => {
        console.log('Executing effect for ' + action.type, effect);
        
        switch (effect.method)
        {
          case 'GET':
            if (environment.mock)   //DEBUG
            {
              return api.debugGet(effect.url).pipe(delay(3000), timeout(5000)).toPromise().then(response => {
                console.log("Received data for action " + action.type + ": ", response);
                return JSON.parse(response['_body']);
              }).catch(error => {
                console.log("ERROR: ", error);
                //errorService.manageError(error['name']);
                throw(error);
              });;
            }
            else
            {
              let header = {
                'Content-type': 'application/json',
              };

              return api.get(
                effect.url,
                effect.parameters != null && effect.parameters != undefined? effect.parameters : {},
                header
              ).then(response => {
                console.log("Received data for action " + action.type + ": ", response);
                return JSON.parse(response.data);
              }).catch(error => {
                //errorService.manageError(error['error']);
                throw(error);
              });
            }
          case 'POST':
            if (environment.mock)   //DEBUG
            {
              return api.debugGet(effect.url).pipe(delay(3000), timeout(5000)).toPromise().then(response => {
                console.log("Received data for action " + action.type + ": ", response);
                return JSON.parse(response['_body']);
              }).catch(error => {
                console.log("ERROR: ", error);
                //errorService.manageError(error['name']);
                throw(error);
              });
            }
            else
            {
              /*let header = {
                'Content-type': 'application/json',
              };*/

              return api.post(
                effect.url,
                effect.json['body']
                //header
              ).then(response => {
                console.log("Received data for action " + action.type + ": ", response);
                return JSON.parse(response.data);
              }).catch(error => {
                //errorService.manageError(error['error']);
                throw(error);
              });
            }
        }
      },
      //NOT WORKING; OVEWRITE DIRECTLY CALLING ACTION IN NetworkService
      /*detectNetwork: callback => networkService.connected.subscribe(data => {
        callback(data);
      }),*/
      // @overwrite discard
      discard: /*async*/ (error, action, retries) => {
        console.log("Executing discard: ", error);
        if (!(error.status)) return false;

        if (error.status === 401) {
          /*const newAccessToken = await refreshAccessToken();
          localStorage.set('accessToken', newAccessToken);
          return newAccessToken == null;*/
        }

        return 400 <= error.status && error.status < 500;
      },
      // @overwrite retry
      retry: (action, retries) => {
        console.log("Executing retry: ", retries);
        if (retries < 2)
          return 5000;
        //else if (retries < 5)
          //return 10000;
        return null;
      }
    });

    const persistedReducer = persistReducer(persistConfig, offlineEnhanceReducer(rootReducer));

    //MIDDLEWARES
    const offlineTimeout = () => store => next => action => {
      let state = this.ngRedux.getState();

      if (!(state['offline']['online']))
        switch (action.type)
        {
          case PoiApiActions.RETRIEVE_POI:
            setTimeout(() => {
              if (!(state['offline']['online']) && !(state.poi.poi))
              {
                this.ngRedux.dispatch({ type: PoiApiActions.RETRIEVE_POI_ERROR });

                translateService.get('CONNECTION_ERROR_ON_RETRIEVE').subscribe((message: string) => {
                  toastService.showErrorToast({text: message});
                });
              }
            }, constants.CONNECTION_TIMEOUT);
            break;
        }

      return next(action);
    };
    
    const dataNormalizer = () => store => next => action => {
      if (action.payload)
      {
        //let state = store.getState();

        switch (action.type)
        {
          case GpsActions.SET_COORDINATES:
            action.payload = Converter.gpsInfoDTOToGpsCoordinatesDTO(action.payload);
            break;
          case PoiApiActions.RETRIEVE_POI_COMPLETED:
            action.payload = Converter.poiDTOArrayToPoiArray(action.payload);
            break;
        }
      }

      return next(action);
    };

    const sagaMiddleware = createSagaMiddleware()

    let logger = createLogger({ level: 'log' });

    const middlewares = [ offlineMiddleware, offlineTimeout(), dataNormalizer(), sagaMiddleware, logger ];

    //ENHANCERS
    const enhancers = devTools.isEnabled() ? [devTools.enhancer(), offlineEnhanceStore] : [offlineEnhanceStore];

    ngRedux.configureStore(
      persistedReducer,
      INITIAL_STATE,
      middlewares,
      enhancers
    );

    persistStore(ngRedux);

    //Executing sagas
    sagaMiddleware.run(rootSaga);
  }
}
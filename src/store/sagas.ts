import { select, call, put, takeEvery, takeLatest, take, all } from 'redux-saga/effects';

import { PoiApiActions } from './poi-api/poi.actions';

import { GpsCoordinatesDTO } from '../entities/dto/gpsInfoDTO';

import { environment } from '../environments/environment';

import { AugmentedRealityUtils } from '../util/utils';
import { constants } from '../util/constants';

const getGpsCoordinates = state => state.gps.coordinates;
const getFilteredGpsCoordinates = state => state.gps.distanceFilteredCoordinates;

function* filterGpsCoordinate()
{
    console.log("Registering saga filterGpsCoordinate on gps/SET_COORDINATES");

    yield takeEvery("SET_COORDINATES", function*() {
        const currentGpsCoordinates: GpsCoordinatesDTO = yield select(getGpsCoordinates);
        const filteredGpsCoordinates: GpsCoordinatesDTO = yield select(getFilteredGpsCoordinates);

        if (currentGpsCoordinates)
        {
            if (filteredGpsCoordinates)
            {
                let distance: number = AugmentedRealityUtils.calculateDistance(filteredGpsCoordinates.latitude, filteredGpsCoordinates.longitude, currentGpsCoordinates.latitude, currentGpsCoordinates.longitude);
      
                distance /= 1000; //distance in meters
      
                if (distance <= constants.GPS_MIN_DISTANCE_FILTER)  //Continue to retreive new pois, only if the distance delta is at least constants.GPS_MIN_DISTANCE_FILTER meters
                  return;
            }

            let action = {
                type: 'SET_FILTERED_COORDINATES',
                payload: currentGpsCoordinates
            };
            yield put(action);
        }
    });
}

function* retrievePois()
{
    console.log("Registering saga retrievePois on gps/SET_FILTERED_COORDINATES");

    yield takeEvery("SET_COORDINATES", function*() {
        const filteredGpsCoordinates: GpsCoordinatesDTO = yield select(getFilteredGpsCoordinates);

        //Create redux-offline action to launch (provider action in poi.actions.ts)
        let url = environment.mock? 
            '../../assets/mock-data/poi-list.json' : 
            environment.baseUrl + environment.apiVersion + constants.poiListEndpoint + "?" +
                PoiApiActions.LATITUDE_URL_KEY + "=" + filteredGpsCoordinates.latitude + "&" +
                PoiApiActions.LONGITUDE_URL_KEY + "=" + filteredGpsCoordinates.longitude + "&" + 
                PoiApiActions.RADIUS_URL_KEY + "=" + constants.RADAR_POI_RADIUS

        let poiRequestAction = {
            type: PoiApiActions.RETRIEVE_POI,
            meta: {
                offline: {
                    effect: { url: url, method: 'GET' },
                    commit: { type: PoiApiActions.RETRIEVE_POI_COMPLETED },
                    rollback: { type: PoiApiActions.RETRIEVE_POI_ERROR },
                }
            }
        };

        yield put(poiRequestAction);
    });
}

export default function* rootSaga() {
    yield all([
        filterGpsCoordinate(),
        retrievePois()
    ])
}
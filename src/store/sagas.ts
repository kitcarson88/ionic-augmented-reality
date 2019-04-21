import { select, call, put, takeEvery, takeLatest, take, all } from 'redux-saga/effects';

import { GpsCoordinatesDTO } from '../entities/dto/GpsInfoDTO';

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

export default function* rootSaga() {
    yield all([
        filterGpsCoordinate()
    ])
}
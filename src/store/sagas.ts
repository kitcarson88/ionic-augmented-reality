import { select, call, put, takeEvery, takeLatest, take, all } from 'redux-saga/effects';

import { AugmentedRealityUtils } from '../utils/utils';
import { constants } from '../utils/constants';

import { GpsCoordinatesDTO } from '../entities/dto/gpsInfoDTO';
import { Poi } from '../entities/form/poi';
import { FusionSensorsDTO } from '../entities/dto/fusionSensorsDTO';

const getGpsCoordinates = state => state.gps.coordinates;
const getFilteredGpsCoordinates = state => state.gps.distanceFilteredCoordinates;
const getPois = state => state.ws.pois.data;
const getMapPois = state => state.storage.pois;
const getPinArray = state => state.ar.pinArray;
const getFusionOrientation = state => state.ar.fusionCoordinates;
const getFov = state => state.ar.cameraFov;

function* filterGpsCoordinate()
{
    console.log("Registering saga filterGpsCoordinate on gps/SET_COORDINATES");

    yield takeEvery("SET_COORDINATES", function* ()
    {
        const currentGpsCoordinates: GpsCoordinatesDTO = yield select(getGpsCoordinates);
        const filteredGpsCoordinates: GpsCoordinatesDTO = yield select(getFilteredGpsCoordinates);

        if (currentGpsCoordinates)
        {
            if (filteredGpsCoordinates)
            {
                let distance: number = AugmentedRealityUtils.calculateDistance(filteredGpsCoordinates.latitude, filteredGpsCoordinates.longitude, currentGpsCoordinates.latitude, currentGpsCoordinates.longitude);

                distance *= 1000; //distance in meters

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

    yield takeEvery("SET_FILTERED_COORDINATES", function* ()
    {
        const filteredGpsCoordinates: GpsCoordinatesDTO = yield select(getFilteredGpsCoordinates);

        //Launch ws retrieve pois list epic action
        let poiRequestAction = {
            type: 'RETRIEVE_POIS',
            payload: { latitude: filteredGpsCoordinates.latitude, longitude: filteredGpsCoordinates.longitude, radius: constants.RADAR_POI_RADIUS }
        };

        yield put(poiRequestAction);
    });
}

function* calculatePinArray()
{
    console.log("Registering saga calculatePinArray on poi/RETRIEVE_POIS_SUCCESS");

    yield takeEvery("RETRIEVE_POIS_SUCCESS", function* ()
    {
        let poiList: Poi[] = yield select(getPois);
        const filteredGpsCoordinates: GpsCoordinatesDTO = yield select(getFilteredGpsCoordinates);

        //Retrieve map poi too, and add to service ones
        let mapPoiList: Poi[] = yield select(getMapPois);
        poiList = [...poiList, ...mapPoiList];

        if (poiList && poiList.length > 0)
        {
            //New points of interest arrived. Reset and recalculate pin array
            let pinArray = [];

            for (let poi of poiList)
            {
                let pin = {};

                pin['latitude'] = poi.latitude;
                pin['longitude'] = poi.longitude;
                pin['title'] = poi.title;
                pin['description'] = poi.description;
                pin['icon'] = poi.icon;

                //Update pin with bearing and distance
                //For each poi retrieved (with latitude and longitude), an array of pin is populated.
                //The array is created with pin near the user (maximum RADAR_POI_RADIUS) and every pin
                //has bearing and distance informations
                pin = AugmentedRealityUtils.relativePosition(pin, filteredGpsCoordinates);
                //console.log("Pin after relative position update: ", pin);

                if (!(pin['distance']) || +pin['distance']['meter'] > constants.RADAR_POI_RADIUS)
                    continue;

                pinArray.push(pin);
            }

            yield put({ type: 'SET_PIN_ARRAY', payload: pinArray });
        }
    });
}

function* calculateSpotArray()
{
    console.log("Registering saga calculateSpotArray on ar/SET_FUSION_COORDINATES");

    yield takeEvery("SET_FUSION_COORDINATES", function* ()
    {
        const pinArray: any[] = yield select(getPinArray);
        if (!pinArray)
            return;

        const fov: number = yield select(getFov);
        const fusionOrientation: FusionSensorsDTO = yield select(getFusionOrientation);

        let alfa = fusionOrientation.alfa + 90;

        if (alfa < 0)
            alfa += 360;
        if (alfa > 360)
            alfa -= 360;

        let spotArray = AugmentedRealityUtils.calculateDirection(alfa, fusionOrientation.gamma, pinArray, fov);
        yield put({ type: 'SET_SPOT_ARRAY', payload: spotArray });
    });
}

export default function* rootSaga()
{
    yield all([
        filterGpsCoordinate(),
        retrievePois(),
        calculatePinArray(),
        calculateSpotArray()
    ]);
}
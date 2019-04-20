export class GpsInfoDTO
{
    coords: CoordinatesInfos;
    timestamp: number;
};

export class CoordinatesInfos
{
    latitude: number;
    longitude: number;
    accuracy: number;
    altitude: number;
    altitudeAccuracy: number;
    heading: number;
    speed: number;
};

export class GpsCoordinatesDTO
{
    latitude: number;
    longitude: number;
    altitude: number;
};
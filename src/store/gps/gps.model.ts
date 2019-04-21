export interface GpsState {
    coordinates: any;
    distanceFilteredCoordinates: any;
}

export const INITIAL_STATE_GPS: GpsState = {
    coordinates: null,
    distanceFilteredCoordinates: null
};
export interface PoiApiState {
    poi: any;
    poiLoading: boolean;
    poiError: boolean;
}

export const INITIAL_STATE_POI: PoiApiState = {
    poi: null,
    poiLoading: false,
    poiError: false
};
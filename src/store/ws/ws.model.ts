export interface WsState
{
    pois: { data: any, loading: boolean, error: boolean };
}

export const INITIAL_STATE_WEB_SERVICES: WsState = {
    pois: { data: null, loading: false, error: false }
};
import { WsState, INITIAL_STATE_WEB_SERVICES } from './ws.model'
import { WsActions, WsAction } from './ws.actions';

export function wsReducer(state: WsState = INITIAL_STATE_WEB_SERVICES, action: WsAction): WsState
{
    switch (action.type)
    {
        case WsActions.RETRIEVE_POIS_LOADING:
            return {
                ...state,
                pois: {
                    loading: true,
                    data: null,
                    error: false
                }
            };
        case WsActions.RETRIEVE_POIS_SUCCESS:
            return {
                ...state,
                pois: {
                    data: action.payload,
                    loading: false,
                    error: false
                }
            };
        case WsActions.RETRIEVE_POIS_ERROR:
            return {
                ...state,
                pois: {
                    error: true,
                    loading: false,
                    data: null
                }
            };
    }

    return state;
}

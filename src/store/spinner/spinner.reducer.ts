import { SpinnerActions, SpinnerAction } from './spinner.actions';

export function spinnerReducer(state: boolean = false, action: SpinnerAction): boolean
{
    switch (action.type)
    {
        case SpinnerActions.SHOW_SPINNER:
            return true;
        case SpinnerActions.HIDE_SPINNER:
            return false;
    }

    return state;
}

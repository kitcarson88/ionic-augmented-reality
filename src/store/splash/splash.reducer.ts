import { SplashActions, SplashAction } from './splash.actions';

export function splashReducer(state: string = 'inactive', action: SplashAction): string
{
    switch (action.type)
    {
        case SplashActions.SET_SPLASH_STATE:
            return action.payload;
    }

    return state;
}

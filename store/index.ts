import { configureStore } from '@reduxjs/toolkit';
import newsReducer         from './features/newsSlice';
import matchesReducer      from './features/matchesSlice';
import rankingsReducer     from './features/rankingsSlice';
import countriesReducer    from './features/countriesSlice';
import matchDetailReducer  from './features/matchDetailSlice';
import playerDetailReducer from './features/playerDetailSlice';
import teamDetailReducer   from './features/teamDetailSlice';

const rootReducer = {
  news:         newsReducer,
  matches:      matchesReducer,
  rankings:     rankingsReducer,
  countries:    countriesReducer,
  matchDetail:  matchDetailReducer,
  playerDetail: playerDetailReducer,
  teamDetail:   teamDetailReducer,
};

export type RootState = {
  news:         ReturnType<typeof newsReducer>;
  matches:      ReturnType<typeof matchesReducer>;
  rankings:     ReturnType<typeof rankingsReducer>;
  countries:    ReturnType<typeof countriesReducer>;
  matchDetail:  ReturnType<typeof matchDetailReducer>;
  playerDetail: ReturnType<typeof playerDetailReducer>;
  teamDetail:   ReturnType<typeof teamDetailReducer>;
};

export const makeStore = (preloadedState?: Partial<RootState>) =>
  configureStore({
    reducer: rootReducer,
    ...(preloadedState ? { preloadedState: preloadedState as RootState } : {}),
  });

export type AppStore    = ReturnType<typeof makeStore>;
export type AppDispatch = AppStore['dispatch'];

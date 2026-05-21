import { configureStore } from '@reduxjs/toolkit';
import newsReducer     from './features/newsSlice';
import matchesReducer  from './features/matchesSlice';
import rankingsReducer from './features/rankingsSlice';
import countriesReducer from './features/countriesSlice';

export const makeStore = () =>
  configureStore({
    reducer: {
      news:      newsReducer,
      matches:   matchesReducer,
      rankings:  rankingsReducer,
      countries: countriesReducer,
    },
  });

export type AppStore    = ReturnType<typeof makeStore>;
export type RootState   = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];

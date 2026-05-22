import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchMatchesApi, type FetchMatchesParams } from '@/lib/api/matches';
import type { LiveMatch, AsyncStatus } from '@/types';

interface MatchesState {
  matches: LiveMatch[];
  tab:     FetchMatchesParams['tab'];
  status:  AsyncStatus;
  error:   string | null;
}

const initialState: MatchesState = { matches: [], tab: 'all', status: 'idle', error: null };

export const fetchMatches = createAsyncThunk(
  'matches/fetchAll',
  (params?: FetchMatchesParams) => fetchMatchesApi(params ?? {}),
);

const matchesSlice = createSlice({
  name: 'matches', initialState, reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchMatches.pending, (s, a) => {
      s.status = 'loading';
      if (a.meta.arg?.tab) s.tab = a.meta.arg.tab;
    });
    b.addCase(fetchMatches.fulfilled, (s, a) => { s.status = 'succeeded'; s.matches = a.payload; });
    b.addCase(fetchMatches.rejected,  (s, a) => { s.status = 'failed'; s.error = a.error.message ?? null; });
  },
});

export default matchesSlice.reducer;

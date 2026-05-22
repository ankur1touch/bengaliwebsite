import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchRankingsApi, type FetchRankingsParams } from '@/lib/api/rankings';
import type { StandingRow, TopScorer, AsyncStatus } from '@/types';

interface RankingsState {
  standings:  StandingRow[];
  topScorers: TopScorer[];
  status:     AsyncStatus;
  error:      string | null;
}

const initialState: RankingsState = { standings: [], topScorers: [], status: 'idle', error: null };

export const fetchRankings = createAsyncThunk(
  'rankings/fetchAll',
  (params?: FetchRankingsParams) => fetchRankingsApi(params ?? {}),
);

const rankingsSlice = createSlice({
  name: 'rankings', initialState, reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchRankings.pending,   (s) => { s.status = 'loading'; });
    b.addCase(fetchRankings.fulfilled, (s, a) => {
      s.status = 'succeeded';
      s.standings  = a.payload.standings;
      s.topScorers = a.payload.topScorers;
    });
    b.addCase(fetchRankings.rejected, (s, a) => { s.status = 'failed'; s.error = a.error.message ?? null; });
  },
});

export default rankingsSlice.reducer;

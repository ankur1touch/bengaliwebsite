import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchMatchesApi } from '@/lib/api/matches';
import type { LiveMatch, AsyncStatus } from '@/types';

interface MatchesState { matches: LiveMatch[]; status: AsyncStatus; error: string | null; }

const initialState: MatchesState = { matches: [], status: 'idle', error: null };

export const fetchMatches = createAsyncThunk('matches/fetchAll', fetchMatchesApi);

const matchesSlice = createSlice({
  name: 'matches', initialState, reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchMatches.pending,   (s) => { s.status = 'loading'; });
    b.addCase(fetchMatches.fulfilled, (s, a) => { s.status = 'succeeded'; s.matches = a.payload; });
    b.addCase(fetchMatches.rejected,  (s, a) => { s.status = 'failed'; s.error = a.error.message ?? null; });
  },
});

export default matchesSlice.reducer;

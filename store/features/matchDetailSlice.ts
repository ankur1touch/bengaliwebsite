import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchMatchDetailApi } from '@/lib/api/matchDetail';
import type { MatchDetailPayload, AsyncStatus } from '@/types';

interface MatchDetailState {
  detail: MatchDetailPayload | null;
  status: AsyncStatus;
  error:  string | null;
}

const initialState: MatchDetailState = { detail: null, status: 'idle', error: null };

export const fetchMatchDetail = createAsyncThunk(
  'matchDetail/fetch',
  (arg: string | { id: string; silent?: boolean }) => {
    const id = typeof arg === 'string' ? arg : arg.id;
    return fetchMatchDetailApi(id);
  },
);

const matchDetailSlice = createSlice({
  name: 'matchDetail', initialState, reducers: {
    clearMatchDetail: (s) => { s.detail = null; s.status = 'idle'; s.error = null; },
  },
  extraReducers: (b) => {
    b.addCase(fetchMatchDetail.pending, (s, a) => {
      const silent = typeof a.meta.arg === 'object' && a.meta.arg.silent;
      if (!silent && !s.detail) s.status = 'loading';
      s.error = null;
    });
    b.addCase(fetchMatchDetail.fulfilled, (s, a) => { s.status = 'succeeded'; s.detail = a.payload; });
    b.addCase(fetchMatchDetail.rejected,  (s, a) => {
      const silent = typeof a.meta.arg === 'object' && a.meta.arg.silent;
      if (!silent) s.status = 'failed';
      s.error = a.error.message ?? null;
    });
  },
});

export const { clearMatchDetail } = matchDetailSlice.actions;
export default matchDetailSlice.reducer;

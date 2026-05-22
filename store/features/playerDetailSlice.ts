import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchPlayerDetailApi } from '@/lib/api/playerDetail';
import type { PlayerDetailPayload, AsyncStatus } from '@/types';

interface PlayerDetailState {
  detail: PlayerDetailPayload | null;
  status: AsyncStatus;
  error:  string | null;
}

const initialState: PlayerDetailState = { detail: null, status: 'idle', error: null };

export const fetchPlayerDetail = createAsyncThunk(
  'playerDetail/fetch',
  (id: string) => fetchPlayerDetailApi(id),
);

const playerDetailSlice = createSlice({
  name: 'playerDetail', initialState, reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchPlayerDetail.pending,   (s) => { s.status = 'loading'; s.error = null; });
    b.addCase(fetchPlayerDetail.fulfilled, (s, a) => { s.status = 'succeeded'; s.detail = a.payload; });
    b.addCase(fetchPlayerDetail.rejected,  (s, a) => { s.status = 'failed'; s.error = a.error.message ?? null; });
  },
});

export default playerDetailSlice.reducer;

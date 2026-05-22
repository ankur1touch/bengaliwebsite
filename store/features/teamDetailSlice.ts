import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchTeamDetailApi } from '@/lib/api/teamDetail';
import type { TeamDetailPayload, AsyncStatus } from '@/types';

interface TeamDetailState {
  detail: TeamDetailPayload | null;
  status: AsyncStatus;
  error:  string | null;
}

const initialState: TeamDetailState = { detail: null, status: 'idle', error: null };

export const fetchTeamDetail = createAsyncThunk(
  'teamDetail/fetch',
  (id: string) => fetchTeamDetailApi(id),
);

const teamDetailSlice = createSlice({
  name: 'teamDetail', initialState, reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchTeamDetail.pending,   (s) => { s.status = 'loading'; s.error = null; });
    b.addCase(fetchTeamDetail.fulfilled, (s, a) => { s.status = 'succeeded'; s.detail = a.payload; });
    b.addCase(fetchTeamDetail.rejected,  (s, a) => { s.status = 'failed'; s.error = a.error.message ?? null; });
  },
});

export default teamDetailSlice.reducer;

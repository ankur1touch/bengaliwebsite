import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchNewsApi, fetchNewsByCountryApi } from '@/lib/api/news';
import type { NewsItem, AsyncStatus } from '@/types';

interface NewsState {
  articles:     NewsItem[];
  byCountry:    Record<string, NewsItem[]>;
  status:        AsyncStatus;
  countryStatus: AsyncStatus;
  error:         string | null;
}

const initialState: NewsState = {
  articles: [], byCountry: {}, status: 'idle', countryStatus: 'idle', error: null,
};

export const fetchNews = createAsyncThunk('news/fetchAll', () => fetchNewsApi());
export const fetchNewsByCategory = createAsyncThunk(
  'news/fetchByCategory',
  (category: string) => fetchNewsApi(category),
);
export const fetchNewsByCountry = createAsyncThunk(
  'news/fetchByCountry',
  (id: string) => fetchNewsByCountryApi(id),
);

const newsSlice = createSlice({
  name: 'news',
  initialState,
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchNews.pending,   (s) => { s.status = 'loading'; s.error = null; });
    b.addCase(fetchNews.fulfilled, (s, a) => { s.status = 'succeeded'; s.articles = a.payload; });
    b.addCase(fetchNews.rejected,  (s, a) => { s.status = 'failed'; s.error = a.error.message ?? null; });

    b.addCase(fetchNewsByCategory.pending,   (s) => { s.status = 'loading'; s.error = null; });
    b.addCase(fetchNewsByCategory.fulfilled, (s, a) => { s.status = 'succeeded'; s.articles = a.payload; });
    b.addCase(fetchNewsByCategory.rejected,  (s, a) => { s.status = 'failed'; s.error = a.error.message ?? null; });

    b.addCase(fetchNewsByCountry.pending,   (s) => { s.countryStatus = 'loading'; });
    b.addCase(fetchNewsByCountry.fulfilled, (s, a) => {
      s.countryStatus = 'succeeded';
      s.byCountry[a.meta.arg] = a.payload;
    });
    b.addCase(fetchNewsByCountry.rejected, (s, a) => {
      s.countryStatus = 'failed'; s.error = a.error.message ?? null;
    });
  },
});

export default newsSlice.reducer;

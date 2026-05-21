import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchCountriesApi } from '@/lib/api/countries';
import type { Country, CountryId, AsyncStatus } from '@/types';

interface CountriesState { countries: Country[]; selected: CountryId | null; status: AsyncStatus; error: string | null; }
const initialState: CountriesState = { countries: [], selected: null, status: 'idle', error: null };

export const fetchCountries = createAsyncThunk('countries/fetchAll', fetchCountriesApi);

const countriesSlice = createSlice({
  name: 'countries', initialState,
  reducers: {
    selectCountry: (s, a: { payload: CountryId }) => { s.selected = a.payload; },
  },
  extraReducers: (b) => {
    b.addCase(fetchCountries.pending,   (s) => { s.status = 'loading'; });
    b.addCase(fetchCountries.fulfilled, (s, a) => { s.status = 'succeeded'; s.countries = a.payload; });
    b.addCase(fetchCountries.rejected,  (s, a) => { s.status = 'failed'; s.error = a.error.message ?? null; });
  },
});

export const { selectCountry } = countriesSlice.actions;
export default countriesSlice.reducer;

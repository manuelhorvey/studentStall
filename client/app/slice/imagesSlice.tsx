import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface ImagesState {
  items: { [key: string]: string };
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: ImagesState = {
  items: {},
  status: 'idle',
  error: null,
};

export const fetchImages = createAsyncThunk<{ [key: string]: string }, string[]>('images/fetchImages', async (productIds) => {
  const fetchedImages: { [key: string]: string } = {};
  await Promise.all(
    productIds.map(async (id) => {
      const response = await axios.get(`http://localhost:3000/images/${id}`);
      if (response.data.length > 0) {
        fetchedImages[id] = response.data[0].url;
      }
    })
  );
  return fetchedImages;
});

const imagesSlice = createSlice({
  name: 'images',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchImages.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchImages.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchImages.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      });
  },
});

export default imagesSlice.reducer;

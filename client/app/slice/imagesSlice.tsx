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

export const fetchImages = createAsyncThunk<{ [key: string]: string }, string[]>(
  'images/fetchImages',
  async (productIds) => {
    const fetchedImages: { [key: string]: string } = {};
    await Promise.all(
      productIds.map(async (id) => {
        try {
          const response = await axios.get<{ url: string }[]>(`http://localhost:3000/images/${id}`);
          if (response.data.length > 0) {
            fetchedImages[id] = response.data[0].url;
          }
        } catch (error) {
          console.error(`Failed to fetch image for product ID ${id}:`, error);
          // Handle error as needed, e.g., continue without setting the image
        }
      })
    );
    return fetchedImages;
  }
);

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
        state.items = { ...state.items, ...action.payload };
      })
      .addCase(fetchImages.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      });
  },
});

export default imagesSlice.reducer;

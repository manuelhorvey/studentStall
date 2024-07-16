import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { Product } from './types';

interface ProductsState {
  items: Product[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: ProductsState = {
  items: [],
  status: 'idle',
  error: null,
};

export const fetchProducts = createAsyncThunk<Product[], string>(
  'products/fetchProducts',
  async (endpoint) => {
    const response = await axios.get<Product[]>(endpoint);
    return response.data;
  }
);

export const deleteProduct = createAsyncThunk<string, { baseUrl: string, productId: string }>(
  'products/deleteProduct',
  async ({ baseUrl, productId }) => {
    await axios.delete(`${baseUrl}/${productId}`);
    return productId;
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.items = state.items.filter((product) => product._id !== action.payload);
      });
  },
});

export default productsSlice.reducer;

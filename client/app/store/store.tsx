import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../slice/authSlice';
import productsReducer from '../slice/productSlice';
import imagesReducer from '../slice/imagesSlice';

const store = configureStore({
  reducer: {
    auth: authReducer, 
    products: productsReducer,
    images: imagesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;

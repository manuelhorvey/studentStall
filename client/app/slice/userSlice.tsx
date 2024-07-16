import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  userId: string;
}

const initialState: UserState = {
  userId: '',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<string>) {
      state.userId = action.payload;
    },
  },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;

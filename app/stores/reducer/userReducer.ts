import { createSlice } from '@reduxjs/toolkit';
import { getUserService } from "@/app/common/services/userService";

const initialState = {
  userData: [] as any,
  isLoading: false
}

export const userSlice = createSlice({
  name: 'fetchUser',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
   // --- Xử lý trong reducer với case pending / fulfilled / rejected ---
    builder
      .addCase(getUserService.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserService.fulfilled, (state, action) => {
        state.isLoading = false;
        console.log(action.payload, 'action payload')
        state.userData = action.payload;
      });
  }
});

export default userSlice.reducer;

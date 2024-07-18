import { createSlice } from '@reduxjs/toolkit';
import { getUserService, getTestHistoryService } from "@/app/common/services/userService";
import { historyApi, userApi } from "@/app/common/interfaces/userInterface";

const initialState = {
  userData: [] as userApi[],
  historyData: [] as historyApi[],
  paginate: {
    total: 0,
    totalPage: 0,
    currentPage: 1,
    pageSize: 10
  },
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
        state.userData = action.payload;
      })
      .addCase(getTestHistoryService.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getTestHistoryService.fulfilled, (state, action) => {
        state.isLoading = false;
        state.historyData = action.payload.data;
        state.paginate = {
          total: action.payload.total,
          totalPage: action.payload.totalPage,
          currentPage: action.payload.currentPage,
          pageSize: action.payload.pageSize
        }
      });
  }
});

export default userSlice.reducer;

import { createSlice } from '@reduxjs/toolkit';
import { getCategoryService, getCategorySelectService } from "@/app/common/services/categoryService";

const initialState = {
  categories: [],
  paginate: {
    total: 0,
    totalPage: 0,
    currentPage: 1,
    pageSize: 10
  },
  categorySelect: [] as any,
  isLoading: false
}

export const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
   // --- Xử lý trong reducer với case pending / fulfilled / rejected ---
    builder
      .addCase(getCategoryService.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCategoryService.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories = state.categories.concat(action.payload.data)
        state.paginate = {
          total: action.payload.total,
          totalPage: action.payload.totalPage,
          currentPage: action.payload.currentPage,
          pageSize: action.payload.pageSize
        }
      })
      .addCase(getCategorySelectService.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCategorySelectService.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categorySelect = action.payload;
      });
  }
});

export default categorySlice.reducer;

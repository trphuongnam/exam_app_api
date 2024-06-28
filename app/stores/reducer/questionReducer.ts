import { getQuestionCategoryService } from "@/app/common/services/questionService";
import { createSlice } from "@reduxjs/toolkit";
import { questionApi } from "@/app/common/interfaces/questionInterface";

type initState = {
  questions: questionApi[],
  isStartTest: boolean,
  loading: boolean
}

const initialState: initState = {
  questions: [],
  isStartTest: false,
  loading: false
}

export const questionSlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    setStartTest(state, action) {
      state = action.payload
    }
  },
  extraReducers: (builder) => {
   // --- Xử lý trong reducer với case pending / fulfilled / rejected ---
    builder
      .addCase(getQuestionCategoryService.pending, (state) => {
        state.loading = true;
      })
      .addCase(getQuestionCategoryService.fulfilled, (state, action) => {
        state.loading = false;
        state.questions = action.payload.data;
      });
  }
});

export const { setStartTest } = questionSlice.actions
export default questionSlice.reducer;

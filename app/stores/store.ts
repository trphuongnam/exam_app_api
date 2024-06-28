import { configureStore } from '@reduxjs/toolkit'
import { combineReducers } from "redux";

import loginReducer from '@/app/stores/reducer/loginReducer'
import categoryReducer from '@/app/stores/reducer/categoriesReducer';
import questionReducer from '@/app/stores/reducer/questionReducer';
import userReducer from '@/app/stores/reducer/userReducer';
import examReducer from '@/app/stores/reducer/examReducer';


const rootReducer = combineReducers({
  login: loginReducer,
  category: categoryReducer,
  question: questionReducer,
  user: userReducer,
  exam: examReducer
});

const store = configureStore({ reducer: rootReducer })

export default store;

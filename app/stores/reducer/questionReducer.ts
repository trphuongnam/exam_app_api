import { SET_QUESTION, SET_START_TEST } from "../constant/questionConst";

const initialState = {
  questions: [],
  isStartTest: false
}

const categoryReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case SET_QUESTION:
      return {...state, questions: action.payload};
    case SET_START_TEST:
      return {...state, isStartTest: action.payload};
    default:
      return state
  }
  
}

export default categoryReducer;

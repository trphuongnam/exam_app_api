import { SET_QUESTION } from "../constant/questionConst";

const initialState = {
  questions: []
}

const categoryReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case SET_QUESTION:
      return {...state, questions: action.payload};
    default:
      return state
  }
  
}

export default categoryReducer;

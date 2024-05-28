import { SET_CATEGORY } from "../constant/categoryConst";

const initialState = {
  categories: []
}

const categoryReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case SET_CATEGORY:
      return {...state, categories: action.payload};
    default:
      return state
  }
  
}

export default categoryReducer;

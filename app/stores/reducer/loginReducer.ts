import { SET_LOGIN } from "../constant/loginConst";

const initialState = {
  isLogin: false
}

const loginReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case SET_LOGIN:
      return {...state, isLogin: action.payload};
    default:
      return state
  }
  
}

export default loginReducer;

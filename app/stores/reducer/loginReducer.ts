import { SET_LOGIN, FETCH_USER, SET_TOKEN } from "../constant/loginConst";
// import { getUserData } from "@/app/common/services/userService";

const initialState = {
  isLogin: false,
  token: '',
}

const loginReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case SET_LOGIN:
      return {...state, isLogin: action.payload};
    case SET_TOKEN:
      return {...state, token: action.payload};
    default:
      return state;
  }
}


export default loginReducer;

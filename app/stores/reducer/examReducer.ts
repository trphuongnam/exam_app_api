import { FINISH_TEST } from "../constant/examConst";
// import { getUserData } from "@/app/common/services/userService";

type initState = {
  score: number,
}

const initialState: initState = {
  score: 0,
}

const examReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case FINISH_TEST:
      return {...state, score: action.payload};
    default:
      return state;
  }
}


export default examReducer;
import { SET_LOGIN } from "@/app/stores/constant/loginConst";

export const loginAction = (isLogin: boolean) => {
  return {type: SET_LOGIN, payload: isLogin};
}
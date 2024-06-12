import { SET_LOGIN, FETCH_USER, SET_TOKEN } from "@/app/stores/constant/loginConst";

export const loginAction = (isLogin: boolean) => {
  return {type: SET_LOGIN, payload: isLogin};
}

export const tokenAction = (token: string) => {
  return {type: SET_TOKEN, payload: token};
}

export const accountAction = (userData: any) => {
  return {type: FETCH_USER, payload: userData};
}

import { axiosRequest } from "@/app/connection";
import { LOGOUT, LOGIN } from "../util/apiUrls";
import { getTokenFromCookie } from '@/app/common/util/functions/getTokenFromCookie'
import { LoginData, loginResult } from "../interfaces/loginInterface";
import { openNotification } from "@/app/common/util/notification";

export const loginService = async (data: LoginData) => {
  let loginResult: loginResult | null = null;
  await axiosRequest.post(LOGIN, data).then(({data}) => {
    loginResult = {
      success: true,
      token: data.data.access_token
    }
    openNotification(data.data.message, '', data.data.status);
  }).catch(() => {
    openNotification('Error', `Can't handle your action. Please try again!!`, 500);
    loginResult = null;
  })

  return loginResult;
}

export const logout = async () => {
  await axiosRequest.post(
    LOGOUT,
    {},
    {}
  ).then(({data}) => {
    return {status: true, data: data};
  }).catch(() => {
    return {status: false, data: ''};
  })
}

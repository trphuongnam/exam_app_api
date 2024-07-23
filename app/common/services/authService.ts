import { axiosRequest } from "@/app/connection";
import { LOGOUT, LOGIN, SIGNUP } from "../util/apiUrls";
import { getTokenFromCookie } from '@/app/common/util/functions/getTokenFromCookie'
import { LoginData, loginResult, SignupData, signupResult } from "@/app/common/interfaces/authInterface";
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

export const signupService = async (data: SignupData) => {
  let signUpResult: signupResult | null = null;
  await axiosRequest.post(SIGNUP, data).then(({data}) => {
    signUpResult = {
      success: true,
    }
    openNotification(data.data.message, '', data.data.status);
  }).catch((err) => {
    if (err.response.status == 422) {
      const {data} = err.response;
      if (data.errors.email) {
        data.errors.email.forEach((err: string) => {
          openNotification('Email Error:', err, 500);
        });
      }

      if (data.errors.name) {
        data.errors.name.forEach((err: string) => {
          openNotification('Name Error:', err, 500);
        });
      }

      if (data.errors.age) {
        data.errors.age.forEach((err: string) => {
          openNotification('Age Error:', err, 500);
        });
      }

      if (data.errors.password) {
        data.errors.password.forEach((err: string) => {
          openNotification('Password Error', err, 500);
        });
      }
    } else {
      openNotification('Error', `Can't handle your action. Please try again!!`, 500);
    }
    signUpResult = null;
  })

  return signUpResult;
}

export const logout = async () => {
  await axiosRequest.post(
    LOGOUT,
    {},
    {
      headers: {
        Authorization: getTokenFromCookie()
      }
    }
  ).then(({data}) => {
    return {status: true, data: data};
  }).catch(() => {
    return {status: false, data: ''};
  })
}

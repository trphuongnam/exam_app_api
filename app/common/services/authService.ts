import { axiosRequest } from "@/app/connection";
import { LOGOUT } from "../util/apiUrls";
import { getTokenFromCookie } from '@/app/common/util/functions/getTokenFromCookie'

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

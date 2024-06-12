import { axiosRequest } from "@/app/connection";
import { ADD_QUESTION } from "@/app/common/util/apiUrls/index";
import { getTokenFromCookie } from "../util/functions/getTokenFromCookie";
import { postData } from "../interfaces/questionInterface";

export const addQuestion = async (postData: postData) => {
  await axiosRequest.post(
    ADD_QUESTION,
    postData,
    {
      headers: {
        Authorization: getTokenFromCookie()
      }
    }
  ).then(({data}) => {
    return data;
  }).catch(() => {
    return {};
  })
}
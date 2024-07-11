import { answerSelect } from "@/app/common/interfaces/questionInterface";
import { axiosRequest } from "@/app/connection";
import { getTokenFromCookie } from "@/app/common/util/functions/getTokenFromCookie";
import { FINISH_TEST } from "@/app/common/util/apiUrls";
import { openNotification } from "@/app/common/util/notification";
import { testFinish } from "@/app/common/interfaces/testInterface";

export const finishTestService = async (answer: answerSelect[], categoryId: number) => {
  let result: testFinish | null = null;
  await axiosRequest.post(
    FINISH_TEST,
    {category: categoryId, data: answer},
    {
      headers: {
        Authorization: getTokenFromCookie()
      }
    }
  ).then(({data}) => {
    openNotification('Finish Test', data.data.message, 200);
    result = data.data;
  }).catch(() => {
    openNotification('Finish Question', 'Failed', 500);
    result = null;
  })

  return result;
}
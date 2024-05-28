import { SET_QUESTION } from '@/app/stores/constant/questionConst'

export const getQuestionAction = (data: any) => {
  return {type: SET_QUESTION, payload: data};
} 

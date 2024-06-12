import { SET_QUESTION, SET_START_TEST } from '@/app/stores/constant/questionConst'

export const getQuestionAction = (data: any) => {
  return {type: SET_QUESTION, payload: data};
}

export const setStartTest = (isStart: boolean) => {
  return {type: SET_START_TEST, payload: isStart};
}

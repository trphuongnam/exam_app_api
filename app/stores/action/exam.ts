import { FINISH_TEST } from "@/app/stores/constant/examConst";

export const examAction = (score: number) => {
  return {type: FINISH_TEST, payload: score};
}
import { SET_CATEGORY } from "../constant/categoryConst";

export const getCategoryAction = (data: any) => {
  return {type: SET_CATEGORY, payload: data};
}

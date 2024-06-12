import { FETCH_CATEGORY } from "../constant/categoryConst";

export const getCategoryAction = (data: any) => {
  return {type: FETCH_CATEGORY, payload: data};
}

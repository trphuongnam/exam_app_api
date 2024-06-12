import { axiosRequest } from "@/app/connection";
import { ADD_CATEGORY, GET_CATEGORY, GET_CATEGORY_SELECT } from "../util/apiUrls";
import { getTokenFromCookie } from '@/app/common/util/functions/getTokenFromCookie'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { FETCH_CATEGORY, FETCH_CATEGORY_SELECT } from '@/app/stores/constant/categoryConst'

type PostData = {
  name: string;
  description?: string;
  start_time?: string;
  end_time?: string;
}

export const getCategoryService = createAsyncThunk(
  FETCH_CATEGORY,
  async () => {
    const response = await axiosRequest.get(
      GET_CATEGORY,
      {
        headers: {
          Authorization: getTokenFromCookie()
        }
      }
    )
    return response.data.data
  },
)

export const getCategorySelectService = createAsyncThunk(
  FETCH_CATEGORY_SELECT,
  async () => {
    const response = await axiosRequest.get(
      GET_CATEGORY_SELECT,
      {
        headers: {
          Authorization: getTokenFromCookie()
        }
      }
    )
    let result: any = [];
    response.data.data.forEach((category: {name: string, id: number}) => {
      let item = {
        value: category.id,
        label: category.name
      }
      result.push(item);
    });
    return result;
  },
)

export const addCategory = async (postData: PostData) => {
  await axiosRequest.post(
    ADD_CATEGORY,
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

import { axiosRequest } from "@/app/connection";
import { ADD_CATEGORY, GET_CATEGORY, GET_CATEGORY_SELECT } from "../util/apiUrls";
import { getTokenFromCookie } from '@/app/common/util/functions/getTokenFromCookie'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { FETCH_CATEGORY, FETCH_CATEGORY_SELECT } from '@/app/stores/constant/categoryConst'
import { openNotification } from "../util/notification";

type PostData = {
  name: string;
  description?: string;
  start_time?: string;
  end_time?: string;
}

type queryParams = {
  page: number,
  numRow: number
}

export const getCategoryService = createAsyncThunk(
  FETCH_CATEGORY,
  async (params: queryParams) => {
    const {page, numRow} = {...params};
    const response = await axiosRequest.get(
      GET_CATEGORY,
      {
        headers: {
          Authorization: getTokenFromCookie()
        },
        params: {
          page: page,
          row: numRow
        }
      }
    )
    return {
      data: response.data.data.data,
      total: response.data.total,
      totalPage: response.data.total_page,
      currentPage: response.data.page_current,
      pageSize: response.data.page_size,
    }
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
    openNotification('Create Category', data.data.message, 200);
  }).catch(() => {
    openNotification('Create Category', 'Create category fail', 500);
  })
}

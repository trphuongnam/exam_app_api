import { axiosRequest } from "@/app/connection";
import { ADD_CATEGORY, GET_CATEGORY, GET_CATEGORY_SELECT } from "../util/apiUrls";
import { getTokenFromCookie } from '@/app/common/util/functions/getTokenFromCookie'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { FETCH_CATEGORY, FETCH_CATEGORY_SELECT } from '@/app/stores/constant/categoryConst'
import { openNotification } from "../util/notification";
import removeTokenCookie from "../hook/removeTokenCookie";
import { categoryResponse } from "../interfaces/categoryInterface";

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
    let result: categoryResponse = {
      data: [],
      total: 0,
      totalPage: 0,
      currentPage: 0,
      pageSize: 0,
    }
    const {page, numRow} = {...params};
    await axiosRequest.get(
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
    ).then(({data}) => {
      result = {
        data: data.data.data,
        total: data.total,
        totalPage: data.total_page,
        currentPage: data.page_current,
        pageSize: data.page_size,
      }
    }).catch(({response}) => {
      if (response.status == '401') {
        removeTokenCookie()
      }
    })
    return result;
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
    {}
  ).then(({data}) => {
    openNotification('Create Category', data.data.message, 200);
  }).catch(() => {
    openNotification('Create Category', 'Create category fail', 500);
  })
}

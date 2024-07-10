import { axiosRequest } from "@/app/connection";
import { GET_USER, GET_TEST_HISTORY } from "../util/apiUrls";
import { getTokenFromCookie } from '@/app/common/util/functions/getTokenFromCookie'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { FETCH_USER, FETCH_TEST_HISTORY } from '@/app/stores/constant/loginConst';
import { historyResponse } from "../interfaces/userInterface";
import RemoveTokenCookieHook from "../hook/removeTokenCookie";

type queryParams = {
  page: number,
  numRow: number
}

export const getUserService = createAsyncThunk(
  FETCH_USER,
  async () => {
    const response = await axiosRequest.get(
      GET_USER,
      {
        headers: {
          Authorization: getTokenFromCookie()
        },
      }
    )
    return response.data.data
  },
)

export const getTestHistoryService = createAsyncThunk(
  FETCH_TEST_HISTORY,
  async (params: queryParams) => {
    let result: historyResponse = {
      data: [],
      total: 0,
      totalPage: 0,
      currentPage: 0,
      pageSize: 0,
    }
    const {page, numRow} = {...params};
    await axiosRequest.get(
      GET_TEST_HISTORY,
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
      console.error(response);
      if (response.status == '401') {
        RemoveTokenCookieHook()
      }
    })
    return result;
  }
)

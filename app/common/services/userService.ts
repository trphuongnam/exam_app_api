import { axiosRequest } from "@/app/connection";
import { GET_USER } from "../util/apiUrls";
import { getTokenFromCookie } from '@/app/common/util/functions/getTokenFromCookie'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { FETCH_USER } from '@/app/stores/constant/loginConst'

export const getUserService = createAsyncThunk(
  FETCH_USER,
  async () => {
    const response = await axiosRequest.get(
      GET_USER,
      {
        headers: {
          Authorization: getTokenFromCookie()
        }
      }
    )
    return response.data.data
  },
)

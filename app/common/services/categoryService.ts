import { axiosRequest } from "@/app/connection";
import {
  ADD_CATEGORY,
  UPDATE_CATEGORY,
  GET_CATEGORY,
  GET_CATEGORY_SELECT,
  GET_CATEGORY_TREE,
  GET_QUESTION_TREE,
  GET_CATEGORY_DETAIL
} from "../util/apiUrls";
import { getTokenFromCookie } from '@/app/common/util/functions/getTokenFromCookie'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { FETCH_CATEGORY, FETCH_CATEGORY_SELECT } from '@/app/stores/constant/categoryConst'
import { openNotification } from "../util/notification";
import RemoveTokenCookieHook from "../hook/removeTokenCookie";
import { categoryApi, categoryResponse, categoryTree, questionTree } from "../interfaces/categoryInterface";

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
        RemoveTokenCookieHook()
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

export const updateCategory = async (postData: PostData, categoryId: number) => {
  await axiosRequest.put(
    UPDATE_CATEGORY.replace(':catId', String(categoryId)),
    postData,
    {}
  ).then(({data}) => {
    openNotification('Update Category', data.data.message, 200);
  }).catch(() => {
    openNotification('Update Category', 'Update category fail', 500);
  })
}

// API Fetch tree category
export const getCategoryTreeService = async () => {
  let result: categoryTree[] = [];
  await axiosRequest.get(
    GET_CATEGORY_TREE,
    {
      headers: {
        Authorization: getTokenFromCookie()
      }
    }
  ).then(({data}) => {
    result = data.data;
  }).catch((err) => {
    result = [];
  })
  return result;
}

// API Fetch tree category
export const getQuestionTreeService = async (categoryId: number) => {
  let result: questionTree[] = [];
  await axiosRequest.get(
    GET_QUESTION_TREE.replace(':catId', String(categoryId)),
    {
      headers: {
        Authorization: getTokenFromCookie()
      }
    }
  ).then(({data}) => {
    result = data.data.data;
  }).catch((err) => {
    result = [];
  })
  return result;
}

export const getDetailCategory = async (categoryId: number) => {
  let result: categoryApi = {
      id: 0,
      name: "",
      description: "",
      start_time: "",
      end_time: "",
      created_at: "",
      updated_at: "",
  };
  await axiosRequest.get(
    GET_CATEGORY_DETAIL.replace(':catId', String(categoryId)),
    {
      headers: {
        Authorization: getTokenFromCookie()
      }
    }
  ).then(({data}) => {
    result = data.data[0];
  }).catch(() => {
    result = {
      id: 0,
      name: "",
      description: "",
      start_time: "",
      end_time: "",
      created_at: "",
      updated_at: "",
    };
  })

  return result;
}

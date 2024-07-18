import { axiosRequest } from "@/app/connection";
import { ADD_QUESTION, UPDATE_QUESTION, IMPORT_QUESTION, GET_QUESTION_CATEGORY, GET_QUESTION_DETAIL } from "@/app/common/util/apiUrls/index";
import { getTokenFromCookie } from "../util/functions/getTokenFromCookie";
import { postData, questionApi } from "../interfaces/questionInterface";
import { openNotification } from "../util/notification";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { GET_QUESTION_BY_CATEGORY } from "@/app/stores/constant/questionConst";

export const addQuestion = async (postData: postData) => {
  await axiosRequest.post(
    ADD_QUESTION,
    postData,
    {
      headers: {
        Authorization: getTokenFromCookie()
      }
    }
  ).then(({data}) => {
    openNotification('Create Question', data.data.message, 200);
  }).catch(() => {
    openNotification('Create Question', 'Create question fail', 500);
  })
}

export const updateQuestion = async (postData: postData, questionId: number) => {
  await axiosRequest.put(
    UPDATE_QUESTION.replace(':questionId', String(questionId)),
    postData,
    {
      headers: {
        Authorization: getTokenFromCookie()
      }
    }
  ).then(({data}) => {
    openNotification('Update Question', data.data.message, 200);
  }).catch(() => {
    openNotification('Update Question', 'Create question fail', 500);
  })
}

export const importQuestion = async (csvFile: FormData) => {
  await axiosRequest.post(
    IMPORT_QUESTION,
    csvFile,
    {
      headers: {
        Authorization: getTokenFromCookie()
      }
    }
  ).then(({data}) => {
    openNotification('Import Question', data.data.message, 200);
  }).catch(() => {
    openNotification('Import Question', 'Import question fail', 500);
  })
}

export const getQuestionCategoryService = createAsyncThunk(
  GET_QUESTION_BY_CATEGORY,
  async (categoryId: string) => {
    const response = await axiosRequest.get(
      GET_QUESTION_CATEGORY.replace(':catId', categoryId),
      {
        headers: {
          Authorization: getTokenFromCookie()
        }
      }
    )
    return {
      data: response.data.data,
    }
  },
)

export const getDetailQuestion = async (questionId: number) => {
  let result: questionApi = {
      "id": 0,
      "name": "",
      "description": "",
      "category_id": 0,
      "multiple": 1,
      "created_at": "",
      "updated_at": "",
      "answer": []
  };
  await axiosRequest.get(
    GET_QUESTION_DETAIL.replace(':questionId', String(questionId)),
    {
      headers: {
        Authorization: getTokenFromCookie()
      }
    }
  ).then(({data}) => {
    result = data.data[0];
  }).catch(() => {
    result = {
        "id": 0,
        "name": "",
        "description": "",
        "category_id": 0,
        "multiple": 1,
        "created_at": "",
        "updated_at": "",
        "answer": []
    };
  })

  return result;
}

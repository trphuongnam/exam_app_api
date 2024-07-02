import axios from "axios";
import {getTokenFromCookie} from "@/app/common/util/functions/getTokenFromCookie"

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const quizUrl = process.env.NEXT_PUBLIC_API_URL;

export const axiosRequest = axios.create({
  baseURL: apiUrl,
  headers: {
    Authorization: getTokenFromCookie() //the token is a variable which holds the token
  }
});

// axiosRequest.defaults.headers.common['X-Api-Key'] = process.env.AUTH_TOKEN;

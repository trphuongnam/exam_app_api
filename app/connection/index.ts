import axios from "axios";

export const axiosRequest = axios.create({
  baseURL: 'https://quizapi.io/api/v1/'
});

axiosRequest.defaults.headers.common['X-Api-Key'] = 'wm4RPUEcklOZUk5vlVc5GHFNTJYnVIrnylXcSIVt';

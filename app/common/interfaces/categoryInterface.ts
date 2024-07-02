export type category = {
  id: string,
  name: string
}

export type categoryApi = {
  id: number,
  name: string,
  description: string,
  start_time: string,
  end_time: string,
  created_at: string,
  updated_at: string
}

export type categoryResponse = {
  data: categoryApi[],
  currentPage: number,
  pageSize: number,
  total: number,
  totalPage: number
}

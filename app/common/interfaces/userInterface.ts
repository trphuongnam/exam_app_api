export type historyApi = {
  id: number,
  score: number,
  test_time: string,
  ctg_name: string,
  ctg_desc: string,
  ctg_start_time: string,
  ctg_end_time: string
}

export type historyResponse = {
  data: historyApi[],
  currentPage: number,
  pageSize: number,
  total: number,
  totalPage: number
}
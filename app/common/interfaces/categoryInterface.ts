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

export type categoryForm = {
  name: string,
  description: string,
  startTime: string,
  endTime: string,
}

export type categoryTree = {
  id: number
  title: string;
  key: string;
  isLeaf: boolean;
  children: questionTree[];
}

export type questionTree = {
  id: number;
  title: string;
  key: string;
  isLeaf: boolean;
}

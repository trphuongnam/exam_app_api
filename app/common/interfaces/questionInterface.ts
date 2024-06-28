export type answerSelect = {
  qId: number,
  answerId: number[],
  isMulti: boolean
}

export type question = {
  id: string,
  name: string,
  description?: string,
  categoryId: number,
  multiple: boolean
}

export type questionApi = {
  id: string,
  name: string,
  description: string,
  category_id: number,
  multiple: number,
  created_at: string,
  updated_at: string,
  answer: any[]
}

export type answers = {
  name: string,
  key?: string,
  correct: number
}

export type postData = {
  name: string,
  description?: string,
  category_id: number,
  multiple: boolean,
  answers: answers[],
  correct: string
}

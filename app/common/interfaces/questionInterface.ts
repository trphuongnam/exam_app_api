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
  id: number,
  name: string,
  description: string,
  category_id: number,
  multiple: number,
  created_at: string,
  updated_at: string,
  answer: answerApi[]
}

export type answerApi = {
  id: number,
  name: string,
  question_id: number,
  correct: number,
  key: string
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

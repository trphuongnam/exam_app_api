export type answerSelect = {
  qId: number,
  aKey: string[],
  isCorrect: boolean,
  isMulti: boolean
}

export type question = {
  id: string,
  name: string,
  description?: string,
  categoryId: number,
  multiple: boolean
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

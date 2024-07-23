// Auth
export const LOGIN = '/login'
export const LOGOUT = '/logout'
export const SIGNUP = '/signup'

// User
export const GET_USER = '/user'
export const GET_TEST_HISTORY = '/user/history'

// Category
export const ADD_CATEGORY = '/category'
export const GET_CATEGORY = '/category'
export const GET_CATEGORY_SELECT = '/category/select'
export const GET_CATEGORY_TREE = '/category/tree'
export const GET_QUESTION_TREE = '/category/tree/:catId'
export const GET_CATEGORY_DETAIL = '/category/:catId'
export const UPDATE_CATEGORY = '/category/:catId'

// Question
export const ADD_QUESTION = '/question'
export const IMPORT_QUESTION = '/question/import'
export const GET_QUESTION_CATEGORY = '/question/category/:catId'
export const GET_QUESTION_DETAIL = '/question/:questionId'
export const UPDATE_QUESTION = '/question/:questionId'

// Test
export const FINISH_TEST = '/test/finish'

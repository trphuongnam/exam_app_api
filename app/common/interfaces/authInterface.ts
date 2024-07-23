export type LoginData = {
  email: string,
  password: string,
  remember: boolean
}

export type loginResult = {
  success: boolean,
  token: string
}

export type SignupData = {
  name: string,
  email: string,
  password: string,
  age: number
}

export type signupResult = {
  success: boolean
}

export type LoginData = {
  email: string,
  password: string,
  remember: boolean
}

export type loginResult = {
  success: boolean,
  token: string
}

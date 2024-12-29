interface Authorization {
  accessToken: string
  refreshToken: string
}

export interface LoginResponse {
  authorization: Authorization
  userInfo: unknown[]
}

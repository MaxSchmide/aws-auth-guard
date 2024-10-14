export type FindUserFn<U> = (params: { cognitoId: string }) => Promise<U | null>

export type DefaultContextType<T> = {
  user: T | null
  headers: Record<string, string | undefined>
}

export type DefaultModuleOptions<U> = {
  findUser: FindUserFn<U>
  credentials: {
    userPoolId: string
    userPoolClientAppId: string
  }
}

import { ModuleMetadata } from '@nestjs/common'

export type FindUserFn<U> = (params: { cognitoId: string }) => Promise<U | null>

export interface AuthOptions<U> {
  findUser: FindUserFn<U>
  credentials: {
    userPoolId: string
    userPoolClientAppId: string
  }
}

export type AuthContext<U> = {
  user: U | null
  headers: Record<string, string | undefined>
}

export type AuthModuleOptions<U> = Pick<ModuleMetadata, 'imports'> & {
  inject: any[]
  useFactory: (...args: any[]) => Promise<AuthOptions<U>> | AuthOptions<U>
  imports?: any[]
}

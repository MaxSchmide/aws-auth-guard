import { ExecutionContext, createParamDecorator } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { AuthContext } from './types'

export const GetUser = createParamDecorator(
  <U extends object>(_: any, context: ExecutionContext) =>
    GqlExecutionContext.create(context).getContext<{
      req: AuthContext<U>
    }>().req.user,
)

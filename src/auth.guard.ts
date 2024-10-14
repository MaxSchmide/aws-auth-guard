import {
  CanActivate,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import _ from 'lodash'
import { AuthService } from './auth.service'
import { DefaultContextType } from './types'

const hasRequest = <T>(obj: unknown): obj is { req: T } =>
  _.isObject(obj) && 'req' in obj && !!obj.req

const getRequest = <T>(context: ExecutionContext): T => {
  const ctx = GqlExecutionContext.create(context).getContext<unknown>()

  if (!hasRequest<T>(ctx)) {
    throw new InternalServerErrorException('Could not create Gql Context')
  }

  return ctx.req
}

@Injectable()
export class AuthGuard<U extends object, C extends DefaultContextType<U>>
  implements CanActivate
{
  constructor(private readonly authService: AuthService<U>) {}

  canActivate = async (context: ExecutionContext): Promise<boolean> => {
    const request = getRequest<C>(context)
    const token = request.headers.authorization

    if (!token) {
      return false
    }

    if (request.user) {
      return true
    }

    request.user = await this.authService.validateToken(
      token.replace('Bearer ', ''),
    )

    return !!request.user
  }
}

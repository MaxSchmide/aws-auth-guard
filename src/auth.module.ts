import { DynamicModule, Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { AuthGuard } from './auth.guard'
import { AuthService } from './auth.service'
import { AUTH_OPTIONS } from './constants'
import { AuthContext, AuthModuleOptions } from './types'

@Module({})
export class AuthModule {
  public static forRootAsync<
    User extends object,
    Context extends AuthContext<User>,
  >(options: AuthModuleOptions<User>): DynamicModule {
    return {
      module: AuthModule,
      providers: [
        {
          provide: AUTH_OPTIONS,
          useFactory: options.useFactory,
          inject: options.inject,
        },
        AuthService<User>,
        {
          provide: APP_GUARD,
          useClass: AuthGuard<User, Context>,
        },
      ],
      imports: options.imports || [],
      exports: [AuthService],
    }
  }
}

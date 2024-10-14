import { DynamicModule, Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { AuthGuard } from './auth.guard'
import { AuthService } from './auth.service'
import { DefaultContextType, DefaultModuleOptions } from './types'

@Module({})
export class AuthModule {
  static forRootAsync<
    U extends object,
    C extends DefaultContextType<U>,
    TOptions extends DefaultModuleOptions<U>,
  >({ credentials, findUser }: TOptions): DynamicModule {
    return {
      module: AuthModule,
      providers: [
        {
          provide: APP_GUARD,
          useClass: AuthGuard<U, C>,
        },
        {
          provide: AuthService<U>,
          useFactory: () =>
            new AuthService(
              findUser,
              credentials.userPoolId,
              credentials.userPoolClientAppId,
            ),
        },
      ],
    }
  }
}

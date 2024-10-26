import { Inject, Injectable } from '@nestjs/common'
import {
  CognitoJwtVerifier,
  CognitoJwtVerifierSingleUserPool,
} from 'aws-jwt-verify/cognito-verifier'
import { AUTH_OPTIONS } from './constants'
import { AuthOptions } from './types'

@Injectable()
export class AuthService<U> {
  private verifier: CognitoJwtVerifierSingleUserPool<{
    userPoolId: string
    tokenUse: 'access'
    clientId: string
  }>

  constructor(
    @Inject(AUTH_OPTIONS) private readonly authOptions: AuthOptions<U>,
  ) {
    this.verifier = CognitoJwtVerifier.create({
      userPoolId: authOptions.credentials.userPoolId,
      tokenUse: 'access',
      clientId: authOptions.credentials.userPoolId,
    })
  }

  validateToken = async (token: string): Promise<U | null> => {
    const { sub } = await this.verifier.verify(token)

    return this.authOptions.findUser({ cognitoId: sub })
  }
}

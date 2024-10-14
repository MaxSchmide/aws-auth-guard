import { Injectable } from '@nestjs/common'
import {
  CognitoJwtVerifier,
  CognitoJwtVerifierSingleUserPool,
} from 'aws-jwt-verify/cognito-verifier'
import { FindUserFn } from './types'

@Injectable()
export class AuthService<U> {
  private verifier: CognitoJwtVerifierSingleUserPool<{
    userPoolId: string
    tokenUse: 'access'
    clientId: string
  }>

  constructor(
    private readonly findUser: FindUserFn<U>,
    private readonly userPoolId: string,
    private readonly userPoolClientAppId: string,
  ) {
    this.verifier = CognitoJwtVerifier.create({
      userPoolId: this.userPoolId,
      tokenUse: 'access',
      clientId: this.userPoolClientAppId,
    })
  }

  validateToken = async (token: string): Promise<U | null> => {
    const { sub } = await this.verifier.verify(token)

    return this.findUser({ cognitoId: sub })
  }
}

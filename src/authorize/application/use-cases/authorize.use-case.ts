import { TokenVerifier } from '../../../authorize/domain/token-verifier';
import { AuthUser } from '../../domain/entities/auth-user';

export class AuthorizeUseCase {
  constructor(private readonly tokenVerifier: TokenVerifier) {}

  async execute(token: string): Promise<AuthUser> {
    return this.tokenVerifier.verify(token);
  }
}

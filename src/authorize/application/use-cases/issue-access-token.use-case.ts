import { AuthUser } from '../../../authorize/domain/entities/auth-user';
import { TokenIssuer } from '../../domain/token-issuer';

export class IssueAccessTokenUseCase {
  constructor(private readonly tokenIssuer: TokenIssuer) {}

  async execute(payload: AuthUser): Promise<string> {
    return this.tokenIssuer.sign(payload);
  }
}

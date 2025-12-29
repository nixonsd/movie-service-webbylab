import jwt from 'jsonwebtoken';
import { TokenIssuer } from '../domain/token-issuer';
import { AuthUser } from '../domain/entities/auth-user';

export class JwtTokenIssuer implements TokenIssuer {
  constructor(
    private readonly secret: jwt.Secret,
    private readonly expiresIn: jwt.SignOptions['expiresIn'] = '1h'
  ) {}

  async sign(payload: AuthUser): Promise<string> {
    const options: jwt.SignOptions = {
      algorithm: 'HS256',
      expiresIn: this.expiresIn,
    };

    return jwt.sign(payload, this.secret, options);
  }
}

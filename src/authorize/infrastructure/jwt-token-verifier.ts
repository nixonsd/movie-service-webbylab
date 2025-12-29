import jwt, { JwtPayload, Secret } from 'jsonwebtoken';
import { TokenVerifier } from '../domain/token-verifier';
import { AuthUser } from '../domain/entities/auth-user';
import { UnauthorizedError } from '../../shared/errors/app-error';

export class JwtTokenVerifier implements TokenVerifier {
  constructor(private readonly secret: Secret) {}

  async verify(token: string): Promise<AuthUser> {
    try {
      const decoded = jwt.verify(token, this.secret);
      return this.toAuthUser(decoded);
    } catch {
      throw new UnauthorizedError('Invalid or expired token');
    }
  }

  private toAuthUser(decoded: string | JwtPayload): AuthUser {
    if (!decoded || typeof decoded !== 'object') {
      throw new UnauthorizedError('Invalid or expired token');
    }

    const id = decoded.id;
    const email = decoded.email;

    if (typeof id !== 'number') {
      throw new UnauthorizedError('Invalid or expired token');
    }

    return typeof email === 'string' ? { id, email } : { id };
  }
}

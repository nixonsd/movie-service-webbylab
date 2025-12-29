import { AuthUser } from './entities/auth-user';

export interface TokenIssuer {
  sign(payload: AuthUser): Promise<string>;
}

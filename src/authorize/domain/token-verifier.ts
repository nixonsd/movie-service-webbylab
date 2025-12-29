import { AuthUser } from './entities/auth-user';

export interface TokenVerifier {
  verify(token: string): Promise<AuthUser>;
}

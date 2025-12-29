import 'express';
import { AuthUser } from '../authorize/domain/entities/auth-user';

declare module 'express-serve-static-core' {
  interface Request {
    user?: AuthUser;
  }
}

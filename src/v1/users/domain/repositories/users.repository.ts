import { CreateUserInput } from '../entities/create-user.input';
import { User } from '../entities/user';

export abstract class AbstractUsersRepository {
  abstract createUser(user: CreateUserInput): Promise<User>;
  abstract findById(id: string): Promise<User | null>;
  abstract verifyUserByEmail(email: string, password: string): Promise<User | null>;
}

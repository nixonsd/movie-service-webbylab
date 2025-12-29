import { User } from '../../domain/entities/user';
import { AbstractUsersRepository } from '../../domain/repositories/users.repository';

export class VerifyUserByEmailUseCase {
  constructor(private readonly usersRepository: AbstractUsersRepository) {}

  async execute(email: string, password: string): Promise<User | null> {
    return this.usersRepository.verifyUserByEmail(email, password);
  }
}

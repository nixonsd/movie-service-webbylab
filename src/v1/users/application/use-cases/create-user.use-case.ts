import { User } from '../../domain/entities/user';
import { CreateUserInput } from '../../domain/entities/create-user.input';
import { AbstractUsersRepository } from '../../domain/repositories/users.repository';

export class CreateUserUseCase {
  constructor(private readonly userRepository: AbstractUsersRepository) {}

  async execute(data: CreateUserInput): Promise<User> {
    return this.userRepository.createUser(data);
  }
}

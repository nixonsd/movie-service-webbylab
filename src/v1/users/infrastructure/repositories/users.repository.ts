import { CreateUserInput } from '../../domain/entities/create-user.input';
import { User } from '../../domain/entities/user';
import { AbstractUsersRepository } from '../../domain/repositories/users.repository';
import { UserModel } from '../models/user.model';

export class UsersRepository implements AbstractUsersRepository {
  async createUser(input: CreateUserInput): Promise<User> {
    const created = await UserModel.create({
      name: input.name,
      email: input.email,
      password: input.password,
    });

    return { id: created.id, name: created.name, email: created.email };
  }

  async findById(id: string): Promise<User | null> {
    const row = await UserModel.findByPk(id, { attributes: ['id', 'name', 'email'], raw: true });
    return row ? (row as User) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const row = await UserModel.findOne({ where: { email }, attributes: ['id', 'name', 'email'], raw: true });
    return row ? (row as User) : null;
  }

  async verifyUserByEmail(email: string, password: string): Promise<User | null> {
    const row = await UserModel.findOne({
      where: { email, password },
      attributes: ['id', 'name', 'email'],
      raw: true,
    });
    return row ? (row as User) : null;
  }
}

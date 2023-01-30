import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { Userable, userData } from './users.type';
import * as bcrypt from 'bcrypt';
import { UsersRepository } from './users.respository';
@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async findOneByEmail(email: string): Promise<User> {
    const user = await this.usersRepository.findOneBy({ email });
    if (!user) return null;

    return user;
  }

  async findOneById(id: string): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) return null;

    return user;
  }

  async create(
    userData: userData,
    userId:string ,
    type: string,
  ): Promise<User> {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(userData.password, salt);

    const user = this.usersRepository.create({
      email: userData.email,
      password: hash,
      targetId: userId,
      targetType: type,
    });
    const {password,  ...createdUser } = await this.usersRepository.save(user);
    
    return createdUser as User;
  }
}

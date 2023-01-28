import { Injectable } from '@nestjs/common';
import { EntityRepository } from 'src/database/entity.repository';
import { DataSource } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersRepository extends EntityRepository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async findOneByEmail(email: string): Promise<User> {
    const user = await this.findOneBy({ email });

    if (!user) return null;

    return user;
  }
}

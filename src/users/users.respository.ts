import { Injectable } from '@nestjs/common';
import { EntityRepository } from '../database/entity.repository';
import { DataSource } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersRepository extends EntityRepository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }
}

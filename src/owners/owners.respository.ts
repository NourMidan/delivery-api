import { Injectable } from '@nestjs/common';
import { EntityRepository } from '../database/entity.repository';
import { DataSource } from 'typeorm';
import { Owner } from './entities/owner.entity';

@Injectable()
export class OwnersRepository extends EntityRepository<Owner> {
  constructor(private dataSource: DataSource) {
    super(Owner, dataSource.createEntityManager());
  }
}

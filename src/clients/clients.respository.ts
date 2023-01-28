import { Injectable } from '@nestjs/common';
import { EntityRepository } from 'src/database/entity.repository';
import { User } from 'src/users/entities/user.entity';
import { DataSource } from 'typeorm';
import { Client } from './entities/client.entity';

@Injectable()
export class ClientsRepository extends EntityRepository<Client> {
  constructor(private dataSource: DataSource) {
    super(Client, dataSource.createEntityManager());
  }
}

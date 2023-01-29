import { Injectable } from '@nestjs/common';
import { EntityRepository } from '../database/entity.repository';
import { DataSource } from 'typeorm';
import { Item } from './entities/item.entity';

@Injectable()
export class ItemsRepository extends EntityRepository<Item> {
  constructor(private dataSource: DataSource) {
    super(Item, dataSource.createEntityManager());
  }
}

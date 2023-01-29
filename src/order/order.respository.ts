import { Injectable } from '@nestjs/common';
import { EntityRepository } from '../database/entity.repository';
import { DataSource } from 'typeorm';
import { Order } from './entities/order.entity';

@Injectable()
export class OrdersRepository extends EntityRepository<Order> {
  constructor(private dataSource: DataSource) {
    super(Order, dataSource.createEntityManager());
  }
}

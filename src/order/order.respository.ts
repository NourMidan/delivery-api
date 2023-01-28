import { Injectable } from '@nestjs/common';
import { EntityRepository } from 'src/database/entity.repository';
import { DataSource } from 'typeorm';
import { Order } from './entities/order.entity';

@Injectable()
export class OrdersRepository extends EntityRepository<Order> {
  constructor(private dataSource: DataSource) {
    super(Order, dataSource.createEntityManager());
  }
}

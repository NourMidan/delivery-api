import { Injectable } from '@nestjs/common';
import { EntityRepository } from 'src/database/entity.repository';
import { DataSource } from 'typeorm';
import { Cart } from './entities/cart.entity';

@Injectable()
export class CartsRepository extends EntityRepository<Cart> {
  constructor(private dataSource: DataSource) {
    super(Cart, dataSource.createEntityManager());
  }
}

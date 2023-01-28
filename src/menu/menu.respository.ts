import { Injectable } from '@nestjs/common';
import { EntityRepository } from 'src/database/entity.repository';
import { DataSource } from 'typeorm';
import { Menu } from './entities/menu.entity';

@Injectable()
export class MenusRepository extends EntityRepository<Menu> {
  constructor(private dataSource: DataSource) {
    super(Menu, dataSource.createEntityManager());
  }
}

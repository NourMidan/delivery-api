import { Client } from '../../clients/entities/client.entity';
import { Item } from '../../item/entities/item.entity';
import { Menu } from '../../menu/entities/menu.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum Status {
  prepairng = 'prepairng',
  delivering = 'delivering',
  delivered = 'delivered',
}
@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({
    name: 'status',
    type: 'enum',
    enum: Status,
    default: Status.prepairng,
  })
  status: Status;

  @ManyToOne(() => Client, (client) => client.orders, {
    eager: false,
    onDelete: 'CASCADE',
  })
  client: Client;

  @ManyToOne(() => Menu, (menu) => menu.orders, {
    eager: false,
    onDelete: 'CASCADE',
  })
  menu: Menu;

  @ManyToMany(() => Item, (item) => item.order, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinTable()
  items: Item[];
}

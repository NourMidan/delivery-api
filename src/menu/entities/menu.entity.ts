import { Item } from '../../item/entities/item.entity';
import { Order } from '../../order/entities/order.entity';
import { Owner } from '../../owners/entities/owner.entity';
import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum Categories {
  pizza = 'pizza',
  burger = 'burger',
  pasta = 'pasta',
  dessert = 'dessert',
  drinks = 'drinks',
}
// Restaurant
@Entity()
export class Menu {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({
    name: 'category',
    type: 'set',
    enum: Categories,
    // array: true,
    default: [Categories.burger],
  })
  category: Categories[];

  @OneToOne(() => Owner, (owner) => owner.menu, {
    eager: false,
    onDelete: 'CASCADE',
  })
  owner: Owner;

  @OneToMany(() => Item, (item) => item.menu, {
    eager: true,
  })
  items: Item[];

  @OneToMany(() => Order, (order) => order.menu, { eager: true })
  orders: Order[];
}

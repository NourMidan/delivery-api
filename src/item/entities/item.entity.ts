import { Cart } from '../../cart/entities/cart.entity';
import { Menu } from '../../menu/entities/menu.entity';
import { Order } from '../../order/entities/order.entity';
import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Item {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ unique: true })
  name: string;

  @Column()
  description: string;

  @ManyToOne(() => Menu, (menu) => menu.items, {
    eager: false,
    onDelete: 'CASCADE',
  })
  menu: Menu;

  @ManyToMany(() => Cart, (cart) => cart.items, {
    eager: false,
  })
  cart: Cart;

  @ManyToMany(() => Order, (order) => order.items, {
    eager: false,
    onDelete: 'CASCADE',
    nullable: true,
  })
  order: Order;
}

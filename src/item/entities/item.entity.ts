import { Cart } from 'src/cart/entities/cart.entity';
import { Menu } from 'src/menu/entities/menu.entity';
import { Order } from 'src/order/entities/order.entity';
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

  @ManyToOne(() => Menu, (menu) => menu.items, { eager: false })
  menu: Menu;

  @ManyToMany(() => Cart, (cart) => cart.items, {
    eager: false,
    onDelete: 'CASCADE',
  })
  cart: Cart;

  @ManyToMany(() => Order, (order) => order.items, {
    eager: false,
    onDelete: 'CASCADE',
  })
  order: Order;
}

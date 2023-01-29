import { Cart } from '../../cart/entities/cart.entity';
import { Order } from '../../order/entities/order.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class Client {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToMany(() => Order, (order) => order.client, { eager: true })
  orders: Order[];

  @OneToOne(() => Cart, (cart) => cart.client, { eager: true })
  @JoinColumn()
  cart: Cart;
}

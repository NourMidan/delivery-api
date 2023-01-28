import { Cart } from 'src/cart/entities/cart.entity';
import { Order } from 'src/order/entities/order.entity';

export interface ClientData {
  name: string;
  email: string;
  token: string;
  id: string;
  cart: Cart;
  orders: Order[];
}

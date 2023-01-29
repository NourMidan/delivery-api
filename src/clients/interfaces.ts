import { Cart } from '../cart/entities/cart.entity';
import { Order } from '../order/entities/order.entity';

export interface ClientData {
  name: string;
  email: string;
  token: string;
  id: string;
  cart: Cart;
  orders: Order[];
}

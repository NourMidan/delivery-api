import { UserWithUserable } from 'src/auth/auth-interfaces';
import { Cart } from 'src/cart/entities/cart.entity';
import { Client } from 'src/clients/entities/client.entity';
import { Item } from 'src/item/entities/item.entity';
import { Menu } from 'src/menu/entities/menu.entity';

const menuStub = new Menu();
menuStub.id = 'menuId';

export const itemOnCartStub = new Item();
itemOnCartStub.id = 'itemOnCartId';

export const cartStub = new Cart();
cartStub.id = 'cartId';
cartStub.menuId = menuStub.id;
cartStub.items = [itemOnCartStub];

export const clientStub = new Client();
clientStub.cart = cartStub;

export const userWithClientStub: UserWithUserable = {
  userable: clientStub,
  id: 'userId',
  email: 'user@email',
  targetId: 'clientId',
  targetType: 'client',
  password: 'password',
};

export const itemStub = new Item();
itemStub.menu = menuStub;
itemStub.id = 'itemId';

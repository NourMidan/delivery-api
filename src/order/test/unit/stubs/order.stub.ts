import { UserWithUserable } from 'src/auth/auth-interfaces';
import { Cart } from 'src/cart/entities/cart.entity';
import { Client } from 'src/clients/entities/client.entity';
import { Item } from 'src/item/entities/item.entity';
import { Menu } from 'src/menu/entities/menu.entity';
import { UpdateOrderDto } from 'src/order/dto/update-order.dto';
import { Order, Status } from 'src/order/entities/order.entity';
import { Owner } from 'src/owners/entities/owner.entity';

const menuStub = new Menu();
menuStub.id = 'menuId';

const itemStub = new Item();
itemStub.id = 'itemId';
itemStub.description = 'item description';
itemStub.name = 'item name';
itemStub.menu = menuStub;

const cartStub = new Cart();
cartStub.id = 'cartId';
cartStub.menuId = menuStub.id;
cartStub.items = [itemStub];

export const clientStub = new Client();
clientStub.cart = cartStub;
clientStub.orders = [];
clientStub.id = 'clientId';

export const ownerStub = new Owner();
ownerStub.menu = menuStub;

export const userWithOwnerStub = new UserWithUserable();
userWithOwnerStub.id = 'userOwnerId';
userWithOwnerStub.targetType = 'owner';
userWithOwnerStub.targetId = 'ownerId';
userWithOwnerStub.userable = ownerStub;

export const userWithClientStub = new UserWithUserable();
userWithClientStub.id = 'userClientId';
userWithClientStub.targetType = 'client';
userWithClientStub.targetId = 'clientId';
userWithClientStub.userable = clientStub;

export const orderStub = new Order();
orderStub.menu = menuStub;
orderStub.client = userWithClientStub.userable as Client;

export const updateOrderDto = new UpdateOrderDto();
updateOrderDto.status = Status.delivered;

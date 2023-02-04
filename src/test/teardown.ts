import { Test } from '@nestjs/testing';
import { CartsRepository } from '../cart/carts.respository';
import { ClientsRepository } from '../clients/clients.respository';
import { ItemsRepository } from '../item/items.respository';
import { MenusRepository } from '../menu/menu.respository';
import { OrdersRepository } from '../order/order.respository';
import { OwnersRepository } from '../owners/owners.respository';
import { UsersRepository } from '../users/users.respository';
import { AppModule } from '../app.module';

export default async (): Promise<void> => {
  const module = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();
  const app = module.createNestApplication();
  await app.init();

  const usersRepository = module.get(UsersRepository);
  const clientRepository = module.get(ClientsRepository);
  const ownerRepository = module.get(OwnersRepository);
  const menuRepository = module.get(MenusRepository);
  const cartRepository = module.get(CartsRepository);
  const orderRepository = module.get(OrdersRepository);
  const itemRepository = module.get(ItemsRepository);

  await usersRepository.query('DELETE FROM user');
  await clientRepository.query('DELETE FROM client');
  await ownerRepository.query('DELETE FROM owner');
  await cartRepository.query('DELETE FROM cart');
  await menuRepository.query('DELETE FROM menu');
  await itemRepository.query('DELETE FROM item');
  // await orderRepository.query('DELETE FROM order');

  // clear database
  console.log('clear database');

  await app.close();
};

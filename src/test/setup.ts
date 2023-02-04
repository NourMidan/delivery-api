import { Test } from '@nestjs/testing';
// import { ClientsService } from 'src/clients/clients.service';
import { Categories } from '../menu/entities/menu.entity';
// import { OwnersService } from 'src/owners/owners.service';
// import { UsersService } from 'src/users/users.service';
import { AppModule } from '../app.module';
import { UsersService } from '../users/users.service';
import { ClientsService } from '../clients/clients.service';
import { OwnersService } from '../owners/owners.service';
import { INestApplication } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OwnersRepository } from '../owners/owners.respository';
import { MenusRepository } from '../menu/menu.respository';
import { JwtService } from '@nestjs/jwt';
import { UsersRepository } from '../users/users.respository';
import { CreateOwnerDto } from 'src/auth/dto/create-owner.dto';
import { CreateClientDto } from 'src/auth/dto/create-client.dto';
import { AuthService } from '../auth/auth.service';
import {
  createCLientStub,
  createOwnerStub,
  itemStub,
  itemStub2,
} from './stubs';
import { ItemService } from '../item/item.service';
import { CartService } from '../cart/cart.service';
import { OrderService } from '../order/order.service';

export default async (): Promise<void> => {
  const module = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = module.createNestApplication();
  await app.init();

  const ownerService = module.get<OwnersService>(OwnersService);
  const clientService = module.get<ClientsService>(ClientsService);
  const itemService = module.get<ItemService>(ItemService);
  const authService = module.get<AuthService>(AuthService);
  const cartService = module.get<CartService>(CartService);
  // const orderService = module.get<OrderService>(OrderService);

  const createdOwner = await ownerService.signUp(createOwnerStub, 'owner');
  const createdClient = await clientService.signUp(createCLientStub, 'client');

  const createdItem = await itemService.create(itemStub, createdOwner);
  const createdItem2 = await itemService.create(itemStub2, createdOwner);

  await cartService.addToCart({ item: createdItem.id }, createdClient);
  await cartService.addToCart({ item: createdItem2.id }, createdClient);
  // const updatedClient = await authService.signIn(createdClient);

  // const createdOrder = await orderService.create(updatedClient);

  await app.close();
};

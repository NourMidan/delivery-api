import { Cart } from 'src/cart/entities/cart.entity';
import { Client } from 'src/clients/entities/client.entity';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/entities/user.entity';

export const createUserDto: CreateUserDto = {
  email: 'email@email.com',
  password: 'userPassword',
};

export const type: string = 'client';

export const userStub: User = {
  email: 'user@email.com',
  id: 'userId',
  password: 'userPassword',
  targetId: 'targetId',
  targetType: 'clientId',
};

export const clientStub = new Client();
clientStub.cart = new Cart();
clientStub.orders = [];

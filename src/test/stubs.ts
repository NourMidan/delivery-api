import { CreateClientDto } from '../auth/dto/create-client.dto';
import { CreateOwnerDto } from '../auth/dto/create-owner.dto';
import { Categories } from '../menu/entities/menu.entity';

export const createOwnerStub: CreateOwnerDto = {
  email: 'default@owner.com',
  password: '12345678',
  menuName: 'burger king',
  category: [Categories.burger, Categories.drinks],
};
export const createCLientStub: CreateClientDto = {
  email: 'default@client.com',
  password: '12345678',
};

export const itemStub = {
  description: 'beef burger with cheese',
  name: 'cheese burger',
};
export const itemStub2 = {
  description: '1 liter pepsi',
  name: 'pepsi',
};

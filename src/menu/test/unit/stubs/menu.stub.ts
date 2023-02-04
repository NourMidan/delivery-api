import { Categories } from 'src/menu/entities/menu.entity';
import { Owner } from 'src/owners/entities/owner.entity';

export const menuStub = {
  name: 'menu1',
  category: [],
  owner: new Owner(),
  items: [],
  orders: [],
};

export const filterDtoStub = {
  search: 'string',
  category: Categories.burger,
};

export const optionsStub = {
  page: 1,
  limit: 1,
};

import { UserWithUserable } from 'src/auth/auth-interfaces';
import { CreateItemDto } from 'src/item/dto/create-item.dto';
import { Item } from 'src/item/entities/item.entity';
import { Menu } from 'src/menu/entities/menu.entity';
import { Owner } from 'src/owners/entities/owner.entity';

export const menuStub = new Menu();
menuStub.id = 'menuId';

export const ownerStub = new Owner();
ownerStub.menu = menuStub;

export const userStub = new UserWithUserable();
userStub.userable = ownerStub;

export const createItemDto: CreateItemDto = {
  name: 'item1',
  description: 'description1',
};

export const itemStub = new Item();
itemStub.id = 'itemId';
itemStub.description = createItemDto.description;
itemStub.name = createItemDto.name;
itemStub.menu = menuStub;

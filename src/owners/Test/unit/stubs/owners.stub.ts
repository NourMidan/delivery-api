import { CreateOwnerDto } from 'src/auth/dto/create-owner.dto';
import { Categories, Menu } from 'src/menu/entities/menu.entity';
import { Owner } from 'src/owners/entities/owner.entity';
import { User } from 'src/users/entities/user.entity';

export const createOwnerStub: CreateOwnerDto = {
  email: 'user@owner.com',
  password: '12345678',
  menuName: 'user menu',
  category: [Categories.burger, Categories.drinks],
};
export const type: string = 'owner';

export const userStub: User = {
  email: 'user@email.com',
  id: 'userId',
  password: 'userPassword',
  targetId: 'targetId',
  targetType: 'ownerId',
};

export const ownerStub = new Owner();
ownerStub.menu = new Menu();
ownerStub.isOwner = true;

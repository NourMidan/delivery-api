import { INestApplication, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Categories } from 'src/menu/entities/menu.entity';
import { AppModule } from 'src/app.module';
import { CreateOwnerDto } from 'src/auth/dto/create-owner.dto';
import { MenusRepository } from '../../../menu/menu.respository';
import { UsersRepository } from 'src/users/users.respository';
import { UserWithUserable } from 'src/auth/auth-interfaces';
import { ItemService } from 'src/item/item.service';
import { ItemsRepository } from 'src/item/items.respository';
import { OwnersService } from 'src/owners/owners.service';
import { OwnersRepository } from 'src/owners/owners.respository';
import { Item } from 'src/item/entities/item.entity';
import { CreateItemDto } from 'src/item/dto/create-item.dto';
import { UpdateItemDto } from 'src/item/dto/update-item.dto';

describe('item Service int', () => {
  let app: INestApplication;
  let usersRepository: UsersRepository;
  let itemsService: ItemService;
  let itemsRepository: ItemsRepository;
  let menusRepository: MenusRepository;
  let ownersService: OwnersService;
  let ownersRepository: OwnersRepository;
  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();
    usersRepository = module.get(UsersRepository);
    itemsService = module.get(ItemService);
    itemsRepository = module.get(ItemsRepository);
    menusRepository = module.get(MenusRepository);

    ownersService = module.get(OwnersService);
    ownersRepository = module.get(OwnersRepository);
  });

  const createOwnerStub: CreateOwnerDto = {
    email: 'owner2@owner.com',
    password: '12345678',
    menuName: 'owner menu2',
    category: [Categories.pasta, Categories.dessert],
  };

  const createItemDto: CreateItemDto = {
    name: 'item name',
    description: 'item description',
  };
  const updateItemDto: UpdateItemDto = {
    name: 'updated item',
    description: 'updated description',
  };
  let owner: UserWithUserable;
  let item: Item;
  it('should be defined', () => {
    expect(usersRepository).toBeDefined();
    expect(itemsService).toBeDefined();
    expect(itemsRepository).toBeDefined();
    expect(menusRepository).toBeDefined();
  });
  describe('should create owner', () => {
    it('should create owner', async () => {
      owner = await ownersService.signUp(createOwnerStub, 'owner');

      expect(owner.email).toBe(createOwnerStub.email);
      expect(owner.targetType).toBe('owner');
    });
  });
  it('should create item', async () => {
    item = await itemsService.create(createItemDto, owner);

    expect(item.menu.id).toEqual(owner.userable['menu'].id);
  });

  it('should update item', async () => {
    const updatedItem = await itemsService.update(
      item.id,
      updateItemDto,
      owner,
    );
    item = updatedItem;
    expect(updatedItem.name).toEqual(updateItemDto.name);
    expect(updatedItem.description).toEqual(updateItemDto.description);
  });
  it('should find item by id', async () => {
    const findItem = await itemsService.findOne(item.id);
    expect(findItem.name).toEqual(item.name);
    expect(findItem.description).toEqual(item.description);
  });
  it('should delete item', async () => {
    await itemsService.remove(item.id, owner);
  });
  it('should return not found exception', async () => {
    await itemsService
      .findOne(item.id)
      .then((user) => expect(user).toBeUndefined())
      .catch((error) => expect(error).toBeInstanceOf(NotFoundException));
  });
  afterAll(async () => {
    await usersRepository.delete(owner.id);
    await ownersRepository.delete(owner.userable.id);
    await menusRepository.delete(owner.userable['menu'].id);
    await app.close();
  });
});

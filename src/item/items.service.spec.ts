import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserWithUserable } from 'src/auth/auth-interfaces';
import { Menu } from 'src/menu/entities/menu.entity';
import { Owner } from 'src/owners/entities/owner.entity';
import { User } from 'src/users/entities/user.entity';
import { CreateItemDto } from './dto/create-item.dto';
import { ItemService } from './item.service';
import { ItemsRepository } from './items.respository';

const mockMenu = new Menu();
mockMenu.id = '1234';

const mockOwner = new Owner();
mockOwner.menu = mockMenu;

/////
const mockUser = new UserWithUserable();
mockUser.userable = mockOwner;

const mockItemDto : CreateItemDto = {
  name: 'item1',
  description: 'description1',
};

describe('ItemsService', () => {
  let service: ItemService;
  let itemRepository: ItemsRepository;

  const mockItemRepository = {
    create: jest.fn().mockImplementation((item) => item),
    save: jest.fn().mockImplementation((item) => {
        return{
            ...item,
            id : 'id'
        }
    }),
  };

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ItemService,
        {
          provide: getRepositoryToken(ItemsRepository),
          useValue: mockItemRepository,
        },
      ],
    }).compile();
    service = module.get<ItemService>(ItemService);
    itemRepository = module.get<ItemsRepository>(ItemsRepository);
  });

  it('service should be defined', () => {
    expect(service).toBeDefined();
    expect(itemRepository).toBeDefined();
  });

  it('create new item', async () => {
    const spyCreate = jest.spyOn(itemRepository, 'create');
    const spySave = jest.spyOn(itemRepository, 'save');

    const expected = await service.create(mockItemDto, mockUser);

    console.log(expected );
    expect(expected).toMatchObject( { ...mockItemDto , menu : mockMenu , id : 'id'} );
    expect(spyCreate).toBeCalled();
    expect(spySave).toBeCalled();
  });
});

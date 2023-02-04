import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Menu } from 'src/menu/entities/menu.entity';
import { MenusRepository } from 'src/menu/menu.respository';
import { OwnersRepository } from 'src/owners/owners.respository';
import { OwnersService } from 'src/owners/owners.service';
import { UsersService } from 'src/users/users.service';
import {
  createOwnerStub,
  ownerStub,
  type,
  userStub,
} from './stubs/owners.stub';
import {
  mockMenuRepository,
  mockOwnerRepository,
  mockUserService,
} from './__mocks__/owners.stub';

describe('owner service', () => {
  let ownerService: OwnersService;
  let ownerRepository: OwnersRepository;
  let menuRepository: MenusRepository;
  let usersService: UsersService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        OwnersService,
        JwtService,
        {
          provide: getRepositoryToken(OwnersRepository),
          useValue: mockOwnerRepository,
        },
        {
          provide: getRepositoryToken(MenusRepository),

          useValue: mockMenuRepository,
        },
        {
          provide: UsersService,
          useValue: mockUserService,
        },
      ],
    }).compile();
    ownerService = module.get<OwnersService>(OwnersService);
    ownerRepository = module.get<OwnersRepository>(OwnersRepository);
    menuRepository = module.get<MenusRepository>(MenusRepository);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined ', () => {
    expect(ownerService).toBeDefined();
    expect(ownerRepository).toBeDefined();
    expect(usersService).toBeDefined();
  });

  it('should sign up user ', async () => {
    const createOwnerSpy = jest
      .spyOn(ownerService, 'createOwner')
      .mockResolvedValueOnce(ownerStub);
    const findOneByEmailSpy = jest
      .spyOn(usersService, 'findOneByEmail')
      .mockResolvedValue(null);

    const createUserSpy = jest
      .spyOn(usersService, 'create')
      .mockImplementation(async (options) => {
        return {
          ...userStub,
        };
      });

    const expected = await ownerService.signUp(createOwnerStub, type);
    expect(expected).toEqual({ ...userStub, userable: ownerStub });
    expect(createOwnerSpy).toBeCalled();
    expect(findOneByEmailSpy).toBeCalledWith(createOwnerStub.email);
    expect(createUserSpy).toBeCalledWith(
      createOwnerStub,
      ownerStub.id,
      'owner',
    );
  });

  it('should create  owner ', async () => {
    const findMenuSpy = jest
      .spyOn(menuRepository, 'findOne')
      .mockResolvedValue(null);
    const createMenuSpy = jest
      .spyOn(menuRepository, 'create')
      .mockReturnValue(new Menu());
    const saveMenuSpy = jest
      .spyOn(menuRepository, 'save')
      .mockResolvedValue(new Menu());

    const createOwnerSpy = jest
      .spyOn(ownerRepository, 'create')
      .mockReturnValue(ownerStub);
    const saveOwnerSpy = jest
      .spyOn(ownerRepository, 'save')
      .mockResolvedValue(ownerStub);

    const expected = await ownerService.createOwner(createOwnerStub);

    expect(expected).toEqual(ownerStub);
    expect(findMenuSpy).toBeCalled();
    expect(createMenuSpy).toBeCalled();
    expect(saveMenuSpy).toBeCalled();
    expect(createOwnerSpy).toBeCalled();
    expect(saveOwnerSpy).toBeCalledWith(ownerStub);
  });

  test('find owner by Id', async () => {
    const findOwnerSpy = jest
      .spyOn(ownerRepository, 'findOne')
      .mockImplementation(async (options) => {
        ownerStub.id = options.where['id'];
        return {
          ...ownerStub,
        };
      });

    const expected = await ownerService.findOneById('ownerId');

    expect(expected).toEqual({ id: 'ownerId', ...ownerStub });
    expect(findOwnerSpy).toBeCalledWith({
      where: { id: 'ownerId' },
      relations: { menu: { orders: true } },
    });
  });
});

import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CartsRepository } from 'src/cart/carts.respository';
import { Cart } from 'src/cart/entities/cart.entity';
import { UsersService } from 'src/users/users.service';
import { ClientsRepository } from '../../clients.respository';
import { ClientsService } from '../../clients.service';
import {
  clientStub,
  createUserDto,
  type,
  userStub,
} from './stubs/clients.stub';
import {
  mockCartRepository,
  mockClientRepository,
  mockUserService,
} from './__mocks__/clients.mock';

describe('client service', () => {
  let clientService: ClientsService;
  let clientRepository: ClientsRepository;
  let cartRepository: CartsRepository;
  let usersService: UsersService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ClientsService,
        JwtService,
        {
          provide: getRepositoryToken(ClientsRepository),
          useValue: mockClientRepository,
        },
        {
          provide: getRepositoryToken(CartsRepository),

          useValue: mockCartRepository,
        },
        {
          provide: UsersService,
          useValue: mockUserService,
        },
      ],
    }).compile();
    clientService = module.get<ClientsService>(ClientsService);
    clientRepository = module.get<ClientsRepository>(ClientsRepository);
    cartRepository = module.get<CartsRepository>(CartsRepository);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined ', () => {
    expect(clientService).toBeDefined();
    expect(clientRepository).toBeDefined();
    expect(usersService).toBeDefined();
  });

  it('should create user ', async () => {
    const createClientSpy = jest
      .spyOn(clientService, 'createClient')
      .mockResolvedValueOnce(clientStub);
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

    const expected = await clientService.signUp(createUserDto, type);

    expect(expected).toEqual({ ...userStub, userable: clientStub });
    expect(createClientSpy).toBeCalled();
    expect(findOneByEmailSpy).toBeCalledWith(createUserDto.email);
    expect(createUserSpy).toBeCalledWith(
      createUserDto,
      clientStub.id,
      'client',
    );
  });

  it('should create  client ', async () => {
    const createCartSpy = jest
      .spyOn(cartRepository, 'create')
      .mockReturnValue(new Cart());
    const saveCartSpy = jest
      .spyOn(cartRepository, 'save')
      .mockResolvedValue(new Cart());
    const createClientSpy = jest
      .spyOn(clientRepository, 'create')
      .mockReturnValue(clientStub);
    const saveClientSpy = jest
      .spyOn(clientRepository, 'save')
      .mockResolvedValue(clientStub);

    const expected = await clientService.createClient();

    expect(expected).toEqual(clientStub);
    expect(createClientSpy).toBeCalled();
    expect(createCartSpy).toBeCalled();
    expect(saveCartSpy).toBeCalledWith(new Cart());
    expect(saveClientSpy).toBeCalledWith(clientStub);
  });

  test('find client by Id', async () => {
    const findClientSpy = jest
      .spyOn(clientRepository, 'findOneBy')
      .mockImplementation(async (options) => {
        clientStub.id = options['id'];
        return {
          ...clientStub,
        };
      });

    const expected = await clientService.findOneById('clientId');

    expect(expected).toEqual({
      ...clientStub,
    });
    expect(findClientSpy).toBeCalledWith({ id: 'clientId' });
  });
});

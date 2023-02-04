import {
  BadRequestException,
  ConflictException,
  INestApplication,
  UnauthorizedException,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Categories } from 'src/menu/entities/menu.entity';
import { AppModule } from 'src/app.module';
import { OwnersService } from 'src/owners/owners.service';
import { OwnersRepository } from 'src/owners/owners.respository';
import { CreateOwnerDto } from 'src/auth/dto/create-owner.dto';
import { MenusRepository } from '../../../menu/menu.respository';
import { MenuService } from '../../../menu/menu.service';
import { ClientsService } from 'src/clients/clients.service';
import { ClientsRepository } from 'src/clients/clients.respository';
import { CreateClientDto } from 'src/auth/dto/create-client.dto';
import { UsersService } from 'src/users/users.service';
import { UsersRepository } from 'src/users/users.respository';
import { UserWithUserable } from 'src/auth/auth-interfaces';
import { AuthService } from 'src/auth/auth.service';
import { User } from 'src/users/entities/user.entity';
import * as supertest from 'supertest';
import { CartsRepository } from 'src/cart/carts.respository';

describe('Auth Service int', () => {
  let app: INestApplication;
  let usersRepository: UsersRepository;
  let usersService: UsersService;
  let ownerService: OwnersService;
  let clientsService: ClientsService;
  let ownersRepository: OwnersRepository;
  let clientRepository: ClientsRepository;
  let cartRepository: CartsRepository;
  let menuRepository: MenusRepository;
  let menuService: MenuService;
  let authService: AuthService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();
    usersService = module.get(UsersService);
    usersRepository = module.get(UsersRepository);
    ownerService = module.get(OwnersService);
    ownersRepository = module.get(OwnersRepository);
    clientsService = module.get(ClientsService);
    clientRepository = module.get(ClientsRepository);
    menuRepository = module.get(MenusRepository);
    menuService = module.get(MenuService);
    authService = module.get(AuthService);
    cartRepository = module.get(CartsRepository);
  });

  const createOwnerDto: CreateOwnerDto = {
    email: 'burger_shop@email.com',
    password: '12345678',
    menuName: 'burger shop auth',
    category: [Categories.burger, Categories.drinks],
  };
  const ownerDuplicateMenuName: CreateOwnerDto = {
    email: 'burger_shop2@email.com',
    password: '12345678',
    menuName: 'burger shop auth',
    category: [Categories.burger, Categories.drinks],
  };
  const ownerUnvalidCategories: CreateOwnerDto = {
    email: 'burger_shop2@email.com',
    password: '12345678',
    menuName: 'coffe shop',
    category: ['candy' as Categories, Categories.drinks],
  };
  const createClientDto: CreateClientDto = {
    email: 'user@email.com',
    password: '12345678',
  };

  let owner: UserWithUserable;
  let client: UserWithUserable;
  let clientToken: string;
  let ownerToken: string;

  it('should be defined', () => {
    expect(usersService).toBeDefined();
    expect(usersRepository).toBeDefined();
    expect(clientsService).toBeDefined();
    expect(clientRepository).toBeDefined();
    expect(ownerService).toBeDefined();
    expect(ownersRepository).toBeDefined();
    expect(menuService).toBeDefined();
    expect(menuRepository).toBeDefined();
    expect(authService).toBeDefined();
  });
  describe('should register owner', () => {
    it('should create owner', async () => {
      owner = await ownerService.signUp(createOwnerDto, 'owner');

      expect(owner.email).toBe(createOwnerDto.email);
      expect(owner.userable['menu'].name).toBe(createOwnerDto.menuName);
      expect(owner.userable['menu'].category).toEqual(createOwnerDto.category);
      expect(owner.id).toEqual(expect.any(String));
      expect(owner.targetId).toEqual(expect.any(String));
      expect(owner.targetType).toEqual(expect.any(String));
    });
    it('should throw on duplicate email', async () => {
      await ownerService
        .signUp(createOwnerDto, 'owner')
        .then((user) => expect(user).toBeUndefined())
        .catch((error) => expect(error).toBeInstanceOf(BadRequestException));
    });
    it('should throw on duplicate menuName', async () => {
      await ownerService
        .signUp(ownerDuplicateMenuName, 'owner')
        .then((user) => expect(user).toBeUndefined())
        .catch((error) => expect(error).toBeInstanceOf(ConflictException));
    });
    it('should throw on unvalid categories', async () => {
      await ownerService
        .signUp(ownerUnvalidCategories, 'owner')
        .then((user) => expect(user).toBeUndefined())
        .catch((error) => expect(error).toBeInstanceOf(ConflictException));
    });
  });
  describe('should register client', () => {
    it('should create client', async () => {
      client = await clientsService.signUp(createClientDto, 'client');

      expect(client.email).toBe(createClientDto.email);
      expect(client.targetType).toBe('client');
    });
    it('should throw on duplicate email', async () => {
      await clientsService
        .signUp(createClientDto, 'client')
        .then((client) => expect(client).toBeUndefined())
        .catch((error) => expect(error).toBeInstanceOf(BadRequestException));
    });
  });

  test('should login owner', async () => {
    const { email: username, password } = createOwnerDto;
    const validateOwner = await authService.validateUserCredentials({
      username,
      password,
    });
    const user = await authService.signIn(validateOwner as User);
    expect(user).toEqual({ ...owner, token: expect.any(String) });
    ownerToken = user.token;
  });
  test('should login client', async () => {
    const { email: username, password } = createClientDto;
    const validateClient = await authService.validateUserCredentials({
      username,
      password,
    });
    const user = await authService.signIn(validateClient as User);
    expect(user).toEqual({ ...client, token: expect.any(String) });
    clientToken = user.token;
  });
  test('should throw unauthorized on wrong credenntials ', async () => {
    const { email: username, password } = createOwnerDto;
    await authService
      .validateUserCredentials({
        username,
        password: 'wrong password',
      })
      .then((client) => expect(client).toBeUndefined())
      .catch((error) => expect(error).toBeInstanceOf(UnauthorizedException));
  });

  test('validate token', async () => {
    const { body: user } = await supertest
      .agent(app.getHttpServer())
      .get('/auth/validate')
      .set('Authorization', `Bearer ${clientToken}`)
      .expect(200);

    expect(user).toEqual(client);
  });

  afterAll(async () => {
    await usersRepository.delete([owner.id, client.id]);
    await ownersRepository.delete(owner.userable.id);
    await clientRepository.delete(client.userable.id);
    await menuRepository.delete(owner.userable['menu'].id);
    await cartRepository.delete(client.userable['cart'].id);
    await app.close();
  });
});

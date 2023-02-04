import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { CreateOwnerDto } from 'src/auth/dto/create-owner.dto';
import { Categories } from '../src/menu/entities/menu.entity';
import { UserWithUserable } from '../src/auth/auth-interfaces';
import { UsersRepository } from '../src/users/users.respository';
import { OwnersRepository } from '../src/owners/owners.respository';
import { ClientsRepository } from '../src/clients/clients.respository';
import { CreateClientDto } from '../src/auth/dto/create-client.dto';
import { MenusRepository } from '../src/menu/menu.respository';
import { CartsRepository } from '../src/cart/carts.respository';

describe('auth controller e2e', () => {
  let app: INestApplication;
  let usersRepository: UsersRepository;
  let ownersRepository: OwnersRepository;
  let menuRepository: MenusRepository;
  let clientRepository: ClientsRepository;
  let cartRepository: CartsRepository;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();

    usersRepository = module.get(UsersRepository);
    ownersRepository = module.get(OwnersRepository);
    menuRepository = module.get(MenusRepository);
    clientRepository = module.get(ClientsRepository);
    cartRepository = module.get(CartsRepository);

    await app.init();
  });

  const createOwnerStub: CreateOwnerDto = {
    email: 'auth@owner.com',
    password: '12345678',
    menuName: 'auth menu',
    category: [Categories.burger, Categories.pizza],
  };
  const createClientStub: CreateClientDto = {
    email: 'auth@client.com',
    password: '12345678',
  };
  let createdOwner: UserWithUserable;
  let createdClient: UserWithUserable;
  let clientToken: string;
  it('should register owner', async () => {
    const { body } = await request
      .agent(app.getHttpServer())
      .post('/auth/register/owner')
      .set('Accept', 'application/json')
      .send(createOwnerStub)
      .expect('Content-Type', /json/)
      .expect(201);

    createdOwner = body;
    expect(body.email).toEqual(createOwnerStub.email);
  });
  it('should register client', async () => {
    const { body } = await request
      .agent(app.getHttpServer())
      .post('/auth/register/client')
      .set('Accept', 'application/json')
      .send(createClientStub)
      .expect('Content-Type', /json/)
      .expect(201);

    createdClient = body;
    expect(body.email).toEqual(createClientStub.email);
  });
  it('should login client', async () => {
    const { body } = await request
      .agent(app.getHttpServer())
      .post('/auth/login')
      .set('Accept', 'application/json')
      .send({
        username: createClientStub.email,
        password: createClientStub.password,
      })
      .expect('Content-Type', /json/)
      .expect(201);

    clientToken = body.token;

    expect(body.token).toEqual(expect.any(String));
  });
  it('should validate client', async () => {
    const { body } = await request
      .agent(app.getHttpServer())
      .get('/auth/validate')
      .set('Authorization', `Bearer ${clientToken}`)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(body.email).toEqual(createClientStub.email);
  });
  afterAll(async () => {
    await usersRepository.delete([createdOwner.id, createdClient.id]);
    await ownersRepository.delete(createdOwner.userable.id);
    await cartRepository.delete(createdClient.userable['cart'].id);
    await menuRepository.delete(createdOwner.userable['menu'].id);
    await clientRepository.delete(createdClient.userable.id);
    await app.close();
  });
});

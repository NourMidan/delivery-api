import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { CreateOwnerDto } from 'src/auth/dto/create-owner.dto';
import { Categories } from '../src/menu/entities/menu.entity';
import { UserWithUserable } from '../src/auth/auth-interfaces';
import { UsersRepository } from '../src/users/users.respository';
import { OwnersRepository } from '../src/owners/owners.respository';
import { ClientsRepository } from '../src/clients/clients.respository';
import { CreateClientDto } from '../src/auth/dto/create-client.dto';
import { MenusRepository } from '../src/menu/menu.respository';
import { CartsRepository } from '../src/cart/carts.respository';
import { CreateItemDto } from 'src/item/dto/create-item.dto';
import { Item } from 'src/item/entities/item.entity';

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
    email: 'cart@owner.com',
    password: '12345678',
    menuName: 'cart menu',
    category: [Categories.burger, Categories.pizza],
  };
  const createClientStub: CreateClientDto = {
    email: 'cart@client.com',
    password: '12345678',
  };

  const createItemDto: CreateItemDto = {
    description: 'cart e2e description',
    name: 'cart e2e name',
  };
  let createdOwner: UserWithUserable;
  let createdClient: UserWithUserable;
  let createdItem: Item;

  let clientToken: string;
  let ownerToken: string;
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
  it('should login owner', async () => {
    const { body } = await request
      .agent(app.getHttpServer())
      .post('/auth/login')
      .set('Accept', 'application/json')
      .send({
        username: createOwnerStub.email,
        password: createOwnerStub.password,
      })
      .expect('Content-Type', /json/)
      .expect(201);

    ownerToken = body.token;

    expect(body.token).toEqual(expect.any(String));
  });

  it('should create item', async () => {
    const { body } = await request
      .agent(app.getHttpServer())
      .post('/item/create')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send(createItemDto)
      .expect('Content-Type', /json/)
      .expect(201);

    createdItem = body;
    expect(body.name).toEqual(createItemDto.name);
    expect(body.description).toEqual(createItemDto.description);
  });

  it('should get user  cart', async () => {
    const { body } = await request
      .agent(app.getHttpServer())
      .get('/cart')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${clientToken}`)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(body.id).toEqual(createdClient.userable['cart'].id);
  });
  it('should add to cart', async () => {
    const { body } = await request
      .agent(app.getHttpServer())
      .patch('/cart/add')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${clientToken}`)
      .send({ item: createdItem.id })

      .expect('Content-Type', /json/)
      .expect(200);

    expect(body.items).toHaveLength(1);
  });

  it('should add remove from cart', async () => {
    const { body } = await request
      .agent(app.getHttpServer())
      .patch('/cart/remove')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${clientToken}`)
      .send({ item: createdItem.id })

      .expect('Content-Type', /json/)
      .expect(200);

    expect(body.items).toHaveLength(0);
    expect(body.menuId).toBe(null);
  });

  afterAll(async () => {
    await usersRepository.delete([createdOwner.id, createdClient.id]);
    await ownersRepository.delete(createdOwner.userable.id);
    await clientRepository.delete(createdClient.userable.id);
    await cartRepository.delete(createdClient.userable['cart'].id);
    await menuRepository.delete(createdOwner.userable['menu'].id);
    await app.close();
  });
});

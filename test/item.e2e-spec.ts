import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { CreateOwnerDto } from 'src/auth/dto/create-owner.dto';
import { Categories } from '../src/menu/entities/menu.entity';
import { UserWithUserable } from '../src/auth/auth-interfaces';
import { UsersRepository } from '../src/users/users.respository';
import { OwnersRepository } from '../src/owners/owners.respository';
import { MenusRepository } from '../src/menu/menu.respository';
import { CartsRepository } from '../src/cart/carts.respository';
import { CreateItemDto } from 'src/item/dto/create-item.dto';
import { Item } from 'src/item/entities/item.entity';

describe('item controller e2e', () => {
  let app: INestApplication;
  let usersRepository: UsersRepository;
  let ownersRepository: OwnersRepository;
  let menuRepository: MenusRepository;
  let cartRepository: CartsRepository;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();

    usersRepository = module.get(UsersRepository);
    ownersRepository = module.get(OwnersRepository);
    menuRepository = module.get(MenusRepository);
    cartRepository = module.get(CartsRepository);

    await app.init();
  });

  const createOwnerStub: CreateOwnerDto = {
    email: 'item@owner.com',
    password: '12345678',
    menuName: 'item menu',
    category: [Categories.burger, Categories.pizza],
  };
  const createItemDto: CreateItemDto = {
    description: 'item e2e description',
    name: 'item e2e name',
  };
  let createdOwner: UserWithUserable;
  let createdItem: Item;
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
  it('should get item by id', async () => {
    const { body } = await request
      .agent(app.getHttpServer())
      .get(`/item/${createdItem.id}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);
    expect(body.name).toEqual(createItemDto.name);
    expect(body.description).toEqual(createItemDto.description);
  });
  it('should delete item ', async () => {
    const { body } = await request
      .agent(app.getHttpServer())
      .delete(`/item/${createdItem.id}`)
      .set('Authorization', `Bearer ${ownerToken}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);
  });

  afterAll(async () => {
    await usersRepository.delete([createdOwner.id]);
    await ownersRepository.delete(createdOwner.userable.id);
    await menuRepository.delete(createdOwner.userable['menu'].id);
    await app.close();
  });
});

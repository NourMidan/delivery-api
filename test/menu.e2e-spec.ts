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

describe('menu controller e2e', () => {
  let app: INestApplication;
  let usersRepository: UsersRepository;

  let ownersRepository: OwnersRepository;
  let menuRepository: MenusRepository;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    usersRepository = module.get(UsersRepository);

    ownersRepository = module.get(OwnersRepository);
    menuRepository = module.get(MenusRepository);
    app = module.createNestApplication();

    await app.init();
  });
  const createOwnerStub: CreateOwnerDto = {
    email: 'menu@owner.com',
    password: '12345678',
    menuName: 'menu menu',
    category: [Categories.burger, Categories.pizza],
  };
  let createdOwner: UserWithUserable;

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

  it('paginate and filter menu', async () => {
    const { body } = await request
      .agent(app.getHttpServer())
      .get('/menu/list?limit=1&page=1&search=&category=burger')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);
    expect(body).toHaveLength(1);
    expect(body[0].category).toContain('burger');
  });
  it('get menu by id', async () => {
    const { body } = await request
      .agent(app.getHttpServer())
      .get(`/menu/${createdOwner.userable['menu'].id}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(body.id).toEqual(createdOwner.userable['menu'].id);
  });
  afterAll(async () => {
    await usersRepository.delete([createdOwner.id]);
    await ownersRepository.delete(createdOwner.userable.id);
    await menuRepository.delete(createdOwner.userable['menu'].id);
    await app.close();
  });
});

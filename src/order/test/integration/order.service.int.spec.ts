import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { UserWithUserable } from 'src/auth/auth-interfaces';
import { OrderService } from 'src/order/order.service';
import { AuthService } from 'src/auth/auth.service';
import * as supertest from 'supertest';
import { createCLientStub, createOwnerStub } from 'src/test/stubs';
import { Order, Status } from 'src/order/entities/order.entity';
describe('order Service int', () => {
  let app: INestApplication;
  let orderService: OrderService;
  let authService: AuthService;
  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    orderService = module.get(OrderService);
    authService = module.get(AuthService);
  });

  let owner: UserWithUserable;
  let client: UserWithUserable;
  let order: Order;
  it('should be defined', () => {
    expect(orderService).toBeDefined();
  });

  test('login client ', async () => {
    const { body: userData } = await supertest
      .agent(app.getHttpServer())
      .post('/auth/login')
      .send({ username: createCLientStub.email, ...createCLientStub })
      .expect(201);
    client = userData;
  });
  test('login owner ', async () => {
    const { body: userData } = await supertest
      .agent(app.getHttpServer())
      .post('/auth/login')
      .send({ username: createOwnerStub.email, ...createOwnerStub })
      .expect(201);
    owner = userData;
  });

  test('create order', async () => {
    order = await orderService.create(client);
    expect(order.client.id).toEqual(client.userable.id);
  });
  test('update order', async () => {
    await orderService.update(order.id, { status: Status.delivered }, owner);
  });
  test('get order by id ', async () => {
    const updatedOrder = await orderService.findOne(order.id);
    expect(updatedOrder.status).toEqual(Status.delivered);
  });

  afterAll(async () => {
    await app.close();
  });
});

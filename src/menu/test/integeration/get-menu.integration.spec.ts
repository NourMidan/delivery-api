import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Menu } from 'src/menu/entities/menu.entity';
import { MenuModule } from '../../../menu/menu.module';
import { MenusRepository } from '../../../menu/menu.respository';
import { MenuService } from '../../../menu/menu.service';
import * as supertest from 'supertest';
import { Repository } from 'typeorm';
import { DatabaseModule } from 'src/database/database.module';

describe('User', () => {
  let app: INestApplication;
  let repository: MenusRepository
  let menuService: MenuService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        MenuModule,
        DatabaseModule,
        // TypeOrmModule.forRoot({
        //   type: 'mysql',
        //   host: 'localhost',
        //   port: 3306,
        //   username: 'root',
        //   password: 'password',
        //   database: 'delivery_test',
        //   entities: ['./**/*.entity.ts'],
        //   synchronize: true,
        // }),
      ],
    }).compile();

    app = module.createNestApplication();
    repository = module.get(MenusRepository);
    await app.init();
  });

  afterEach(async () => {
    await repository.query(`DELETE FROM menu;`);
  });

  afterAll(async () => {
    await app.close();
  });

  it('should get menu', async () => {

    const menu = await menuService.findOne('2d897a99-9fa4-4e0c-ab83-389f3c66b3d9')

    console.log(menu)
  });

  //   describe('GET /users', () => {
  //     it('should return an array of users', async () => {
  //       await repository.save([{ name: 'test-name-0' }, { name: 'test-name-1' }]);
  //       const { body } = await supertest
  //         .agent(app.getHttpServer())
  //         .get('/users')
  //         .set('Accept', 'application/json')
  //         .expect('Content-Type', /json/)
  //         .expect(200);
  //       expect(body).toEqual([
  //         { id: expect.any(Number), name: 'test-name-0' },
  //         { id: expect.any(Number), name: 'test-name-1' },
  //       ]);
  //     });
  //   });

  //   describe('POST /users', () => {
  //     it('should return a user', async () => {
  //       const { body } = await supertest
  //         .agent(app.getHttpServer())
  //         .post('/users')
  //         .set('Accept', 'application/json')
  //         .send({ name: 'test-name' })
  //         .expect('Content-Type', /json/)
  //         .expect(201);
  //       expect(body).toEqual({ id: expect.any(Number), name: 'test-name' });
  //     });

  //     it('should create a user is the DB', async () => {
  //       await expect(repository.findAndCount()).resolves.toEqual([[], 0]);
  //       await supertest
  //         .agent(app.getHttpServer())
  //         .post('/users')
  //         .set('Accept', 'application/json')
  //         .send({ name: 'test-name' })
  //         .expect('Content-Type', /json/)
  //         .expect(201);
  //       await expect(repository.findAndCount()).resolves.toEqual([
  //         [{ id: expect.any(Number), name: 'test-name' }],
  //         1,
  //       ]);
  //     });

  //     it('should handle a missing name', async () => {
  //       await supertest
  //         .agent(app.getHttpServer())
  //         .post('/users')
  //         .set('Accept', 'application/json')
  //         .send({ none: 'test-none' })
  //         .expect('Content-Type', /json/)
  //         .expect(500);
  //     });
  //   });
});

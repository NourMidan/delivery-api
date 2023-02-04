import { INestApplication, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Categories } from 'src/menu/entities/menu.entity';
import { MenusRepository } from '../../menu.respository';
import { MenuService } from '../../menu.service';
import { AppModule } from 'src/app.module';
import { FilterMenuDto } from 'src/menu/dto/filter-menu.dto';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { OwnersService } from 'src/owners/owners.service';
import { OwnersRepository } from 'src/owners/owners.respository';
import { CreateOwnerDto } from 'src/auth/dto/create-owner.dto';
import { Owner } from 'src/owners/entities/owner.entity';

describe('User', () => {
  let app: INestApplication;
  let menuRepository: MenusRepository;
  let menuService: MenuService;
  let ownerService: OwnersService;
  let ownerRepository: OwnersRepository;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();
    menuRepository = module.get(MenusRepository);
    menuService = module.get(MenuService);
    ownerService = module.get(OwnersService);
    ownerRepository = module.get(OwnersRepository);
  });
  let createdOwner: Owner;
  let menuId: string;

  describe('get menu by Id', () => {
    it('should create owner', async () => {
      const createOwnerDto: CreateOwnerDto = {
        email: 'burger_shop@email.com',
        password: '12345678',
        menuName: 'burger shop menu',
        category: [Categories.burger, Categories.drinks],
      };
      const owner = await ownerService.createOwner(createOwnerDto);
      expect(owner.menu.name).toEqual(createOwnerDto.menuName);

      menuId = owner.menu.id;
      createdOwner = owner;
    });

    test('should get menu by id', async () => {
      const menu = await menuService.findOne(menuId);
      expect(menu.id).toBe(menuId);
    });

    test('should throw error if menu not found', async () => {
      try {
        await menuService.findOne('c94bf9ac-d8e0-4a49-809f-dddddd');
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });

  test('paginate and filter menus', async () => {
    const filterMenuDto: FilterMenuDto = {
      search: 'burger',
      category: Categories.burger,
    };
    const options: IPaginationOptions = {
      page: 1,
      limit: 1,
    };

    const menus = await menuService.filter(options, filterMenuDto);

    // check if length equals the limit
    expect(menus).toHaveLength(Number(options.limit));

    // check if filters applied
    menus.forEach((item) => {
      expect(item.category).toContain(filterMenuDto.category);
      expect(item.name).toContain(filterMenuDto.search);
    });
  });

  afterAll(async () => {
    await ownerRepository.delete(createdOwner.id);
    await menuRepository.delete(menuId);

    await app.close();
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

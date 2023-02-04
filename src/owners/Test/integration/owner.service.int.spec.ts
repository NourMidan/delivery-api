import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Categories } from 'src/menu/entities/menu.entity';
import { AppModule } from 'src/app.module';
import { OwnersService } from 'src/owners/owners.service';
import { OwnersRepository } from 'src/owners/owners.respository';
import { CreateOwnerDto } from 'src/auth/dto/create-owner.dto';
import { MenusRepository } from '../../../menu/menu.respository';
import { UsersRepository } from 'src/users/users.respository';
import { UserWithUserable } from 'src/auth/auth-interfaces';

describe('owner Service int', () => {
  let app: INestApplication;
  let usersRepository: UsersRepository;
  let ownersService: OwnersService;
  let ownersRepository: OwnersRepository;
  let menusRepository: MenusRepository;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();
    usersRepository = module.get(UsersRepository);
    ownersService = module.get(OwnersService);
    ownersRepository = module.get(OwnersRepository);
    menusRepository = module.get(MenusRepository);
  });

  const createOwnerStub: CreateOwnerDto = {
    email: 'owner@owner.com',
    password: '12345678',
    menuName: 'owner menu',
    category: [Categories.pasta, Categories.dessert],
  };

  let owner: UserWithUserable;

  it('should be defined', () => {
    expect(usersRepository).toBeDefined();
    expect(ownersService).toBeDefined();
    expect(ownersRepository).toBeDefined();
    expect(menusRepository).toBeDefined();
  });
  describe('should create owner', () => {
    it('should create owner', async () => {
      owner = await ownersService.signUp(createOwnerStub, 'owner');

      expect(owner.email).toBe(createOwnerStub.email);
      expect(owner.targetType).toBe('owner');
    });
    it('should get owner by id', async () => {
      const ownerData = await ownersService.findOneById(owner.userable.id);
      expect(ownerData.id).toEqual(owner.userable.id);
    });
  });

  afterAll(async () => {
    await usersRepository.delete(owner.id);
    await ownersRepository.delete(owner.userable.id);
    await menusRepository.delete(owner.userable['menu'].id);
    await app.close();
  });
});

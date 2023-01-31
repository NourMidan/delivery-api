import { Test } from '@nestjs/testing';
import { Expose } from 'class-transformer';
import { IsEnum } from 'class-validator';
import { Any } from 'typeorm';
import { Categories, Menu } from './entities/menu.entity';
import { MenusRepository } from './menu.respository';
import { MenuService } from './menu.service';

const mockFilterOptions = {
  page: 1,
  limit: 5,
};

const mockMenu = {
  name: 'menu1',
  category: [],
  owner: {},
  items: [],
  orders: [],
};

const mockFilterDto = {
  search: 'string',
  category: Categories.burger,
};

const mockOptions = {
  page: 1,
  limit: 1,
};

const mockPaginate = [
    {
      id: expect.any(String),
      name: expect.any(String),
      category: expect.any([]),
    },
  ]
  // meta: {
  //   totalItems: 1,
  //   itemCount: 1,
  //   itemsPerPage: 5,
  //   totalPages: 1,
  //   currentPage: 1,
  // },

// const createQueryBuilder = () => ({
//   where: jest.fn(),
//   andWhere: jest.fn().mockReturnThis(),
//   offset: jest.fn().mockReturnThis(),
//   limit: jest.fn().mockReturnThis(),
//   cache: jest.fn().mockReturnThis(), 
//   getMany: jest.fn().mockReturnThis(),
//   clone: jest.fn().mockReturnThis(),
//   skip: jest.fn().mockReturnThis(),
//   take: jest.fn().mockReturnThis(),
//   orderBy: jest.fn().mockReturnThis(),

// });

// const createQueryBuilder = ()=>({
//     where: jest.fn().mockReturnThis(),
//     andWhere: jest.fn().mockReturnThis(),
  
//     limit: jest.fn().mockImplementation(),
//     skip: jest.fn().mockReturnThis(),
//   });
 
const mockMenusRepository = () => ({
 
  findOne: jest.fn(),
  createQueryBuilder: jest.fn(() => ({
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    getMany : jest.fn().mockImplementation(() => mockPaginate),
    take: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    
    
  })),
  
});





describe('MenuService', () => {
  let menuRepository;
  let menuService: MenuService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        MenuService,
        { provide: MenusRepository, useFactory: mockMenusRepository },
      ],
    }).compile();
    menuService = module.get(MenuService);
    menuRepository = module.get(MenusRepository);
  });

  test('find one menu', async () => {
    const repoSpy = jest
      .spyOn(menuRepository, 'findOne')
      .mockResolvedValue({ id: '1234', ...mockMenu });
    expect(menuService.findOne('1234')).resolves.toEqual({
      id: '1234',
      ...mockMenu,
    });
    expect(repoSpy).toBeCalledWith({
      where: { id: '1234' },
      relations: { orders: true },
    });
  });
  it('return paginated menus after filter', async () => {
    const querySpy = jest.spyOn(menuRepository, 'createQueryBuilder');
    const expected = await menuService.filter(mockOptions, mockFilterDto);
    expect(expected).toEqual(mockPaginate);
    expect(querySpy).toBeCalled()
    // expect(querySpy).toBeCalled()
  });
});

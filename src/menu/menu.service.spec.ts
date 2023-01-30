import { Test } from '@nestjs/testing';
import { Menu } from './entities/menu.entity';
import { MenusRepository } from './menu.respository';
import { MenuService } from './menu.service';

const mockFilterOptions = {
  page: 1,
  limit: 5,
};

const mockMenu = {
  name : 'menu1',
  category :[],
  owner : {},
  items : [],
  orders : []
};

const mockFilterDto = {
  search: 'string',
  category: 'burger',
};

const mockMenusRepository = () => ({
  filter: jest.fn().mockImplementation(),
  // findOne  : jest.fn().mockImplementation(id => Promise.resolve({id  , ...mockMenu}))
  findOne  : jest.fn()

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
 
  
  describe('findOne', () => {
    it('find one menu', async() => {
      const repoSpy = jest.spyOn(menuRepository, 'findOne').mockResolvedValue({ id : '1234',...mockMenu});
      expect(menuService.findOne('1234')).resolves.toEqual({ id : '1234',...mockMenu});
      expect(repoSpy).toBeCalledWith({ where: { id: '1234' }, relations: { orders: true} });

    }); 
  });
  describe('filter', () => {
    
  });
});

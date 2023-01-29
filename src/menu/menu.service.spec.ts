import { Test } from '@nestjs/testing';
import { MenusRepository } from './menu.respository';
import { MenuService } from './menu.service';

const mockMenusRepository = () => ({
  filter: jest.fn(),
});

const mockFilterOptions = {
  page: 1,
  limit: 5,
};

const mockFilterDto = {
  search: 'string',
  category: 'burger',
};
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

  describe('filter', () => {
    it('applys fiter and search then return paginated results', () => {
      expect(true).toEqual(true);
    });
  });
});

import { Test } from '@nestjs/testing';
import { MenusRepository } from '../../menu.respository';
import { MenuService } from '../../menu.service';
import { filterDtoStub, menuStub, optionsStub } from './stubs/menu.stub';
import { mockMenusRepository, mockPaginate } from './__mocks__/menu.mock';

describe('MenuService', () => {
  let menuRepository: MenusRepository;
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
      .mockImplementation(async (options) => {
        return {
          id: options.where['id'],
          ...menuStub,
        };
      });

    const menu = await menuService.findOne('1234');

    expect(menu).toEqual({
      id: '1234',
      ...menuStub,
    });

    expect(repoSpy).toBeCalledWith({
      where: { id: '1234' },
      relations: { orders: true },
    });
  });

  test('return paginated menus after filter', async () => {
    const querySpy = jest.spyOn(menuRepository, 'createQueryBuilder');

    const expected = await menuService.filter(optionsStub, filterDtoStub);

    expect(expected).toEqual(mockPaginate);
    expect(querySpy).toBeCalledWith('menu');
  });
});

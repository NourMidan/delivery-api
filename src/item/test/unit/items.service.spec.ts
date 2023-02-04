import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ItemService } from '../../item.service';
import { ItemsRepository } from '../../items.respository';
import { createItemDto, itemStub, menuStub, userStub } from './stubs/item.stub';
import { mockItemRepository } from './__mocks__/items.mock';

describe('ItemsService', () => {
  let itemService: ItemService;
  let itemRepository: ItemsRepository;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ItemService,
        {
          provide: getRepositoryToken(ItemsRepository),
          useValue: mockItemRepository,
        },
      ],
    }).compile();
    itemService = module.get<ItemService>(ItemService);
    itemRepository = module.get<ItemsRepository>(ItemsRepository);
  });

  test('service should be defined', () => {
    expect(itemService).toBeDefined();
    expect(itemRepository).toBeDefined();
  });

  test('create new item', async () => {
    const spyCreate = jest
      .spyOn(itemRepository, 'create')
      .mockReturnValueOnce(itemStub);
    const spySave = jest
      .spyOn(itemRepository, 'save')
      .mockResolvedValueOnce(itemStub);

    const expected = await itemService.create(createItemDto, userStub);
    expect(expected).toMatchObject({
      ...createItemDto,
      menu: menuStub,
    });
    expect(spyCreate).toBeCalled();
    expect(spySave).toBeCalled();
  });
  test('find item by Id', async () => {
    const findItemSpy = jest
      .spyOn(itemRepository, 'findOneBy')
      .mockImplementation(async (id) => itemStub);

    const expected = await itemService.findOne('itemId');

    expect(expected).toEqual(itemStub);
    expect(findItemSpy).toBeCalledWith({
      id: 'itemId',
    });
  });
  test('update item ', async () => {
    const findItemSpy = jest
      .spyOn(itemRepository, 'findOne')
      .mockImplementation(async (options) => itemStub);
    const updateItemSpy = jest
      .spyOn(itemRepository, 'update')
      .mockImplementation(async (id, data) => {
        itemStub.name = data.name as string;
        itemStub.description = data.description as string;
        return null;
      });

    const expected = await itemService.update(
      'itemId',
      { name: 'updated Name', description: 'updated description' },
      userStub,
    );

    expect(expected).toEqual(itemStub);
    expect(findItemSpy).toBeCalledWith({
      where: { id: 'itemId' },
      relations: { menu: true },
    });
    expect(findItemSpy).toBeCalledTimes(2);
    expect(updateItemSpy).toBeCalled;
  });
  test('remove item ', async () => {
    const findItemSpy = jest
      .spyOn(itemRepository, 'findOne')
      .mockImplementation(async (options) => itemStub);
    const deleteItemSpy = jest
      .spyOn(itemRepository, 'delete')
      .mockImplementation(async (id) => {
        return null;
      });

    const expected = await itemService.remove('itemId', userStub);

    expect(expected).toBe(null);
    expect(findItemSpy).toBeCalledWith({
      where: { id: 'itemId' },
      relations: { menu: true },
    });
    expect(deleteItemSpy).toBeCalledWith('itemId');
  });
});

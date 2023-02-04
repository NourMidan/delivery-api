export const mockPaginate = [
  {
    id: expect.any(String),
    name: expect.any(String),
    category: expect.any([]),
  },
];

export const mockMenusRepository = () => ({
  findOne: jest.fn(),
  createQueryBuilder: jest.fn(() => ({
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    getMany: jest.fn().mockImplementation(() => mockPaginate),
  })),
});

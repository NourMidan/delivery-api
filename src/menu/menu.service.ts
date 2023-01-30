import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { paginate } from 'nestjs-typeorm-paginate/dist/paginate';
import { FilterMenuDto } from './dto/filter-menu.dto';
import { Menu } from './entities/menu.entity';
import { MenusRepository } from './menu.respository';

@Injectable()
export class MenuService {
  constructor(private menuRepository: MenusRepository) {}

  async filter(options: IPaginationOptions, filterMenuDto: FilterMenuDto) {
    const { search, category } = filterMenuDto;

  
    const query = this.menuRepository
      .createQueryBuilder('menu')
      .groupBy('menu.id')
      .having('LOWER(menu.name) like LOWER(:name)', { name: `%${search}%` })
      .andHaving('FIND_IN_SET(:category, menu.category) > 0', { category });

    try {
      const menus = await paginate<Menu>(query, options);
      return menus;
    } catch (err) {
      throw new ConflictException('unvalid category');
    }
  }

  async findOne(id: string) {
    try {
      return await this.menuRepository.findOne({
        where: { id },
        relations: { orders: true },
      });
    } catch (error) {
      throw new NotFoundException('Invalid Id');
    }
  }
}

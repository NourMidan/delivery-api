import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { paginate } from 'nestjs-typeorm-paginate/dist/paginate';
import { FilterMenuDto } from './dto/filter-menu.dto';
import { Categories, Menu } from './entities/menu.entity';
import { MenusRepository } from './menu.respository';

@Injectable()
export class MenuService {
  constructor(private menuRepository: MenusRepository) {}

  async filter(options: IPaginationOptions, filterMenuDto: FilterMenuDto) {
    const { search, category } = filterMenuDto;
    const { page ,  limit} = options

    // function isCategories(value: string): value is Categories {
    //   return Object.values<string>(Categories).includes(value);
    // }

    // if (category.length>0 && !isCategories(category)) throw new ConflictException('unvalid category')



    const currentPage = Math.max(Number(page || 1), 1);
    const currentLimit = Math.max(Number(limit || 1), 1);
    const option= {
      take: Number(limit) || Number(1),
      skip: (currentPage - 1) * Number(currentLimit ),
    };


    const query = await this.menuRepository
      .createQueryBuilder('menu')
      .where('LOWER(menu.name) like LOWER(:name) ', { name: `%${search}%` })
      
       if(category.length>0){
        query.andWhere('FIND_IN_SET(:category, menu.category) ', { category }) 

       }

 
    return query.take(option.take).skip(option.skip).getMany()

    
      // const menus = await paginate<Menu>(query, options);
      // return menus;
    // try {
    // } catch (err) {
    //   throw new ConflictException('unvalid category');
    // }
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

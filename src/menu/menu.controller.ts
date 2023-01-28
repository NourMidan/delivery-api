import { Controller, Get, Param } from '@nestjs/common';
import { MenuService } from './menu.service';
import { Query } from '@nestjs/common/decorators';
import { DefaultValuePipe, ParseIntPipe } from '@nestjs/common/pipes';
import { IPaginationOptions } from 'nestjs-typeorm-paginate/dist/interfaces';
import { Categories } from './entities/menu.entity';
import { FilterMenuDto } from './dto/filter-menu.dto';

@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Get('/list')
  filter(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(5), ParseIntPipe) limit = 1,
    @Query('search', new DefaultValuePipe('')) search: string,
    @Query('category', new DefaultValuePipe('')) category: Categories,
  ) {
    const options: IPaginationOptions = { page, limit };
    const filterMenuDto: FilterMenuDto = { search, category };
    return this.menuService.filter(options, filterMenuDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.menuService.findOne(id);
  }
}

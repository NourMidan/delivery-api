import { Categories } from '../entities/menu.entity';

export class FilterMenuDto {
  search?: string;
  category?: Categories;
}

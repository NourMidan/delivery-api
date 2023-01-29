import { IsNotEmpty } from 'class-validator';
import { Item } from '../../item/entities/item.entity';
import { Menu } from '../../menu/entities/menu.entity';

export class CreateOrderDto {
  @IsNotEmpty()
  items: Item[];

  @IsNotEmpty()
  menu: Menu;
}

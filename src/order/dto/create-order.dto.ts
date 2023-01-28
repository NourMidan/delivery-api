import { IsNotEmpty } from 'class-validator';
import { Item } from 'src/item/entities/item.entity';
import { Menu } from 'src/menu/entities/menu.entity';

export class CreateOrderDto {
  @IsNotEmpty()
  items: Item[];

  @IsNotEmpty()
  menu: Menu;
}

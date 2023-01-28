import { IsNotEmpty, IsString, MinLength, MaxLength } from 'class-validator';
import { Categories } from 'src/menu/entities/menu.entity';

export class CreateOwnerDto {
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  name: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  password: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  menuName: string;

  @IsNotEmpty()
  category: Categories[];
}

export class GetRestaurantsFilterDto {
  search: string;
  category: string;
}

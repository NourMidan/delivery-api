import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateItemDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  name: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  description: string;
}

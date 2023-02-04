import { IsNotEmpty, IsString, MinLength, MaxLength } from 'class-validator';

export class CreateClientDto {
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  password: string;
}

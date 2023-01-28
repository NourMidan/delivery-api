import { Controller } from '@nestjs/common';
import { OwnersService } from './owners.service';

@Controller('owners')
export class OwnersController {
  constructor(private readonly ownersService: OwnersService) {}

  // @Post('/signin')
  // signIn(@Body() loginOwnerDto: LoginOwnerDto) {
  //   return this.ownersService.signIn(loginOwnerDto);
  // }

  // @Get('validate')
  // @UseGuards(AuthGuard())
  // getProfile(@GetUser() owner: Owner) {
  //   return owner;
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.ownersService.findOne(id);
  // }
}

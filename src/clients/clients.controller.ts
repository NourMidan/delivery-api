import { Controller } from '@nestjs/common';
import { ClientsService } from './clients.service';
@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  // @Post('/signin')
  // signIn(@Body() loginClientDto: LoginClientDto) {
  //   return this.clientsService.signIn(loginClientDto);
  // }

  // @Get('validate')
  // @UseGuards(AuthGuard())
  // getProfile(@Request() req, @GetUser() client: Client) {
  //   return client;
  // }
}

import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ClientsService } from 'src/clients/clients.service';
import { CreateOwnerDto } from 'src/auth/dto/create-owner.dto';
import { OwnersService } from 'src/owners/owners.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/entities/user.entity';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly ownersService: OwnersService,
    private readonly clientsService: ClientsService,
  ) {}

  @Post('register/owner')
  public async registerAsOwner(@Body() body: CreateOwnerDto): Promise<User> {
    return await this.ownersService.signUp(body, 'owner');
  }

  @Post('register/client')
  public async registerAsClient(@Body() body: CreateUserDto): Promise<User> {
    return await this.clientsService.signUp(body, 'client');
  }
  @UseGuards(LocalAuthGuard)
  @Post('login')
  public async login(@Request() req) {
    return await this.authService.signIn(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('validate')
  public getUserInfo(@Request() req): User {
    return req.user;
  }
}

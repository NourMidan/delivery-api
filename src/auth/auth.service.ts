import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt/dist';
import { ClientsService } from '../clients/clients.service';
import { OwnersService } from '../owners/owners.service';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { UsersService } from '../users/users.service';
import { UserWithUserable } from './auth-interfaces';
@Injectable()
export class AuthService {
  constructor(
    private readonly jwt: JwtService,
    private readonly clientsService: ClientsService,
    private readonly ownerService: OwnersService,
    private readonly usersService: UsersService,
  ) {}

  async validateUserCredentials(loginUserDto: LoginUserDto) {
    const { password, username: email } = loginUserDto;

    const findUser = await this.usersService.findOneByEmail(email);
    if (!findUser) throw new NotFoundException('user  does not exist');
    if (!(await bcrypt.compare(password, findUser.password))) {
      throw new UnauthorizedException('wrong credentials');
    } else {
      const { password, ...user } = findUser;

      return user;
    }
  }

  async signIn(user: UserWithUserable) {
    if (user.targetType === 'client') {
      user.userable = await this.clientsService.findOneById(user.targetId);
    } else if (user.targetType === 'owner') {
      user.userable = await this.ownerService.findOneById(user.targetId);
    }
    const payload = { id: user.id };
    const token = this.jwt.sign(payload);

    return { ...user, token };
  }

  async validateUser(id: string): Promise<UserWithUserable> {
    let user: UserWithUserable;
    const findUser = await this.usersService.findOneById(id);
    if (!findUser) return null;

    if (findUser.targetType === 'client') {
      const userable = await this.clientsService.findOneById(findUser.targetId);
      user = { ...findUser, userable };
    } else if (findUser.targetType === 'owner') {
      const userable = await this.ownerService.findOneById(findUser.targetId);
      user = { ...findUser, userable };
    }
    const { password, ...result } = user;
    return result as UserWithUserable;
  }
}

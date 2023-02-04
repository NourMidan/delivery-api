import { Injectable } from '@nestjs/common';
import { Client } from './entities/client.entity';
import { BadRequestException } from '@nestjs/common/exceptions';
import { JwtService } from '@nestjs/jwt/dist';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { ClientsRepository } from './clients.respository';
import { CartsRepository } from '../cart/carts.respository';
import { UserWithUserable } from 'src/auth/auth-interfaces';

@Injectable()
export class ClientsService {
  constructor(
    private clientsRepository: ClientsRepository,
    private cartRepository: CartsRepository,
    private usersService: UsersService,
  ) {}

  async signUp(
    createClientDto: CreateUserDto,
    type: string,
  ): Promise<UserWithUserable> {
    const user = await this.usersService.findOneByEmail(createClientDto.email);
    if (user) {
      throw new BadRequestException('This email is already registered!');
    }
    const client = await this.createClient();

    const userData = await this.usersService.create(
      createClientDto,
      client.id,
      type,
    );

    const userPayload: UserWithUserable = {
      ...userData,
      userable: client,
    };

    return userPayload;
  }

  async createClient(): Promise<Client> {
    // creating cart for new client
    const newCart = this.cartRepository.create({ items: [] });
    const cart = await this.cartRepository.save(newCart);

    const newClient = this.clientsRepository.create({
      // name,
      cart,
      orders: [],
    });

    let client: Client;
    try {
      client = await this.clientsRepository.save(newClient);
    } catch (error) {
      return error.message;
    }

    return client;
  }

  async findOneById(id: string): Promise<Client> {
    return await this.clientsRepository.findOneBy({ id });
  }

  // async signIn(loginClientDto: LoginClientDto): Promise<ClientData> {
  //   const { email, password } = loginClientDto;
  //   const client = await this.clientsRepository.findOneBy({ email });

  //   if (client && (await bcrypt.compare(password, client.password))) {
  //     const { password, ...result } = client;
  //     const payload = { id: result.id };
  //     const token = this.jwt.sign(payload);
  //     return { ...result, token };
  //   } else {
  //     throw new UnauthorizedException('wrong credntioals');
  //   }
  // }
}

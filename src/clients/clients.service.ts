import { Injectable } from '@nestjs/common';
import { Client } from './entities/client.entity';
import { BadRequestException } from '@nestjs/common/exceptions';
import { JwtService } from '@nestjs/jwt/dist';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { ClientsRepository } from './clients.respository';
import { CartsRepository } from 'src/cart/carts.respository';

@Injectable()
export class ClientsService {
  constructor(
    private clientsRepository: ClientsRepository,
    private cartRepository: CartsRepository,
    private jwt: JwtService,
    private usersService: UsersService,
  ) {}

  async signUp(createUserDto: CreateUserDto, type: string): Promise<User> {
    const user = await this.usersService.findOneByEmail(createUserDto.email);
    if (user) {
      throw new BadRequestException('This email is already registered!');
    }
    const client = await this.createClient();

    return await this.usersService.create(createUserDto, client, type);
  }

  async createClient(): Promise<Client> {
    // creating cart for new client
    const newCart = this.cartRepository.create();
    const cart = await this.cartRepository.save(newCart);

    const newClient = this.clientsRepository.create({
      // name,
      cart,
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

import { ConflictException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateOwnerDto } from '../auth/dto/create-owner.dto';
import { Owner } from './entities/owner.entity';
import {
  BadRequestException,
  NotFoundException,
} from '@nestjs/common/exceptions';
import { Categories } from 'src/menu/entities/menu.entity';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';
import { MenusRepository } from 'src/menu/menu.respository';
import { OwnersRepository } from './owners.respository';

@Injectable()
export class OwnersService {
  constructor(
    private readonly ownersRepository: OwnersRepository,
    private readonly menuRepository: MenusRepository,
    private usersService: UsersService,

    private jwt: JwtService,
  ) {}

  async signUp(createOwnerDto: CreateOwnerDto, type: string): Promise<User> {
    const user = await this.usersService.findOneByEmail(createOwnerDto.email);
    if (user) {
      throw new BadRequestException('This email is already registered!');
    }
    const Owner = await this.createOwner(createOwnerDto);

    return await this.usersService.create(createOwnerDto, Owner, type);
  }

  async createOwner(createOwnerDto: CreateOwnerDto): Promise<Owner> {
    const { menuName, category } = createOwnerDto;

    //check if categories match the enum

    function isCategories(value: string): value is Categories {
      return Object.values<string>(Categories).includes(value);
    }

    const checkMenu = await this.menuRepository.findOne({
      where: { name: menuName },
    });
    if (checkMenu) {
      throw new ConflictException('menu with this name already exist');
    }

    category.forEach((item) => {
      if (!isCategories(item)) {
        throw new ConflictException('unvalid categories');
      }
    });

    // creating Menu for new owner
    const newMenu = this.menuRepository.create({
      name: menuName,
      category,
    });
    const menu = await this.menuRepository.save(newMenu);

    const newOwner = this.ownersRepository.create({
      menu,
    });

    let owner: Owner;
    try {
      owner = await this.ownersRepository.save(newOwner);
    } catch (error) {
      if (error.code === '23505') {
        const message =
          error.detail.match(/\(([^)]+)\)/)[1] + ' already Exists';
        throw new ConflictException(message);
      } else {
        return error.message;
      }
    }

    return owner;
  }
  // async signIn(loginOwnerDto: LoginOwnerDto): Promise<OwnerData> {
  //   const { name, password } = loginOwnerDto;
  //   const owner = await this.ownersRepository.findOneBy({ name });
  //   if (owner && (await bcrypt.compare(password, owner.password))) {
  //     const { password, ...result } = owner;
  //     const payload = { id: result.id, type: 'owner' };
  //     const token = this.jwt.sign(payload);
  //     return { ...result, token };
  //   } else {
  //     throw new UnauthorizedException('wrong credntioals');
  //   }
  // }

  async findOneById(id: string) {
    let owner: Owner;

    // check if uuid syntax valid
    try {
      owner = await this.ownersRepository.findOne({
        where: { id },
        relations: { menu: { orders: true } },
      });
    } catch (error) {
      throw new ConflictException('Invalid Id');
    }

    if (!owner) {
      throw new NotFoundException(`owner with id ${id} not found`);
    }
    return owner;
  }
}

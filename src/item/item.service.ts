import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserWithUserable } from '../auth/auth-interfaces';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { ItemsRepository } from './items.respository';

@Injectable()
export class ItemService {
  constructor(private itemRepository: ItemsRepository) {}

  async create(createItemDto: CreateItemDto, owner: UserWithUserable) {
    const { name, description } = createItemDto;
    const item = this.itemRepository.create({
      name,
      description,
      // owner.userable.menu  not working
      menu: owner.userable['menu'],
    });
    try {
      return await this.itemRepository.save(item);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        const message = 'item already Exists';
        throw new ConflictException(message);
      }
    }
  }

  async findOne(id: string) {
    return await this.itemRepository.findOneBy({ id });
  }

  async update(
    id: string,
    updateItemDto: UpdateItemDto,
    owner: UserWithUserable,
  ) {
    const { name, description } = updateItemDto;
    const item = await this.itemRepository.findOne({
      where: { id },
      relations: { menu: true },
    });

    if (owner.userable['menu'].id !== item.menu.id) {
      throw new UnauthorizedException('unauthorized');
    } else {
      await this.itemRepository.update(id, { name, description });
      return await this.itemRepository.findOne({ where: { id } });
    }
  }

  async remove(id: string, owner: UserWithUserable) {
    const item = await this.itemRepository.findOne({
      where: { id },
      relations: { menu: true },
    });

    if (owner.userable['menu'].id !== item.menu.id) {
      throw new UnauthorizedException('unauthorized');
    } else {
      return await this.itemRepository.delete(id);
    }
  }
}

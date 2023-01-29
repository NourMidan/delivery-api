import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ItemService } from './item.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { GetUser } from '../auth/user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OwnerAuthGuard } from '../auth/guards/owner-auth.guard';
import { UserWithUserable } from '../auth/auth-interfaces';

@Controller('item')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @UseGuards(JwtAuthGuard)
  @UseGuards(OwnerAuthGuard)
  @Post('/create')
  create(
    @Body() createItemDto: CreateItemDto,
    @GetUser() owner: UserWithUserable,
  ) {
    return this.itemService.create(createItemDto, owner);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.itemService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @UseGuards(OwnerAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateItemDto: UpdateItemDto,
    @GetUser() owner: UserWithUserable,
  ) {
    return this.itemService.update(id, updateItemDto, owner);
  }

  @UseGuards(JwtAuthGuard)
  @UseGuards(OwnerAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @GetUser() owner: UserWithUserable) {
    return this.itemService.remove(id, owner);
  }
}

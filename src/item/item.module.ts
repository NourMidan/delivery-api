import { Module } from '@nestjs/common';
import { ItemService } from './item.service';
import { ItemController } from './item.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Item } from './entities/item.entity';
import { AuthModule } from '../auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { ItemsRepository } from './items.respository';

@Module({
  controllers: [ItemController],
  providers: [ItemService, ItemsRepository],
  imports: [
    TypeOrmModule.forFeature([Item]),
    AuthModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
})
export class ItemModule {}

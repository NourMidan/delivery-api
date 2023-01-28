import { Module } from '@nestjs/common';
import { MenuService } from './menu.service';
import { MenuController } from './menu.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Menu } from './entities/menu.entity';
import { MenusRepository } from './menu.respository';

@Module({
  controllers: [MenuController],
  providers: [MenuService, MenusRepository],
  imports: [TypeOrmModule.forFeature([Menu])],
})
export class MenuModule {}

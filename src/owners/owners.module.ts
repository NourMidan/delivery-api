import { Module } from '@nestjs/common';
import { OwnersService } from './owners.service';
import { OwnersController } from './owners.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { Owner } from './entities/owner.entity';
import { AuthModule } from 'src/auth/auth.module';
import { Menu } from 'src/menu/entities/menu.entity';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';
import { OwnersRepository } from './owners.respository';
import { MenusRepository } from 'src/menu/menu.respository';
import { UsersRepository } from 'src/users/users.respository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Owner, Menu, User]),
    AuthModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'secret701',
      signOptions: {
        expiresIn: 7776000,
      },
    }),
  ],
  controllers: [OwnersController],
  providers: [
    OwnersService,
    UsersService,
    OwnersRepository,
    MenusRepository,
    UsersRepository,
  ],
  exports: [OwnersService],
})
export class OwnersModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OwnersModule } from './owners/owners.module';
import { CartModule } from './cart/cart.module';
import { OrderModule } from './order/order.module';
import { MenuModule } from './menu/menu.module';
import { ItemModule } from './item/item.module';
import { AuthModule } from './auth/auth.module';
import { ClientsModule } from './clients/clients.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import configurations from './config/configurations';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    ClientsModule,
    
    ConfigModule.forRoot({
      load: [configurations],

    }),
    // TypeOrmModule.forRoot({
    //   type: 'mysql',
    //   host: 'localhost',
    //   port: 3306,
    //   username: 'root',
    //   password: 'password',
    //   database: 'delivery',
    //   entities: ['dist/**/*.entity.js'],
    //   synchronize: true,
    // }),
    OwnersModule,
    CartModule,
    OrderModule,
    MenuModule,
    ItemModule,
    AuthModule,
    UsersModule,
    DatabaseModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

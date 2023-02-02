import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfig } from './dbConfig';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const db =
          configService.get<string>('NODE_ENV') === 'test'
            ? 'testDB'
            : 'database';
        
          console.log(db);        
            return {
          autoLoadEntities: true,
          entities: ['dist/**/*.entity.js'],
          type: 'mysql',
          ...configService.get<DatabaseConfig>(db),
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}

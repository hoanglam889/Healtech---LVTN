import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    // 1. Load file cấu hình .env
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // 2. Cấu hình kết nối MySQL thông qua TypeORM
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306', 10),
      username: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_DATABASE,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // Tự động đồng bộ các Entity (Model) vào DB - Rất tiện khi phát triển
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

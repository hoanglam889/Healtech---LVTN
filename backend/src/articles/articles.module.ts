import { Module } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { ArticlesController } from './articles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Articles } from '../entities/Articles';

@Module({
  imports: [TypeOrmModule.forFeature([Articles])],
  controllers: [ArticlesController],
  providers: [ArticlesService],
})
export class ArticlesModule {}

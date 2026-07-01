import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Articles } from '../entities/Articles';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Articles)
    private readonly articlesRepo: Repository<Articles>,
  ) {}

  create(createArticleDto: any) {
    const article = this.articlesRepo.create(createArticleDto);
    return this.articlesRepo.save(article);
  }

  findAll(isPublishedOnly?: boolean) {
    const whereCondition = isPublishedOnly ? { isPublished: true } : {};
    return this.articlesRepo.find({
      where: whereCondition,
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number) {
    const article = await this.articlesRepo.findOne({ where: { id } });
    if (!article) {
      throw new NotFoundException(`Article #${id} not found`);
    }
    return article;
  }

  async update(id: number, updateArticleDto: any) {
    const article = await this.findOne(id);
    const updated = Object.assign(article, updateArticleDto);
    return this.articlesRepo.save(updated);
  }

  async remove(id: number) {
    const article = await this.findOne(id);
    return this.articlesRepo.remove(article);
  }
}

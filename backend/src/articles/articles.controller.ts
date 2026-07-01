import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ArticlesService } from './articles.service';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Post()
  create(@Body() createArticleDto: any) {
    return this.articlesService.create(createArticleDto);
  }

  @Get()
  findAll(@Query('publishedOnly') publishedOnly: string) {
    const isPublishedOnly = publishedOnly === 'true';
    return this.articlesService.findAll(isPublishedOnly);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.articlesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateArticleDto: any) {
    return this.articlesService.update(+id, updateArticleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.articlesService.remove(+id);
  }
}

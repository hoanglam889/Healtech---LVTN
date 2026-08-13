import { Repository } from 'typeorm';
import { Articles } from '../entities/Articles';
export declare class ArticlesService {
    private readonly articlesRepo;
    constructor(articlesRepo: Repository<Articles>);
    create(createArticleDto: any): Promise<Articles[]>;
    findAll(isPublishedOnly?: boolean): Promise<Articles[]>;
    findOne(id: number): Promise<Articles>;
    update(id: number, updateArticleDto: any): Promise<any>;
    remove(id: number): Promise<Articles>;
}

import { ArticlesService } from './articles.service';
export declare class ArticlesController {
    private readonly articlesService;
    constructor(articlesService: ArticlesService);
    create(createArticleDto: any): Promise<import("../entities/Articles").Articles[]>;
    findAll(publishedOnly: string): Promise<import("../entities/Articles").Articles[]>;
    findOne(id: string): Promise<import("../entities/Articles").Articles>;
    update(id: string, updateArticleDto: any): Promise<any>;
    remove(id: string): Promise<import("../entities/Articles").Articles>;
}

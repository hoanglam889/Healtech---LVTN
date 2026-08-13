"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArticlesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const Articles_1 = require("../entities/Articles");
let ArticlesService = class ArticlesService {
    articlesRepo;
    constructor(articlesRepo) {
        this.articlesRepo = articlesRepo;
    }
    create(createArticleDto) {
        const article = this.articlesRepo.create(createArticleDto);
        return this.articlesRepo.save(article);
    }
    findAll(isPublishedOnly) {
        const whereCondition = isPublishedOnly ? { is_published: true } : {};
        return this.articlesRepo.find({
            where: whereCondition,
            relations: { user: true },
            order: { created_at: 'DESC' },
        });
    }
    async findOne(id) {
        const article = await this.articlesRepo.findOne({
            where: { id },
            relations: { user: true },
        });
        if (!article) {
            throw new common_1.NotFoundException(`Article #${id} not found`);
        }
        return article;
    }
    async update(id, updateArticleDto) {
        const article = await this.findOne(id);
        const updated = Object.assign(article, updateArticleDto);
        return this.articlesRepo.save(updated);
    }
    async remove(id) {
        const article = await this.findOne(id);
        return this.articlesRepo.remove(article);
    }
};
exports.ArticlesService = ArticlesService;
exports.ArticlesService = ArticlesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(Articles_1.Articles)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ArticlesService);
//# sourceMappingURL=articles.service.js.map
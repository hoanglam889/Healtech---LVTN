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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Articles = void 0;
const typeorm_1 = require("typeorm");
const Users_1 = require("./Users");
let Articles = class Articles {
    id;
    title;
    category;
    content;
    image_url;
    author_name;
    is_published;
    created_at;
    updated_at;
    user_id;
    user;
};
exports.Articles = Articles;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Articles.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { length: 255 }),
    __metadata("design:type", String)
], Articles.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { length: 100 }),
    __metadata("design:type", String)
], Articles.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.Column)('longtext'),
    __metadata("design:type", String)
], Articles.prototype, "content", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { name: 'image_url', nullable: true }),
    __metadata("design:type", String)
], Articles.prototype, "image_url", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'author_name', length: 100, nullable: true }),
    __metadata("design:type", String)
], Articles.prototype, "author_name", void 0);
__decorate([
    (0, typeorm_1.Column)('boolean', { name: 'is_published', default: true }),
    __metadata("design:type", Boolean)
], Articles.prototype, "is_published", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Articles.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Articles.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { name: 'user_id', nullable: true }),
    __metadata("design:type", Number)
], Articles.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Users_1.Users, (users) => users.articles, {
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)([{ name: 'user_id', referencedColumnName: 'id' }]),
    __metadata("design:type", Users_1.Users)
], Articles.prototype, "user", void 0);
exports.Articles = Articles = __decorate([
    (0, typeorm_1.Entity)('articles')
], Articles);
//# sourceMappingURL=Articles.js.map
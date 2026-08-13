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
exports.Notifications = void 0;
const typeorm_1 = require("typeorm");
const PatientAccounts_1 = require("./PatientAccounts");
let Notifications = class Notifications {
    id;
    patientAccountId;
    title;
    content;
    isRead;
    createdAt;
    patientAccount;
};
exports.Notifications = Notifications;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'int', name: 'id' }),
    __metadata("design:type", Number)
], Notifications.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { name: 'patient_account_id' }),
    __metadata("design:type", Number)
], Notifications.prototype, "patientAccountId", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'title', length: 255 }),
    __metadata("design:type", String)
], Notifications.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { name: 'content' }),
    __metadata("design:type", String)
], Notifications.prototype, "content", void 0);
__decorate([
    (0, typeorm_1.Column)('tinyint', {
        name: 'is_read',
        nullable: true,
        width: 1,
        default: '0',
    }),
    __metadata("design:type", Object)
], Notifications.prototype, "isRead", void 0);
__decorate([
    (0, typeorm_1.Column)('timestamp', {
        name: 'created_at',
        default: () => 'CURRENT_TIMESTAMP',
    }),
    __metadata("design:type", Date)
], Notifications.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => PatientAccounts_1.PatientAccounts, (patientAccounts) => patientAccounts.notifications, { onDelete: 'CASCADE', onUpdate: 'RESTRICT' }),
    (0, typeorm_1.JoinColumn)([{ name: 'patient_account_id', referencedColumnName: 'id' }]),
    __metadata("design:type", PatientAccounts_1.PatientAccounts)
], Notifications.prototype, "patientAccount", void 0);
exports.Notifications = Notifications = __decorate([
    (0, typeorm_1.Index)('patient_account_id', ['patientAccountId'], {}),
    (0, typeorm_1.Entity)('notifications', { schema: 'clinic_flow_erp' })
], Notifications);
//# sourceMappingURL=Notifications.js.map
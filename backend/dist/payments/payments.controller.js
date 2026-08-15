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
exports.PaymentsController = void 0;
const common_1 = require("@nestjs/common");
const public_decorator_1 = require("../auth/public.decorator");
const payments_service_1 = require("./payments.service");
let PaymentsController = class PaymentsController {
    paymentsService;
    constructor(paymentsService) {
        this.paymentsService = paymentsService;
    }
    async createPaymentUrl(invoiceId, amount, source) {
        if (!invoiceId) {
            throw new common_1.BadRequestException('Mã hóa đơn không được để trống');
        }
        const url = await this.paymentsService.createPaymentUrl(invoiceId, amount, source);
        return { url };
    }
    async vnpayReturn(query, res) {
        const source = query.source || 'reception';
        const result = await this.paymentsService.vnpayReturn(query);
        const baseUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        const frontendUrl = `${baseUrl}/payment-result?status=${result.status}&invoiceId=${result.invoiceId}&amount=${result.amount}&message=${encodeURIComponent(result.message)}&source=${source}`;
        return res.redirect(frontendUrl);
    }
};
exports.PaymentsController = PaymentsController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('create-payment-url'),
    __param(0, (0, common_1.Body)('invoiceId')),
    __param(1, (0, common_1.Body)('amount')),
    __param(2, (0, common_1.Body)('source')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, String]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "createPaymentUrl", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('vnpay-return'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "vnpayReturn", null);
exports.PaymentsController = PaymentsController = __decorate([
    (0, common_1.Controller)('payments'),
    __metadata("design:paramtypes", [payments_service_1.PaymentsService])
], PaymentsController);
//# sourceMappingURL=payments.controller.js.map
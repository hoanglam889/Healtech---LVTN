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
exports.AiService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const Specialties_1 = require("../entities/Specialties");
const generative_ai_1 = require("@google/generative-ai");
const config_1 = require("@nestjs/config");
let AiService = class AiService {
    specialtiesRepo;
    configService;
    genAI;
    constructor(specialtiesRepo, configService) {
        this.specialtiesRepo = specialtiesRepo;
        this.configService = configService;
        const apiKey = this.configService.get('GEMINI_API_KEY');
        if (!apiKey) {
            console.error('GEMINI_API_KEY is not set in environment variables.');
        }
        this.genAI = new generative_ai_1.GoogleGenerativeAI(apiKey || 'MISSING_API_KEY');
    }
    async recommendSpecialties(symptoms) {
        try {
            const specialties = await this.specialtiesRepo.find({
                select: {
                    id: true,
                    name: true,
                    description: true,
                },
            });
            const specialtiesList = specialties.map(s => `- ID: ${s.id}, Tên: ${s.name}, Mô tả: ${s.description || 'Không có'}`).join('\n');
            const prompt = `
Bạn là một trợ lý y tế thông minh của phòng khám Healtech.
Bệnh nhân đang có triệu chứng sau: "${symptoms}"

Dựa vào danh sách chuyên khoa của phòng khám dưới đây:
${specialtiesList}

Hãy phân tích và gợi ý TỐI ĐA 3 chuyên khoa phù hợp nhất với triệu chứng của bệnh nhân.
Lưu ý: Bạn KHÔNG ĐƯỢC CHẨN ĐOÁN bệnh, chỉ gợi ý chuyên khoa để người bệnh đăng ký khám. Nếu triệu chứng không rõ ràng hoặc độ tin cậy thấp, hãy ưu tiên gợi ý chuyên khoa "Nội tổng quát" (nếu có).

Bạn CHỈ ĐƯỢC PHÉP trả về kết quả dưới định dạng JSON theo schema sau, không kèm bất kỳ đoạn text nào khác ngoài JSON:
{
  "suggestions": [
    {
      "specialty_id": 1,
      "confidence": 90,
      "reason": "Giải thích ngắn gọn lý do tại sao triệu chứng này cần khám chuyên khoa này."
    }
  ]
}`;
            const model = this.genAI.getGenerativeModel({
                model: "gemini-2.5-flash",
                generationConfig: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: generative_ai_1.SchemaType.OBJECT,
                        properties: {
                            suggestions: {
                                type: generative_ai_1.SchemaType.ARRAY,
                                items: {
                                    type: generative_ai_1.SchemaType.OBJECT,
                                    properties: {
                                        specialty_id: { type: generative_ai_1.SchemaType.INTEGER },
                                        confidence: { type: generative_ai_1.SchemaType.INTEGER },
                                        reason: { type: generative_ai_1.SchemaType.STRING },
                                    },
                                    required: ["specialty_id", "confidence", "reason"],
                                },
                            },
                        },
                        required: ["suggestions"],
                    },
                },
            });
            let result;
            try {
                for (let attempt = 1; attempt <= 2; attempt++) {
                    try {
                        const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout kết nối tới Gemini API')), 15000));
                        result = await Promise.race([
                            model.generateContent(prompt),
                            timeoutPromise
                        ]);
                        break;
                    }
                    catch (err) {
                        console.error(`Lỗi Gemini API (lần ${attempt}/2):`, err.message || err);
                        if (attempt === 2)
                            throw err;
                        await new Promise(resolve => setTimeout(resolve, 1000));
                    }
                }
                const text = result.response.text();
                let cleanText = text.replace(/```json/gi, '').replace(/```/g, '').trim();
                const parsed = JSON.parse(cleanText);
                if (parsed.suggestions && Array.isArray(parsed.suggestions)) {
                    parsed.suggestions = parsed.suggestions.map(s => {
                        const spec = specialties.find(sp => sp.id === s.specialty_id);
                        return {
                            ...s,
                            specialty_name: spec ? spec.name : 'Nội tổng quát',
                            specialty_icon: spec ? spec.icon : null,
                        };
                    });
                }
                return parsed;
            }
            catch (geminiError) {
                console.error('Lỗi Gemini API hoặc Parse JSON, kích hoạt Fallback:', geminiError.message || geminiError);
                return {
                    suggestions: [
                        {
                            specialty_id: specialties.length > 0 ? specialties[0].id : 1,
                            confidence: 50,
                            reason: "Hệ thống AI đang quá tải hoặc mất kết nối. Dựa trên triệu chứng, chúng tôi tạm thời đề xuất chuyên khoa này. Vui lòng liên hệ lễ tân để được tư vấn chính xác hơn.",
                            specialty_name: specialties.length > 0 ? specialties[0].name : 'Nội tổng quát',
                            specialty_icon: null
                        }
                    ]
                };
            }
        }
        catch (error) {
            console.error('Lỗi hệ thống Database/Khởi tạo AI Service:', error);
            throw new common_1.InternalServerErrorException('Không thể kết nối tới dịch vụ AI');
        }
    }
};
exports.AiService = AiService;
exports.AiService = AiService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(Specialties_1.Specialties)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        config_1.ConfigService])
], AiService);
//# sourceMappingURL=ai.service.js.map
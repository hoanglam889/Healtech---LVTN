import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Specialties } from '../entities/Specialties';
import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AiService {
  private genAI: GoogleGenerativeAI;

  constructor(
    @InjectRepository(Specialties)
    private specialtiesRepo: Repository<Specialties>,
    private configService: ConfigService,
  ) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (!apiKey) {
      console.error('GEMINI_API_KEY is not set in environment variables.');
    }
    this.genAI = new GoogleGenerativeAI(apiKey || 'MISSING_API_KEY');
  }

  async recommendSpecialties(symptoms: string) {
    try {
      const specialties = await this.specialtiesRepo.find({
        select: {
          id: true,
          name: true,
          description: true,
        },
      });

      // Prepare data for the prompt
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

      // Gemini configuration for structured JSON output
      const model = this.genAI.getGenerativeModel({
        model: "gemini-flash-latest",
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: {
            type: SchemaType.OBJECT,
            properties: {
              suggestions: {
                type: SchemaType.ARRAY,
                items: {
                  type: SchemaType.OBJECT,
                  properties: {
                    specialty_id: { type: SchemaType.INTEGER },
                    confidence: { type: SchemaType.INTEGER },
                    reason: { type: SchemaType.STRING },
                  },
                  required: ["specialty_id", "confidence", "reason"],
                },
              },
            },
            required: ["suggestions"],
          },
        },
      });

      try {
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        let cleanText = text.replace(/```json/gi, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleanText);

        // Gắn thêm tên và icon của chuyên khoa vào kết quả
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
      } catch (geminiError) {
        console.error('Lỗi từ Google Gemini API hoặc khi Parse JSON:', geminiError);
        // Fallback an toàn nếu AI lỗi (trả về JSON mặc định để không bị 500)
        return {
          suggestions: [
            {
              specialty_id: specialties.length > 0 ? specialties[0].id : 1,
              confidence: 50,
              reason: "Hệ thống AI đang quá tải. Dựa trên triệu chứng, chúng tôi tạm thời đề xuất chuyên khoa này. Vui lòng liên hệ lễ tân để được tư vấn chính xác hơn.",
              specialty_name: specialties.length > 0 ? specialties[0].name : 'Nội tổng quát',
              specialty_icon: null
            }
          ]
        };
      }
    } catch (error) {
      console.error('Lỗi hệ thống AI Service:', error);
      throw new InternalServerErrorException('Không thể kết nối tới dịch vụ AI');
    }
  }
}

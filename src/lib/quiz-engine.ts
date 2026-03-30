import { GoogleGenerativeAI } from '@google/generative-ai';

const QUIZ_SYSTEM_PROMPT = `Bạn là một CHUYÊN GIA GIÁO DỤC, NHÀ NGHIÊN CỨU VĂN HÓA VÀ LỊCH SỬ tại xã Phú Vinh, Thừa Thiên Huế.
Nhiệm vụ của bạn là tự động tạo ra một bộ câu hỏi trắc nghiệm và trò chơi học tập thú vị, đa dạng và sâu sắc mang tên "Hành Trình Khám Phá Di Sản Phú Vinh".

CHỦ ĐỀ BẮT BUỘC (Dựa trên sườn của ame.html và hoa.html):
- Vòng 1 (Matching): Kiến thức về Đình làng Hà Thanh (Lịch sử, kiến trúc, ý nghĩa, văn hóa).
- Vòng 2 (True/False): Sự thật lịch sử và khảo cổ về Tháp Chăm Phú Diên.
- Vòng 3 (Multiple Choice): Đặc điểm, tiềm năng du lịch và vấn đề bảo vệ môi trường Biển Phú Diên.

Hãy kết hợp các kiến thức thực tế cực kỳ chính xác về 3 địa danh trên để sinh ra bộ câu hỏi mới mẻ mỗi lần chạy. KHÔNG YÊU CẦU NGƯỜI DÙNG CUNG CẤP CHỦ ĐỀ VÌ ĐÂY LÀ CHỦ ĐỀ CỐ ĐỊNH!

Yêu cầu định dạng đầu ra:
Bạn PHẢI trả về ĐÚNG MỘT khối dữ liệu JSON thuần túy (RAW JSON), KHÔNG CÓ BẤT KỲ VĂN BẢN NÀO KHÁC. KHÔNG BỌC JSON TRONG BẤT KỲ THẺ MARKDOWN NÀO.

Cấu trúc JSON đầu ra:
{
  "round1": [
    // Đúng 8 cặp ghép (Matching) về Đình làng Hà Thanh
    { "left": "vế trái ngắn gọn (tối đa 6 chữ)", "right": "vế phải giải nghĩa (tối đa 12 chữ)" },
    ...
  ],
  "round2": [
    // Đúng 8 câu hỏi Đúng/Sai (True/False) về Tháp Chăm Phú Diên
    { "q": "nhận định", "ans": true },
    { "q": "nhận định", "ans": false },
    ...
  ],
  "round3": [
    // Đúng 8 câu hỏi trắc nghiệm (Multiple Choice) về Biển Phú Diên
    { 
      "q": "Câu hỏi chi tiết", 
      "opts": ["Đáp án A", "Đáp án B", "Đáp án C", "Đáp án D"], 
      "ans": 0, // Vị trí đáp án đúng (0, 1, 2, 3) 
      "exp": "Giải thích tại sao đáp án đó đúng" 
    },
    ...
  ]
}
`;

function getGenAI(): GoogleGenerativeAI {
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error('GOOGLE_GEMINI_API_KEY is not set');
    }
    return new GoogleGenerativeAI(apiKey);
}

export async function generateLearningQuiz(): Promise<string> {
    const ai = getGenAI();
    const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `${QUIZ_SYSTEM_PROMPT}\n\nHãy tạo NGAY một bộ câu hỏi KHÔNG TRÙNG LẶP cho Hành Trình Khám Phá Di Sản Phú Vinh (Đình Hà Thanh, Tháp Chăm Phú Diên, Biển Phú Diên).`;

    try {
        const result = await model.generateContent(prompt);
        let text = result.response.text();
        
        // Clean up markdown markers if the AI still included them
        if (text.startsWith('```json')) text = text.replace(/^```json/, '');
        if (text.startsWith('```')) text = text.replace(/^```/, '');
        if (text.endsWith('```')) text = text.replace(/```$/, '');
        
        return text.trim();
    } catch (error) {
        console.error('Quiz generation error:', error);
        throw new Error('Không thể tạo bộ câu hỏi. Vui lòng thử lại.');
    }
}

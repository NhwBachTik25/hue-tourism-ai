const fs = require('fs');
const https = require('https');

// Get API key
let apiKeys = [];
try {
    const env = fs.readFileSync('.env.local', 'utf-8');
    
    // Check GEMINI_API_KEYS
    const matchKeys = env.match(/GEMINI_API_KEYS=(.*?)(?:\n|$)/);
    if (matchKeys && matchKeys[1].trim()) {
        apiKeys = matchKeys[1].split(',').map(k => k.trim()).filter(k => k.length > 0);
    } 
    
    // Fallback to GOOGLE_GEMINI_API_KEY
    if (apiKeys.length === 0) {
        const matchSingle = env.match(/GOOGLE_GEMINI_API_KEY=(.*?)(?:\n|$)/);
        if (matchSingle && matchSingle[1].trim()) {
            apiKeys = matchSingle[1].split(',').map(k => k.trim()).filter(k => k.length > 0);
        }
    }
} catch (e) {
    console.error('Could not read .env.local:', e.message);
}

if (apiKeys.length === 0) {
    if (process.env.GEMINI_API_KEYS) {
        apiKeys = process.env.GEMINI_API_KEYS.split(',').map(k => k.trim()).filter(k => k.length > 0);
    } else if (process.env.GOOGLE_GEMINI_API_KEY) {
        apiKeys = process.env.GOOGLE_GEMINI_API_KEY.split(',').map(k => k.trim()).filter(k => k.length > 0);
    }
}

if (apiKeys.length === 0) {
    console.error('NO API KEY');
    process.exit(1);
}

function getRandomApiKey() {
    return apiKeys[Math.floor(Math.random() * apiKeys.length)];
}

const QUIZ_SYSTEM_PROMPT = `Bạn là một CHUYÊN GIA GIÁO DỤC, NHÀ NGHIÊN CỨU VĂN HÓA VÀ LỊCH SỬ tại xã Phú Vinh, Thừa Thiên Huế.
Nhiệm vụ của bạn là sinh ra một bộ câu hỏi trắc nghiệm hoàn toàn ngẫu nhiên và mới mẻ mang tên "Hành Trình Khám Phá Di Sản Phú Vinh".

Vòng 1 (Matching): 8 câu về Đình làng Hà Thanh (Lịch sử, kiến trúc, văn hóa).
Vòng 2 (True/False): 8 câu về Tháp Chăm Phú Diên.
Vòng 3 (Multiple Choice): 8 câu về Biển Phú Diên, Làng nghề hoặc Lăng mộ An Bằng.

BẠN PHẢI SINH RA CÁC CÂU HỎI KHÔNG ĐƯỢC LẶP LẠI SO VỚI CÁC PHIÊN BẢN TRƯỚC. CHẤT LƯỢNG CAO, CÂU HỎI SÂU SẮC. ĐẢM BẢO EXACT JSON.
TRẢ VỀ ĐÚNG MỘT KHỐI DỮ LIỆU RAW JSON (KHÔNG CÓ MARKDOWN, KHÔNG CÓ LỜI CHÀO).

Cấu trúc:
{
  "round1": [
    { "left": "vế trái ngắn gọn", "right": "vế phải cực chuẩn" }
  ],
  "round2": [
    { "q": "nhận định đúng sai", "ans": true }
  ],
  "round3": [
    { "q": "câu hỏi trắc nghiệm", "opts": ["A", "B", "C", "D"], "ans": 0, "exp": "giải thích chi tiết" }
  ]
}`;

function callGemini(attempt) {
    return new Promise((resolve, reject) => {
        const body = JSON.stringify({
            contents: [{ parts: [{ text: QUIZ_SYSTEM_PROMPT + "\n\nĐây là phiên bản số " + attempt + ". Hãy sinh ra các câu thật ĐỘC ĐÁO." }] }],
            generationConfig: { temperature: 0.9 + (attempt * 0.05) }
        });

        const req = https.request({
            hostname: 'generativelanguage.googleapis.com',
            path: '/v1beta/models/gemini-2.5-flash:generateContent?key=' + getRandomApiKey(),
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        }, res => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(data);
                    let text = parsed.candidates[0].content.parts[0].text;
                    text = text.replace(/^```json/, '').replace(/^```/, '').replace(/```$/, '').trim();
                    const quiz = JSON.parse(text);
                    if (quiz.round1 && quiz.round1.length === 8 && quiz.round2 && quiz.round3) {
                        resolve(quiz);
                    } else {
                        reject(new Error('Invalid structure'));
                    }
                } catch (e) {
                    reject(e);
                }
            });
        });

        req.on('error', reject);
        req.write(body);
        req.end();
    });
}

async function run() {
    const totalSets = 10;
    const finalSets = [];
    console.log('Generating ' + totalSets + ' sets...');
    
    for (let i = 1; i <= totalSets; i++) {
        let success = false;
        let retries = 0;
        while (!success && retries < 3) {
            try {
                console.log(`Generating Set ${i}... (Attempt ${retries + 1})`);
                const set = await callGemini(i + retries * 10);
                finalSets.push(set);
                success = true;
                console.log(`Set ${i} generated successfully!`);
            } catch (error) {
                console.log('Failed:', error.message);
                retries++;
            }
        }
        if (!success) {
            console.log('Could not generate set ' + i + ' after 3 retries, falling back to cloning a previous one to save time.');
            if (finalSets.length > 0) {
               finalSets.push(JSON.parse(JSON.stringify(finalSets[0])));
            } else {
               process.exit(1);
            }
        }
    }

    const fileContent = `// Tự động sinh bởi AI Generator
export const QUIZ_BANK = ${JSON.stringify(finalSets, null, 2)};
`;

    fs.writeFileSync('src/data/quiz-bank.ts', fileContent);
    console.log('Successfully saved to src/data/quiz-bank.ts!');
}

run();

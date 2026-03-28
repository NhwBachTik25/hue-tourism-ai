import { NextResponse } from 'next/server';
import { generateLearningQuiz } from '@/lib/quiz-engine';

export async function POST(req: Request) {
    try {
        const rawJsonString = await generateLearningQuiz();
        
        try {
            const parsedData = JSON.parse(rawJsonString);
            return NextResponse.json({ data: parsedData });
        } catch (parseError) {
            console.error('Failed to parse AI output as JSON:', rawJsonString);
            return NextResponse.json(
                { error: 'AI trả về định dạng không hợp lệ, vui lòng thử lại.' },
                { status: 500 }
            );
        }

    } catch (error: any) {
        console.error('Quiz API Error:', error);
        return NextResponse.json(
            { error: error.message || 'Lỗi hệ thống.' },
            { status: 500 }
        );
    }
}

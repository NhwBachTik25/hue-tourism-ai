import { NextRequest, NextResponse } from 'next/server';
import { getRAGEngine } from '@/lib/rag/engine';
import { chat } from '@/lib/gemini';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { message, pageContext, overridePrompt } = body;

        if (!message || typeof message !== 'string') {
            return NextResponse.json(
                { error: 'Message is required' },
                { status: 400 }
            );
        }

        // Check if API key is configured
        if (!process.env.GOOGLE_GEMINI_API_KEY) {
            return NextResponse.json(
                {
                    error: 'API chưa được cấu hình',
                    response: 'Xin lỗi, hệ thống AI chưa được cấu hình. Vui lòng thêm GOOGLE_GEMINI_API_KEY vào file .env.local để sử dụng chatbot.'
                },
                { status: 200 }
            );
        }

        // If overridePrompt is true, skip RAG context engine completely and just send the raw message
        if (overridePrompt) {
            const response = await chat(message, {
                overridePrompt: true
            });

            return NextResponse.json({
                response,
                hasContext: false
            });
        }

        // Standard flow for normal Chatbot
        const ragEngine = await getRAGEngine();
        const context = ragEngine.getContextForQuery(message);

        // Generate response
        const response = await chat(message, {
            context,
            pageContext
        });

        return NextResponse.json({
            response,
            hasContext: context.length > 0
        });

    } catch (error) {
        console.error('Chat API Error:', error);

        const errorMessage = error instanceof Error ? error.message : 'Unknown error';

        return NextResponse.json(
            {
                error: 'Internal server error',
                response: `Lỗi kết nối AI: ${errorMessage}. Vui lòng thử lại sau.`
            },
            { status: 200 }
        );
    }
}

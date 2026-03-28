'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { usePathname } from 'next/navigation';
import ReactMarkdown from 'react-markdown';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
}

const suggestedQuestions = [
    'Biển Vinh Thanh đẹp nhất lúc nào?',
    'Làng An Bằng có gì đặc biệt?',
    'Mua nước ớt Vinh Xuân ở đâu?',
    'Gợi ý lộ trình 1 ngày Phú Vinh?',
];

// Markdown components for beautiful rendering
const MarkdownComponents = {
    p: ({ children }: { children?: React.ReactNode }) => (
        <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>
    ),
    strong: ({ children }: { children?: React.ReactNode }) => (
        <strong className="font-semibold text-primary-foreground">{children}</strong>
    ),
    em: ({ children }: { children?: React.ReactNode }) => (
        <em className="italic">{children}</em>
    ),
    ul: ({ children }: { children?: React.ReactNode }) => (
        <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>
    ),
    ol: ({ children }: { children?: React.ReactNode }) => (
        <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>
    ),
    li: ({ children }: { children?: React.ReactNode }) => (
        <li className="leading-relaxed">{children}</li>
    ),
    h1: ({ children }: { children?: React.ReactNode }) => (
        <h1 className="text-lg font-bold mb-2">{children}</h1>
    ),
    h2: ({ children }: { children?: React.ReactNode }) => (
        <h2 className="text-base font-bold mb-2">{children}</h2>
    ),
    h3: ({ children }: { children?: React.ReactNode }) => (
        <h3 className="text-sm font-bold mb-1">{children}</h3>
    ),
    a: ({ href, children }: { href?: string; children?: React.ReactNode }) => (
        <a href={href} className="text-accent underline hover:no-underline" target="_blank" rel="noopener noreferrer">
            {children}
        </a>
    ),
    blockquote: ({ children }: { children?: React.ReactNode }) => (
        <blockquote className="border-l-2 border-primary/50 pl-3 italic my-2">{children}</blockquote>
    ),
    code: ({ children }: { children?: React.ReactNode }) => (
        <code className="bg-black/20 px-1 py-0.5 rounded text-xs">{children}</code>
    ),
};

// Assistant message component with Markdown rendering
function AssistantMessage({ content }: { content: string }) {
    return (
        <div className="prose prose-sm prose-invert max-w-none text-sm text-secondary-foreground">
            <ReactMarkdown components={MarkdownComponents}>
                {content}
            </ReactMarkdown>
        </div>
    );
}

export function ChatWidget() {
    const [mounted, setMounted] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname();

    // Fix hydration by only rendering after mount
    useEffect(() => {
        setMounted(true);
    }, []);

    const getPageContext = useCallback(() => {
        if (pathname.includes('destinations')) return 'Địa điểm du lịch Phú Vinh';
        if (pathname.includes('food')) return 'Ẩm thực Phú Vinh';
        if (pathname.includes('crafts')) return 'Làng nghề Phú Vinh';
        if (pathname.includes('trip-planner')) return 'Lộ trình tham quan';
        if (pathname.includes('map')) return 'Bản đồ Phú Vinh';
        if (pathname.includes('stories')) return 'Thuyết minh';
        return 'Trang chủ Du lịch Phú Vinh';
    }, [pathname]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    // Listen for custom event to open chat with a question
    useEffect(() => {
        const handleOpenChatWithQuestion = (e: CustomEvent<string>) => {
            setIsOpen(true);
            // Small delay to ensure chat is open before sending
            setTimeout(() => {
                sendMessage(e.detail);
            }, 100);
        };

        window.addEventListener('open-chat-with-message', handleOpenChatWithQuestion as EventListener);
        return () => {
            window.removeEventListener('open-chat-with-message', handleOpenChatWithQuestion as EventListener);
        };
    }, []);


    const sendMessage = async (text: string) => {
        if (!text.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: text.trim(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: text.trim(),
                    pageContext: getPageContext(),
                }),
            });

            const data = await response.json();

            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: data.response || data.error || 'Xin lỗi, đã có lỗi xảy ra.',
            };

            setMessages((prev) => [...prev, assistantMessage]);
        } catch {
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: 'Xin lỗi, không thể kết nối với server. Vui lòng thử lại sau.',
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        sendMessage(input);
    };

    // Prevent hydration mismatch by not rendering until mounted
    if (!mounted) {
        return null;
    }

    return (
        <>
            {/* Floating Button */}
            <AnimatePresence>
                {!isOpen && (
                    <motion.button
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setIsOpen(true)}
                        className="fixed bottom-20 right-4 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-primary to-accent shadow-lg flex items-center justify-center pulse-glow md:bottom-6"
                        aria-label="Mở chat với AI"
                    >
                        <MessageCircle className="w-6 h-6 text-white" />
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                        className="fixed inset-4 md:inset-auto md:bottom-6 md:right-6 md:w-96 md:h-[600px] z-50 flex flex-col glass rounded-2xl overflow-hidden shadow-2xl"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-border/50 bg-primary/10">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                                    <Sparkles className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-sm">Phú Vinh AI</h3>
                                    <p className="text-xs text-muted-foreground">Hướng dẫn viên xã Phú Vinh</p>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsOpen(false)}
                                className="rounded-full"
                                aria-label="Đóng chat"
                            >
                                <X className="w-5 h-5" />
                            </Button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-hidden">
                            <div
                                ref={scrollRef}
                                className="h-full overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-primary/30 scrollbar-track-transparent hover:scrollbar-thumb-primary/50"
                                style={{ maxHeight: 'calc(100% - 0px)' }}
                            >
                                {messages.length === 0 ? (
                                    <div className="space-y-4">
                                        <div className="text-center py-6">
                                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mx-auto mb-4">
                                                <Sparkles className="w-8 h-8 text-primary" />
                                            </div>
                                            <h4 className="font-semibold mb-2">Xin chào! 🌊</h4>
                                            <p className="text-sm text-muted-foreground">
                                                Tôi là hướng dẫn viên AI chuyên về xã Phú Vinh. Hỏi tôi về biển, làng nghề, ẩm thực địa phương!
                                            </p>
                                        </div>

                                        <div className="space-y-2">
                                            <p className="text-xs text-muted-foreground font-medium">Gợi ý câu hỏi:</p>
                                            {suggestedQuestions.map((q, i) => (
                                                <motion.button
                                                    key={i}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: i * 0.1 }}
                                                    onClick={() => sendMessage(q)}
                                                    className="w-full text-left text-sm p-3 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors"
                                                >
                                                    {q}
                                                </motion.button>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {messages.map((message) => (
                                            <motion.div
                                                key={message.id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                            >
                                                <div
                                                    className={`max-w-[85%] rounded-2xl px-4 py-3 ${message.role === 'user'
                                                        ? 'bg-primary text-primary-foreground'
                                                        : 'bg-secondary text-secondary-foreground'
                                                        }`}
                                                >
                                                    {message.role === 'user' ? (
                                                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                                                    ) : (
                                                        <AssistantMessage content={message.content} />
                                                    )}
                                                </div>
                                            </motion.div>
                                        ))}

                                        {isLoading && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="flex justify-start"
                                            >
                                                <div className="bg-secondary rounded-2xl px-4 py-3">
                                                    <div className="flex items-center gap-2">
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                        <span className="text-sm">Đang suy nghĩ...</span>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Input */}
                        <form onSubmit={handleSubmit} className="p-4 border-t border-border/50">
                            <div className="flex gap-2">
                                <Input
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Nhập câu hỏi của bạn..."
                                    disabled={isLoading}
                                    className="flex-1 bg-secondary border-0 focus-visible:ring-primary"
                                />
                                <Button
                                    type="submit"
                                    size="icon"
                                    disabled={isLoading || !input.trim()}
                                    className="bg-primary hover:bg-primary/90"
                                    aria-label="Gửi tin nhắn"
                                >
                                    <Send className="w-4 h-4" />
                                </Button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

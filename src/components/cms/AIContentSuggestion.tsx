'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Wand2, Languages, BookOpen, FileText, X, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface AIContentSuggestionProps {
    currentContent: string;
    onApply: (newContent: string) => void;
    onClose: () => void;
    visible: boolean;
}

type SuggestionMode = 'simplify' | 'heritage' | 'bilingual' | 'shorten';

const modes: { id: SuggestionMode; label: string; labelEn: string; icon: React.ElementType; description: string }[] = [
    { id: 'simplify', label: 'Dễ hiểu hơn', labelEn: 'Simplify', icon: Wand2, description: 'Viết lại cho học sinh dễ hiểu' },
    { id: 'heritage', label: 'Giọng di sản', labelEn: 'Heritage Style', icon: BookOpen, description: 'Viết theo phong cách kể chuyện di sản' },
    { id: 'bilingual', label: 'Song ngữ', labelEn: 'Bilingual', icon: Languages, description: 'Thêm bản dịch tiếng Anh' },
    { id: 'shorten', label: 'Rút gọn', labelEn: 'Shorten', icon: FileText, description: 'Tóm tắt ngắn gọn hơn' },
];

export function AIContentSuggestion({
    currentContent,
    onApply,
    onClose,
    visible
}: AIContentSuggestionProps) {
    const [selectedMode, setSelectedMode] = useState<SuggestionMode>('simplify');
    const [suggestion, setSuggestion] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const generateSuggestion = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        setSuggestion('');

        try {
            // Build prompt based on mode
            const prompts: Record<SuggestionMode, string> = {
                simplify: `Viết lại nội dung sau cho học sinh lớp 6-9 dễ hiểu, giữ nguyên ý chính:\n\n"${currentContent}"`,
                heritage: `Viết lại nội dung sau theo phong cách kể chuyện di sản văn hóa, trang trọng nhưng gần gũi:\n\n"${currentContent}"`,
                bilingual: `Dịch nội dung sau sang tiếng Anh, giữ nguyên bản tiếng Việt ở trên:\n\n"${currentContent}"`,
                shorten: `Tóm tắt nội dung sau thành 1-2 câu ngắn gọn, giữ thông tin quan trọng nhất:\n\n"${currentContent}"`,
            };

            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [{ role: 'user', content: prompts[selectedMode] }]
                })
            });

            if (!response.ok) throw new Error('API error');

            const data = await response.json();
            setSuggestion(data.response || data.content || 'Không thể tạo gợi ý');
        } catch (err) {
            setError('Không thể kết nối AI. Vui lòng thử lại.');
        } finally {
            setIsLoading(false);
        }
    }, [currentContent, selectedMode]);

    const handleApply = () => {
        if (suggestion) {
            onApply(suggestion);
            onClose();
        }
    };

    if (!visible) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-card rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden shadow-2xl"
                    onClick={e => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="p-4 border-b border-border flex items-center justify-between bg-gradient-to-r from-purple-500/10 to-blue-500/10">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                                <Sparkles className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h3 className="font-bold">AI Gợi ý nội dung</h3>
                                <p className="text-xs text-muted-foreground">Chọn kiểu viết lại</p>
                            </div>
                        </div>
                        <Button size="icon" variant="ghost" onClick={onClose}>
                            <X className="w-4 h-4" />
                        </Button>
                    </div>

                    <div className="p-4 space-y-4 overflow-y-auto max-h-[calc(85vh-140px)]">
                        {/* Mode Selection */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            {modes.map(mode => (
                                <button
                                    key={mode.id}
                                    onClick={() => setSelectedMode(mode.id)}
                                    className={cn(
                                        "p-3 rounded-xl border transition-all text-center",
                                        selectedMode === mode.id
                                            ? "border-purple-500 bg-purple-500/10"
                                            : "border-border hover:border-purple-500/50"
                                    )}
                                >
                                    <mode.icon className={cn(
                                        "w-5 h-5 mx-auto mb-1",
                                        selectedMode === mode.id ? "text-purple-400" : "text-muted-foreground"
                                    )} />
                                    <p className="text-sm font-medium">{mode.label}</p>
                                    <p className="text-[10px] text-muted-foreground">{mode.description}</p>
                                </button>
                            ))}
                        </div>

                        {/* Original Content */}
                        <div>
                            <p className="text-xs font-medium text-muted-foreground mb-2">Nội dung gốc:</p>
                            <div className="p-3 rounded-xl bg-secondary/50 text-sm">
                                {currentContent}
                            </div>
                        </div>

                        {/* Generate Button */}
                        {!suggestion && !isLoading && (
                            <Button
                                onClick={generateSuggestion}
                                className="w-full gap-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                            >
                                <Sparkles className="w-4 h-4" />
                                Tạo gợi ý
                            </Button>
                        )}

                        {/* Loading */}
                        {isLoading && (
                            <div className="flex items-center justify-center py-8">
                                <Loader2 className="w-6 h-6 animate-spin text-purple-400" />
                                <span className="ml-3 text-sm text-muted-foreground">Đang tạo gợi ý...</span>
                            </div>
                        )}

                        {/* Error */}
                        {error && (
                            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                                {error}
                            </div>
                        )}

                        {/* Suggestion Result */}
                        {suggestion && (
                            <div>
                                <p className="text-xs font-medium text-muted-foreground mb-2">Gợi ý của AI:</p>
                                <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/30 text-sm">
                                    {suggestion}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    {suggestion && (
                        <div className="p-4 border-t border-border flex gap-3">
                            <Button variant="outline" onClick={() => setSuggestion('')} className="flex-1">
                                Tạo lại
                            </Button>
                            <Button onClick={handleApply} className="flex-1 gap-2 bg-green-500 hover:bg-green-600">
                                <Check className="w-4 h-4" />
                                Áp dụng
                            </Button>
                        </div>
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

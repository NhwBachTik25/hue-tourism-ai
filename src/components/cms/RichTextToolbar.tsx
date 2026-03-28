'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bold, Italic, Undo2, Redo2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface RichTextToolbarProps {
    onBold: () => void;
    onItalic: () => void;
    onUndo: () => void;
    onRedo: () => void;
    onAISuggest?: () => void;
    canUndo?: boolean;
    canRedo?: boolean;
    position?: { top: number; left: number };
    visible: boolean;
}

export function RichTextToolbar({
    onBold,
    onItalic,
    onUndo,
    onRedo,
    onAISuggest,
    canUndo = true,
    canRedo = false,
    position,
    visible
}: RichTextToolbarProps) {
    if (!visible) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 5, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 5, scale: 0.95 }}
                className={cn(
                    "fixed z-50 flex items-center gap-1 p-1.5 rounded-lg",
                    "bg-card/95 backdrop-blur-sm border border-border shadow-xl"
                )}
                style={position ? { top: position.top, left: position.left } : undefined}
            >
                {/* Bold */}
                <Button
                    size="sm"
                    variant="ghost"
                    onClick={onBold}
                    className="h-8 w-8 p-0 hover:bg-amber-500/20"
                    title="Đậm (Ctrl+B)"
                >
                    <Bold className="w-4 h-4" />
                </Button>

                {/* Italic */}
                <Button
                    size="sm"
                    variant="ghost"
                    onClick={onItalic}
                    className="h-8 w-8 p-0 hover:bg-amber-500/20"
                    title="Nghiêng (Ctrl+I)"
                >
                    <Italic className="w-4 h-4" />
                </Button>

                <div className="w-px h-5 bg-border mx-1" />

                {/* Undo */}
                <Button
                    size="sm"
                    variant="ghost"
                    onClick={onUndo}
                    disabled={!canUndo}
                    className="h-8 w-8 p-0 hover:bg-blue-500/20 disabled:opacity-30"
                    title="Hoàn tác (Ctrl+Z)"
                >
                    <Undo2 className="w-4 h-4" />
                </Button>

                {/* Redo */}
                <Button
                    size="sm"
                    variant="ghost"
                    onClick={onRedo}
                    disabled={!canRedo}
                    className="h-8 w-8 p-0 hover:bg-blue-500/20 disabled:opacity-30"
                    title="Làm lại (Ctrl+Y)"
                >
                    <Redo2 className="w-4 h-4" />
                </Button>

                {/* AI Suggest */}
                {onAISuggest && (
                    <>
                        <div className="w-px h-5 bg-border mx-1" />
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={onAISuggest}
                            className="h-8 px-2 gap-1.5 hover:bg-purple-500/20 text-purple-400"
                            title="AI gợi ý nội dung"
                        >
                            <Sparkles className="w-4 h-4" />
                            <span className="text-xs">AI</span>
                        </Button>
                    </>
                )}
            </motion.div>
        </AnimatePresence>
    );
}

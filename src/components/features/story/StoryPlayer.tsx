'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Play, Pause, Square, Volume2, VolumeX,
    Gauge, Loader2, X
} from 'lucide-react';
import { tts, TTSState } from '@/lib/tts';

interface StoryPlayerProps {
    title: string;
    content: string;
    language: 'vi' | 'en';
    onClose?: () => void;
    autoPlay?: boolean;
}

const speedOptions = [
    { value: 0.75, label: '0.75x' },
    { value: 1, label: '1x' },
    { value: 1.25, label: '1.25x' },
    { value: 1.5, label: '1.5x' },
];

export function StoryPlayer({
    title,
    content,
    language,
    onClose,
    autoPlay = false,
}: StoryPlayerProps) {
    const [ttsState, setTTSState] = useState<TTSState>({
        isPlaying: false,
        isPaused: false,
        currentWord: 0,
        progress: 0,
    });
    const [speed, setSpeed] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [isSupported, setIsSupported] = useState(true);
    const [showSpeedMenu, setShowSpeedMenu] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);
    const words = content.split(/\s+/).filter((w) => w.length > 0);

    useEffect(() => {
        setIsSupported(tts.isSupported());

        const unsubscribe = tts.subscribe((state) => {
            setTTSState(state);
        });

        return () => {
            unsubscribe();
            tts.stop();
        };
    }, []);

    useEffect(() => {
        if (autoPlay && isSupported) {
            handlePlay();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [autoPlay, isSupported]);

    // Scroll to current word
    useEffect(() => {
        if (contentRef.current && ttsState.currentWord > 0) {
            const wordElements = contentRef.current.querySelectorAll('.story-word');
            const currentWordEl = wordElements[ttsState.currentWord];
            if (currentWordEl) {
                currentWordEl.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                });
            }
        }
    }, [ttsState.currentWord]);

    const handlePlay = useCallback(async () => {
        if (!isSupported) return;

        if (ttsState.isPaused) {
            tts.resume();
        } else if (!ttsState.isPlaying) {
            try {
                await tts.speak(content, {
                    lang: language === 'vi' ? 'vi-VN' : 'en-US',
                    rate: speed,
                    volume: isMuted ? 0 : 1,
                });
            } catch (error) {
                console.error('TTS Error:', error);
            }
        }
    }, [content, language, speed, isMuted, ttsState, isSupported]);

    const handlePause = useCallback(() => {
        tts.pause();
    }, []);

    const handleStop = useCallback(() => {
        tts.stop();
    }, []);

    const handleSpeedChange = useCallback((newSpeed: number) => {
        setSpeed(newSpeed);
        tts.setRate(newSpeed);
        setShowSpeedMenu(false);
    }, []);

    const toggleMute = useCallback(() => {
        setIsMuted((prev) => !prev);
    }, []);

    if (!isSupported) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card/95 backdrop-blur rounded-2xl p-4 border border-border shadow-xl"
            >
                <div className="flex items-center justify-between mb-3">
                    <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-400">
                        <VolumeX className="w-3 h-3 mr-1" />
                        {language === 'vi' ? 'Không hỗ trợ' : 'Not Supported'}
                    </Badge>
                    {onClose && (
                        <Button size="sm" variant="ghost" onClick={onClose}>
                            <X className="w-4 h-4" />
                        </Button>
                    )}
                </div>
                <p className="text-sm text-muted-foreground">
                    {language === 'vi'
                        ? 'Trình duyệt của bạn không hỗ trợ đọc văn bản. Vui lòng sử dụng Chrome hoặc Edge.'
                        : 'Your browser does not support text-to-speech. Please use Chrome or Edge.'}
                </p>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="bg-card/95 backdrop-blur rounded-2xl border border-border shadow-xl overflow-hidden"
        >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border/50">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                        <Volume2 className="w-4 h-4 text-green-400" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-sm line-clamp-1">{title}</h3>
                        <p className="text-xs text-muted-foreground">
                            {language === 'vi' ? 'AI Kể chuyện' : 'AI Story Mode'}
                        </p>
                    </div>
                </div>
                {onClose && (
                    <Button size="sm" variant="ghost" onClick={onClose}>
                        <X className="w-4 h-4" />
                    </Button>
                )}
            </div>

            {/* Progress bar */}
            <div className="h-1 bg-secondary">
                <motion.div
                    className="h-full bg-green-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${ttsState.progress * 100}%` }}
                    transition={{ duration: 0.1 }}
                />
            </div>

            {/* Content with word highlighting */}
            <div
                ref={contentRef}
                className="p-4 max-h-48 overflow-y-auto scrollbar-thin"
            >
                <p className="text-sm leading-relaxed">
                    {words.map((word, idx) => (
                        <span
                            key={idx}
                            className={`story-word transition-colors duration-150 ${idx === ttsState.currentWord && ttsState.isPlaying
                                    ? 'bg-green-500/30 text-green-400 rounded px-0.5'
                                    : idx < ttsState.currentWord
                                        ? 'text-muted-foreground'
                                        : ''
                                }`}
                        >
                            {word}{' '}
                        </span>
                    ))}
                </p>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between p-4 border-t border-border/50 bg-secondary/30">
                <div className="flex items-center gap-2">
                    {/* Play/Pause */}
                    {ttsState.isPlaying && !ttsState.isPaused ? (
                        <Button
                            size="sm"
                            variant="secondary"
                            onClick={handlePause}
                            className="gap-1"
                        >
                            <Pause className="w-4 h-4" />
                        </Button>
                    ) : (
                        <Button
                            size="sm"
                            onClick={handlePlay}
                            className="gap-1 bg-green-500 hover:bg-green-600"
                        >
                            <Play className="w-4 h-4" />
                            {!ttsState.isPlaying && !ttsState.isPaused && (
                                <span className="text-xs">
                                    {language === 'vi' ? 'Phát' : 'Play'}
                                </span>
                            )}
                        </Button>
                    )}

                    {/* Stop */}
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={handleStop}
                        disabled={!ttsState.isPlaying && !ttsState.isPaused}
                    >
                        <Square className="w-4 h-4" />
                    </Button>

                    {/* Mute */}
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={toggleMute}
                    >
                        {isMuted ? (
                            <VolumeX className="w-4 h-4 text-red-400" />
                        ) : (
                            <Volume2 className="w-4 h-4" />
                        )}
                    </Button>
                </div>

                {/* Speed control */}
                <div className="relative">
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                        className="gap-1"
                    >
                        <Gauge className="w-4 h-4" />
                        <span className="text-xs">{speed}x</span>
                    </Button>

                    <AnimatePresence>
                        {showSpeedMenu && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="absolute bottom-full right-0 mb-2 bg-popover border border-border rounded-lg shadow-lg py-1"
                            >
                                {speedOptions.map((opt) => (
                                    <button
                                        key={opt.value}
                                        onClick={() => handleSpeedChange(opt.value)}
                                        className={`w-full px-4 py-2 text-sm text-left hover:bg-secondary transition-colors ${speed === opt.value ? 'text-green-400 font-medium' : ''
                                            }`}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    );
}

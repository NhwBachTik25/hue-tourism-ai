'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Expand, X, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImageCarouselProps {
    images: string[];
    title: string;
    autoPlay?: boolean;
    autoPlayInterval?: number;
    showThumbnails?: boolean;
    aspectRatio?: 'video' | 'square' | '4/3';
}

export function ImageCarousel({
    images,
    title,
    autoPlay = true,
    autoPlayInterval = 4000,
    showThumbnails = true,
    aspectRatio = 'video',
}: ImageCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());

    const aspectClasses = {
        video: 'aspect-video',
        square: 'aspect-square',
        '4/3': 'aspect-[4/3]',
    };

    const goToNext = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
    }, [images.length]);

    const goToPrev = useCallback(() => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    }, [images.length]);

    const goToIndex = (index: number) => {
        setCurrentIndex(index);
    };

    const handleImageError = (index: number) => {
        setImageErrors((prev) => new Set(prev).add(index));
    };

    // Auto-play functionality
    useEffect(() => {
        if (!autoPlay || isPaused || images.length <= 1) return;

        const interval = setInterval(goToNext, autoPlayInterval);
        return () => clearInterval(interval);
    }, [autoPlay, autoPlayInterval, isPaused, images.length, goToNext]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') goToPrev();
            if (e.key === 'ArrowRight') goToNext();
            if (e.key === 'Escape') setIsFullscreen(false);
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [goToNext, goToPrev]);

    const hasValidImages = images.length > 0 && !images.every((_, i) => imageErrors.has(i));

    // Placeholder when no images
    if (!hasValidImages) {
        return (
            <div className={`relative ${aspectClasses[aspectRatio]} bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center`}>
                <div className="text-center p-4">
                    <Camera className="w-16 h-16 mx-auto mb-2 text-muted-foreground/50" />
                    <p className="text-muted-foreground">Hình ảnh sẽ được cập nhật</p>
                    <p className="text-xs text-muted-foreground/70 mt-1">
                        Xem hướng dẫn tại DANH_SACH_ANH.md
                    </p>
                </div>
            </div>
        );
    }

    return (
        <>
            {/* Main Carousel */}
            <div
                className="relative group"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
            >
                <div className={`relative ${aspectClasses[aspectRatio]} rounded-xl overflow-hidden bg-muted/20`}>
                    <AnimatePresence mode="wait">
                        {imageErrors.has(currentIndex) ? (
                            <motion.div
                                key={`placeholder-${currentIndex}`}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-500/20 to-cyan-500/20"
                            >
                                <div className="text-center">
                                    <Camera className="w-12 h-12 mx-auto mb-2 text-muted-foreground/50" />
                                    <p className="text-sm text-muted-foreground">Ảnh đang cập nhật</p>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key={currentIndex}
                                initial={{ opacity: 0, scale: 1.05 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.3 }}
                                className="absolute inset-0"
                            >
                                <Image
                                    src={images[currentIndex]}
                                    alt={`${title} - Ảnh ${currentIndex + 1}`}
                                    fill
                                    className="object-cover"
                                    onError={() => handleImageError(currentIndex)}
                                    priority={currentIndex === 0}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Navigation Arrows */}
                    {images.length > 1 && (
                        <>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 hover:bg-black/50 text-white"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    goToPrev();
                                }}
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 hover:bg-black/50 text-white"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    goToNext();
                                }}
                            >
                                <ChevronRight className="w-5 h-5" />
                            </Button>
                        </>
                    )}

                    {/* Fullscreen Toggle */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 hover:bg-black/50 text-white"
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsFullscreen(true);
                        }}
                    >
                        <Expand className="w-4 h-4" />
                    </Button>

                    {/* Dots Indicator */}
                    {images.length > 1 && (
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                            {images.map((_, index) => (
                                <button
                                    key={index}
                                    className={`w-2 h-2 rounded-full transition-all ${index === currentIndex
                                            ? 'bg-white w-4'
                                            : 'bg-white/50 hover:bg-white/70'
                                        }`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        goToIndex(index);
                                    }}
                                />
                            ))}
                        </div>
                    )}

                    {/* Counter */}
                    <div className="absolute top-2 left-2 px-2 py-1 rounded-md bg-black/50 text-white text-xs">
                        {currentIndex + 1} / {images.length}
                    </div>
                </div>

                {/* Thumbnails */}
                {showThumbnails && images.length > 1 && (
                    <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
                        {images.map((img, index) => (
                            <button
                                key={index}
                                className={`relative w-16 h-12 rounded-lg overflow-hidden flex-shrink-0 transition-all ${index === currentIndex
                                        ? 'ring-2 ring-primary ring-offset-2 ring-offset-background'
                                        : 'opacity-60 hover:opacity-100'
                                    }`}
                                onClick={() => goToIndex(index)}
                            >
                                {imageErrors.has(index) ? (
                                    <div className="absolute inset-0 bg-muted flex items-center justify-center">
                                        <Camera className="w-4 h-4 text-muted-foreground" />
                                    </div>
                                ) : (
                                    <Image
                                        src={img}
                                        alt={`Thumbnail ${index + 1}`}
                                        fill
                                        className="object-cover"
                                        onError={() => handleImageError(index)}
                                    />
                                )}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Fullscreen Modal */}
            <AnimatePresence>
                {isFullscreen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black flex items-center justify-center"
                        onClick={() => setIsFullscreen(false)}
                    >
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-4 right-4 text-white hover:bg-white/20"
                            onClick={() => setIsFullscreen(false)}
                        >
                            <X className="w-6 h-6" />
                        </Button>

                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
                            onClick={(e) => {
                                e.stopPropagation();
                                goToPrev();
                            }}
                        >
                            <ChevronLeft className="w-8 h-8" />
                        </Button>

                        <div className="relative max-w-[90vw] max-h-[90vh]">
                            {imageErrors.has(currentIndex) ? (
                                <div className="w-[80vw] h-[60vh] flex items-center justify-center bg-muted/10 rounded-xl">
                                    <div className="text-center text-white">
                                        <Camera className="w-16 h-16 mx-auto mb-4 opacity-50" />
                                        <p>Ảnh đang được cập nhật</p>
                                    </div>
                                </div>
                            ) : (
                                <Image
                                    src={images[currentIndex]}
                                    alt={`${title} - Ảnh ${currentIndex + 1}`}
                                    width={1200}
                                    height={800}
                                    className="object-contain max-h-[90vh]"
                                    onError={() => handleImageError(currentIndex)}
                                    onClick={(e) => e.stopPropagation()}
                                />
                            )}
                        </div>

                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
                            onClick={(e) => {
                                e.stopPropagation();
                                goToNext();
                            }}
                        >
                            <ChevronRight className="w-8 h-8" />
                        </Button>

                        {/* Fullscreen Counter */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm">
                            {currentIndex + 1} / {images.length}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import {
    X,
    MapPin,
    Clock,
    DollarSign,
    Star,
    ChevronLeft,
    ChevronRight,
    Navigation,
    MessageCircle,
    History,
    Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export interface ItemData {
    id: string;
    title: string;
    description: string;
    images: string[];
    location: string;
    category: string;
    rating?: number;
    price?: string;
    hours?: string;
    history?: string;
    time?: string;
    coordinates?: {
        lat: number;
        lng: number;
    };
}

interface ItemModalProps {
    item: ItemData | null;
    isOpen: boolean;
    onClose: () => void;
    onAskAI: (question: string) => void;
    type?: 'food' | 'craft' | 'festival' | 'destination';
}

export function ItemModal({ item, isOpen, onClose, onAskAI, type = 'destination' }: ItemModalProps) {
    const [mounted, setMounted] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [imageLoaded, setImageLoaded] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (isOpen) {
            setCurrentImageIndex(0);
            setImageLoaded(false);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    const nextImage = useCallback(() => {
        if (!item || item.images.length <= 1) return;
        setImageLoaded(false);
        setCurrentImageIndex((prev) =>
            prev === item.images.length - 1 ? 0 : prev + 1
        );
    }, [item]);

    const prevImage = useCallback(() => {
        if (!item || item.images.length <= 1) return;
        setImageLoaded(false);
        setCurrentImageIndex((prev) =>
            prev === 0 ? item.images.length - 1 : prev - 1
        );
    }, [item]);

    const openGoogleMaps = useCallback(() => {
        if (!item?.coordinates) return;
        const url = `https://www.google.com/maps/dir/?api=1&destination=${item.coordinates.lat},${item.coordinates.lng}`;
        window.open(url, '_blank');
    }, [item]);

    const handleAskAI = useCallback(() => {
        if (!item) return;
        onAskAI(`Cho tôi biết thêm về ${item.title}`);
        onClose();
    }, [item, onAskAI, onClose]);

    const getCategoryColor = () => {
        switch (type) {
            case 'food': return 'bg-orange-500/90';
            case 'craft': return 'bg-purple-500/90';
            case 'festival': return 'bg-amber-500/90';
            default: return 'bg-primary/90';
        }
    };

    if (!mounted) return null;

    return (
        <AnimatePresence>
            {isOpen && item && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        className="fixed inset-4 md:inset-8 lg:inset-16 z-50 flex items-center justify-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="w-full max-w-5xl max-h-full bg-card rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row">
                            {/* Left: Image Gallery */}
                            <div className="relative w-full md:w-1/2 aspect-[4/3] md:aspect-auto md:h-auto flex-shrink-0 bg-black">
                                {/* Current Image */}
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={currentImageIndex}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: imageLoaded ? 1 : 0 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="absolute inset-0"
                                    >
                                        <Image
                                            src={item.images[currentImageIndex]}
                                            alt={`${item.title} - ${currentImageIndex + 1}`}
                                            fill
                                            className="object-cover"
                                            onLoad={() => setImageLoaded(true)}
                                            priority
                                        />
                                    </motion.div>
                                </AnimatePresence>

                                {/* Image loading placeholder */}
                                {!imageLoaded && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-secondary">
                                        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                    </div>
                                )}

                                {/* Gradient overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

                                {/* Category Badge */}
                                <Badge className={`absolute top-4 left-4 ${getCategoryColor()}`}>
                                    {item.category}
                                </Badge>

                                {/* Rating */}
                                {item.rating && (
                                    <div className="absolute top-4 right-4 flex items-center gap-1 bg-black/50 rounded-full px-2 py-1">
                                        <Star className="w-3 h-3 fill-accent text-accent" />
                                        <span className="text-xs font-medium text-white">{item.rating}</span>
                                    </div>
                                )}

                                {/* Navigation arrows */}
                                {item.images.length > 1 && (
                                    <>
                                        <button
                                            onClick={prevImage}
                                            className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center transition-colors"
                                            aria-label="Previous image"
                                        >
                                            <ChevronLeft className="w-5 h-5 text-white" />
                                        </button>
                                        <button
                                            onClick={nextImage}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center transition-colors"
                                            aria-label="Next image"
                                        >
                                            <ChevronRight className="w-5 h-5 text-white" />
                                        </button>
                                    </>
                                )}

                                {/* Dots indicator */}
                                {item.images.length > 1 && (
                                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                                        {item.images.map((_, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => {
                                                    setImageLoaded(false);
                                                    setCurrentImageIndex(idx);
                                                }}
                                                className={`w-2 h-2 rounded-full transition-all ${idx === currentImageIndex
                                                    ? 'bg-white w-4'
                                                    : 'bg-white/50 hover:bg-white/70'
                                                    }`}
                                                aria-label={`Go to image ${idx + 1}`}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Right: Info Panel */}
                            <div className="flex-1 flex flex-col overflow-hidden">
                                {/* Close button */}
                                <button
                                    onClick={onClose}
                                    className="absolute top-4 right-4 md:relative md:top-auto md:right-auto md:self-end md:m-4 w-10 h-10 rounded-full bg-secondary hover:bg-secondary/80 flex items-center justify-center transition-colors z-10"
                                    aria-label="Close modal"
                                >
                                    <X className="w-5 h-5" />
                                </button>

                                {/* Content */}
                                <div className="flex-1 overflow-y-auto p-6 pt-2 md:pt-0">
                                    <h2 className="text-2xl md:text-3xl font-bold mb-2">
                                        {item.title}
                                    </h2>

                                    <div className="flex items-center gap-2 text-muted-foreground mb-4">
                                        <MapPin className="w-4 h-4" />
                                        <span className="text-sm">{item.location}</span>
                                    </div>

                                    <p className="text-muted-foreground mb-6 leading-relaxed">
                                        {item.description}
                                    </p>

                                    {/* Info Grid */}
                                    <div className="grid grid-cols-2 gap-4 mb-6">
                                        {item.hours && (
                                            <div className="glass rounded-xl p-4">
                                                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                                                    <Clock className="w-4 h-4" />
                                                    <span className="text-xs">Giờ mở cửa</span>
                                                </div>
                                                <p className="font-semibold">{item.hours}</p>
                                            </div>
                                        )}
                                        {item.price && (
                                            <div className="glass rounded-xl p-4">
                                                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                                                    <DollarSign className="w-4 h-4" />
                                                    <span className="text-xs">Giá</span>
                                                </div>
                                                <p className="font-semibold text-primary">{item.price}</p>
                                            </div>
                                        )}
                                        {item.history && (
                                            <div className="glass rounded-xl p-4">
                                                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                                                    <History className="w-4 h-4" />
                                                    <span className="text-xs">Lịch sử</span>
                                                </div>
                                                <p className="font-semibold">{item.history}</p>
                                            </div>
                                        )}
                                        {item.time && (
                                            <div className="glass rounded-xl p-4">
                                                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                                                    <Calendar className="w-4 h-4" />
                                                    <span className="text-xs">Thời gian</span>
                                                </div>
                                                <p className="font-semibold">{item.time}</p>
                                            </div>
                                        )}
                                    </div>


                                </div>

                                {/* Action Buttons */}
                                <div className="p-4 border-t border-border/50 flex flex-col sm:flex-row gap-3">
                                    {item.coordinates && (
                                        <Button
                                            onClick={openGoogleMaps}
                                            className="flex-1 bg-primary hover:bg-primary/90"
                                        >
                                            <Navigation className="w-4 h-4 mr-2" />
                                            Chỉ đường
                                        </Button>
                                    )}
                                    <Button
                                        onClick={handleAskAI}
                                        variant="outline"
                                        className="flex-1 border-primary/50 text-primary hover:bg-primary/10"
                                    >
                                        <MessageCircle className="w-4 h-4 mr-2" />
                                        Hỏi AI
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

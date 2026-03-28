'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Camera } from 'lucide-react';

interface ImagePreviewProps {
    src: string;
    alt: string;
    className?: string;
    fallbackClassName?: string;
}

export function ImagePreview({ src, alt, className = '', fallbackClassName = '' }: ImagePreviewProps) {
    const [hasError, setHasError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    if (hasError) {
        return (
            <div className={`flex items-center justify-center bg-gradient-to-br from-blue-500/20 to-cyan-500/20 ${fallbackClassName}`}>
                <div className="text-center p-4">
                    <Camera className="w-12 h-12 mx-auto mb-2 text-muted-foreground/50" />
                    <p className="text-xs text-muted-foreground">
                        Ảnh đang cập nhật
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className={`relative ${className}`}>
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-500/20 to-cyan-500/20">
                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
            )}
            <Image
                src={src}
                alt={alt}
                fill
                className={`object-cover transition-opacity ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                onLoad={() => setIsLoading(false)}
                onError={() => {
                    setHasError(true);
                    setIsLoading(false);
                }}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
        </div>
    );
}

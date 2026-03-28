// @ts-nocheck
'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Box, View, AlertCircle } from 'lucide-react';



interface ARViewerProps {
    src: string;
    poster?: string;
    alt: string;
    iosSrc?: string; // .usdz for iOS AR Quick Look
    className?: string;
}

export function ARViewer({ src, poster, alt, iosSrc, className = '' }: ARViewerProps) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [arSupported, setArSupported] = useState(false);
    const viewerRef = useRef<any>(null);

    useEffect(() => {
        // Check if AR is supported
        const checkARSupport = () => {
            const isRelAREnabled = document.createElement('a').relList.supports('ar');
            setArSupported(isRelAREnabled);
        };
        checkARSupport();

        // Import model-viewer dynamically
        import('@google/model-viewer').catch(err => {
            console.error('Error loading model-viewer:', err);
            setError(true);
        });
    }, []);

    const handleLoad = () => {
        setLoading(false);
        console.log('Model loaded successfully');
    };

    const handleError = (err: any) => {
        console.error('Model load error:', err);
        setLoading(false);
        setError(true);
    };

    return (
        <div className={`relative w-full h-full bg-slate-900 rounded-xl overflow-hidden ${className}`}>
            {/* Loading Overlay */}
            {loading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/80 z-20 backdrop-blur-sm">
                    <Loader2 className="w-10 h-10 text-primary animate-spin mb-3" />
                    <p className="text-white text-sm font-medium">Đang tải mô hình 3D...</p>
                </div>
            )}

            {/* Error Overlay */}
            {error && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/90 z-20">
                    <AlertCircle className="w-10 h-10 text-red-500 mb-3" />
                    <p className="text-white font-medium">Không thể tải mô hình</p>
                    <Button
                        variant="outline"
                        size="sm"
                        className="mt-4"
                        onClick={() => {
                            setLoading(true);
                            setError(false);
                            // Force reload by updating key or similar if needed
                        }}
                    >
                        Thử lại
                    </Button>
                </div>
            )}

            {/* Model Viewer Component */}
            {/* @ts-ignore */}
            <model-viewer
                ref={viewerRef}
                src={src}
                ios-src={iosSrc}
                poster={poster}
                alt={alt}
                loading="eager"
                reveal="auto"
                auto-rotate
                camera-controls
                touch-action="pan-y"
                ar
                ar-modes="webxr scene-viewer quick-look"
                ar-scale="auto"
                shadow-intensity="1"
                camera-orbit="45deg 55deg 2.5m"
                min-camera-orbit="auto auto 2m"
                max-camera-orbit="auto auto 10m"
                style={{ width: '100%', height: '100%' }}
                onLoad={handleLoad}
                onError={handleError}
            >
                {/* Custom AR Button */}
                {/* @ts-ignore */}
                <div slot="ar-button" className="absolute bottom-6 right-6 z-10">
                    <Button
                        size="lg"
                        className="rounded-full shadow-lg bg-white text-black hover:bg-gray-100 dark:bg-white dark:text-black font-semibold"
                    >
                        <View className="w-5 h-5 mr-2" />
                        Xem trong không gian (AR)
                    </Button>
                </div>

                {/* Progress Bar */}
                {/* @ts-ignore */}
                <div slot="progress-bar" className="absolute top-0 left-0 w-full h-1 bg-white/20">
                    <div className="h-full bg-primary transition-all duration-300 getting-started-progress-bar" />
                </div>
            </model-viewer>

            {/* Helper Tip */}
            <div className="absolute top-4 left-4 z-10 pointer-events-none">
                <Badge variant="secondary/80" className="backdrop-blur-md bg-black/40 text-white border-white/20 text-xs px-3 py-1.5 flex gap-2 items-center">
                    <Box className="w-3.5 h-3.5" />
                    <span>Xoay để xem • Zoom để phóng to</span>
                </Badge>
            </div>
        </div>
    );
}

'use client';

/**
 * EditableVideo - Canva Style
 * Inline video editing with overlay buttons ON video
 * 
 * ✅ Simple file upload (base64)
 * ✅ Show Play/Upload/Remove buttons on hover
 * ✅ Works reliably across all pages
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { Video, Upload, Trash2, RefreshCw, Play, Pause } from 'lucide-react';
import { useEditMode } from '@/components/providers/edit-mode-provider';
import { cn } from '@/lib/utils';

interface EditableVideoProps {
    id: string;
    defaultSrc: string;
    poster?: string;
    className?: string;
    containerClassName?: string;
    autoplay?: boolean;
    loop?: boolean;
    muted?: boolean;
    controls?: boolean;
}

const VIDEO_STORAGE_PREFIX = 'cms_video_';

export function EditableVideo({
    id,
    defaultSrc,
    poster,
    className,
    containerClassName,
    autoplay = false,
    loop = true,
    muted = true,
    controls = true
}: EditableVideoProps) {
    const [src, setSrc] = useState(defaultSrc);
    const [originalSrc, setOriginalSrc] = useState(defaultSrc);
    const [isHovered, setIsHovered] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    let editMode = false;
    let selectedBlockId: string | null = null;
    let selectBlock: (id: string | null) => void = () => { };
    let setHoverBlock: (id: string | null) => void = () => { };
    let registerChange: (id: string, original: string, current: string, type?: 'text' | 'image' | 'media') => void = () => { };

    try {
        const ctx = useEditMode();
        editMode = ctx.editMode;
        selectedBlockId = ctx.selectedBlockId;
        selectBlock = ctx.selectBlock;
        setHoverBlock = ctx.setHoverBlock;
        registerChange = ctx.registerChange;
    } catch { }

    const isSelected = selectedBlockId === id;

    // Load saved video on mount
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedSrc = localStorage.getItem(`${VIDEO_STORAGE_PREFIX}${id}`);
            if (savedSrc) {
                setSrc(savedSrc);
                setOriginalSrc(savedSrc);
            } else {
                setOriginalSrc(defaultSrc);
            }
        }
    }, [id, defaultSrc]);

    const handleVideoChange = useCallback((newSrc: string) => {
        setSrc(newSrc);
        if (typeof window !== 'undefined') {
            localStorage.setItem(`${VIDEO_STORAGE_PREFIX}${id}`, newSrc);
        }
        registerChange(id, originalSrc, newSrc, 'media');
    }, [id, originalSrc, registerChange]);

    // Simple file upload with FileReader
    const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith('video/')) {
            alert('Please select a video file');
            return;
        }

        // Check file size (videos can be large)
        if (file.size > 50 * 1024 * 1024) { // 50MB limit
            alert('Video file is too large (max 50MB)');
            return;
        }

        setIsUploading(true);
        const reader = new FileReader();

        reader.onload = (event) => {
            const base64 = event.target?.result as string;
            handleVideoChange(base64);
            setIsUploading(false);
        };

        reader.onerror = () => {
            alert('Failed to read file');
            setIsUploading(false);
        };

        reader.readAsDataURL(file);
        e.target.value = '';
    }, [handleVideoChange]);

    const handleRemoveVideo = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        handleVideoChange('');
    }, [handleVideoChange]);

    const handleClick = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        selectBlock(id);
    }, [id, selectBlock]);

    const togglePlayback = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    }, [isPlaying]);

    // Non-edit mode: just render the video
    if (!editMode) {
        if (!src) {
            return (
                <div className={cn("aspect-video bg-muted/50 flex items-center justify-center rounded-lg", containerClassName)}>
                    <Video className="w-12 h-12 text-muted-foreground/50" />
                </div>
            );
        }

        return (
            <video
                ref={videoRef}
                src={src}
                poster={poster}
                className={className}
                autoPlay={autoplay}
                loop={loop}
                muted={muted}
                controls={controls}
                playsInline
            />
        );
    }

    // Edit mode: show video with overlay buttons
    return (
        <div
            className={cn("relative group", containerClassName)}
            data-editable="video"
            data-block-id={id}
            onMouseEnter={() => { setIsHovered(true); setHoverBlock(id); }}
            onMouseLeave={() => { setIsHovered(false); setHoverBlock(null); }}
            onClick={handleClick}
        >
            {/* Hidden file input */}
            <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                className="hidden"
                onChange={handleFileUpload}
            />

            {/* Video with border in edit mode */}
            <div className={cn(
                "relative overflow-hidden rounded-lg transition-all duration-150",
                "w-full h-full", // Ensure fills container
                "border-2 border-dashed",
                !isSelected && !isHovered && "border-transparent",
                !isSelected && isHovered && "border-purple-400/50",
                isSelected && "border-solid border-purple-500"
            )}>
                {src ? (
                    <video
                        ref={videoRef}
                        src={src}
                        poster={poster}
                        className={cn(className, "transition-all duration-150")}
                        autoPlay={false}
                        loop={loop}
                        muted={muted}
                        controls={false}
                        playsInline
                        onPlay={() => setIsPlaying(true)}
                        onPause={() => setIsPlaying(false)}
                    />
                ) : (
                    <div className={cn("aspect-video bg-muted/30 flex items-center justify-center", className)}>
                        <div className="text-center">
                            <Video className="w-12 h-12 text-muted-foreground/50 mx-auto mb-2" />
                            <p className="text-sm text-muted-foreground">Chưa có video</p>
                        </div>
                    </div>
                )}

                {/* Overlay buttons ON video */}
                {(isHovered || isSelected) && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center gap-3">
                        {/* Play/Pause button */}
                        {src && (
                            <button
                                onClick={togglePlayback}
                                className="flex flex-col items-center gap-1 px-4 py-3 bg-white hover:bg-gray-100 rounded-lg shadow-lg transition-all hover:scale-105"
                            >
                                {isPlaying ? (
                                    <Pause className="w-6 h-6 text-gray-700" />
                                ) : (
                                    <Play className="w-6 h-6 text-gray-700" />
                                )}
                                <span className="text-xs font-medium text-gray-700">
                                    {isPlaying ? 'Dừng' : 'Phát'}
                                </span>
                            </button>
                        )}

                        {/* Upload/Replace button */}
                        <button
                            onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                            disabled={isUploading}
                            className="flex flex-col items-center gap-1 px-4 py-3 bg-white hover:bg-gray-100 rounded-lg shadow-lg transition-all hover:scale-105 disabled:opacity-50"
                        >
                            {isUploading ? (
                                <RefreshCw className="w-6 h-6 text-gray-700 animate-spin" />
                            ) : (
                                <Upload className="w-6 h-6 text-gray-700" />
                            )}
                            <span className="text-xs font-medium text-gray-700">
                                {isUploading ? 'Đang tải...' : (src ? 'Thay video' : 'Tải video')}
                            </span>
                        </button>

                        {/* Remove button */}
                        {src && (
                            <button
                                onClick={handleRemoveVideo}
                                className="flex flex-col items-center gap-1 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-lg transition-all hover:scale-105"
                            >
                                <Trash2 className="w-6 h-6" />
                                <span className="text-xs font-medium">Xóa video</span>
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

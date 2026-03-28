'use client';

/**
 * EditableImage - Canva Style
 * Inline image editing with overlay buttons ON image
 * 
 * ✅ Simple file upload (base64)
 * ✅ Show Upload/Replace/Remove buttons on hover
 * ✅ Works reliably across all pages
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { Upload, Trash2, RefreshCw, ImageIcon } from 'lucide-react';
import { useEditMode } from '@/components/providers/edit-mode-provider';
import { cn } from '@/lib/utils';

interface EditableImageProps {
    id: string;
    defaultSrc: string;
    alt?: string;
    className?: string;
    containerClassName?: string;
    onImageChange?: (newSrc: string) => void;
}

const IMAGE_STORAGE_PREFIX = 'cms_image_';

export function EditableImage({
    id,
    defaultSrc,
    alt = '',
    className,
    containerClassName,
    onImageChange,
}: EditableImageProps) {
    const [src, setSrc] = useState(defaultSrc);
    const [originalSrc, setOriginalSrc] = useState(defaultSrc);
    const [isHovered, setIsHovered] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
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
    } catch {
        // Not in EditModeProvider
    }

    const isSelected = selectedBlockId === id;

    // Load saved image on mount
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedSrc = localStorage.getItem(`${IMAGE_STORAGE_PREFIX}${id}`);
            if (savedSrc) {
                setSrc(savedSrc);
                setOriginalSrc(savedSrc);
            } else {
                setOriginalSrc(defaultSrc);
            }
        }
    }, [id, defaultSrc]);

    const handleImageChange = useCallback((newSrc: string) => {
        setSrc(newSrc);
        if (typeof window !== 'undefined') {
            localStorage.setItem(`${IMAGE_STORAGE_PREFIX}${id}`, newSrc);
        }
        registerChange(id, originalSrc, newSrc, 'image');
        onImageChange?.(newSrc);
    }, [id, originalSrc, registerChange, onImageChange]);

    // Simple file upload with FileReader
    const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            return;
        }

        setIsUploading(true);
        const reader = new FileReader();

        reader.onload = (event) => {
            const base64 = event.target?.result as string;
            handleImageChange(base64);
            setIsUploading(false);
        };

        reader.onerror = () => {
            alert('Failed to read file');
            setIsUploading(false);
        };

        reader.readAsDataURL(file);

        // Reset input
        e.target.value = '';
    }, [handleImageChange]);

    const handleRemoveImage = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        // Reset to default or placeholder
        handleImageChange(defaultSrc || '/placeholder.jpg');
    }, [handleImageChange, defaultSrc]);

    const handleClick = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        selectBlock(id);
    }, [id, selectBlock]);

    const handleUploadClick = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        fileInputRef.current?.click();
    }, []);

    // Non-edit mode: just render the image
    if (!editMode) {
        return (
            <img
                src={src || defaultSrc}
                alt={alt}
                className={className}
            />
        );
    }

    // Edit mode: show image with overlay buttons
    return (
        <div
            className={cn("relative group", containerClassName)}
            data-editable="image"
            data-block-id={id}
            onMouseEnter={() => { setIsHovered(true); setHoverBlock(id); }}
            onMouseLeave={() => { setIsHovered(false); setHoverBlock(null); }}
            onClick={handleClick}
        >
            {/* Hidden file input */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
            />

            {/* Image with border in edit mode */}
            <div className={cn(
                "relative overflow-hidden rounded-lg transition-all duration-150",
                "w-full h-full", // Ensure fills container
                "border-2 border-dashed",
                !isSelected && !isHovered && "border-transparent",
                !isSelected && isHovered && "border-blue-400/50",
                isSelected && "border-solid border-blue-500"
            )}>
                {src ? (
                    <img
                        src={src}
                        alt={alt}
                        className={cn(className, "transition-all duration-150")}
                    />
                ) : (
                    <div className={cn("aspect-video bg-muted/30 flex items-center justify-center", className)}>
                        <ImageIcon className="w-12 h-12 text-muted-foreground/50" />
                    </div>
                )}

                {/* Overlay buttons ON image */}
                {(isHovered || isSelected) && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center gap-3">
                        {/* Upload/Replace button */}
                        <button
                            onClick={handleUploadClick}
                            disabled={isUploading}
                            className="flex flex-col items-center gap-1 px-4 py-3 bg-white hover:bg-gray-100 rounded-lg shadow-lg transition-all hover:scale-105 disabled:opacity-50"
                        >
                            {isUploading ? (
                                <RefreshCw className="w-6 h-6 text-gray-700 animate-spin" />
                            ) : (
                                <Upload className="w-6 h-6 text-gray-700" />
                            )}
                            <span className="text-xs font-medium text-gray-700">
                                {isUploading ? 'Đang tải...' : (src !== defaultSrc ? 'Thay ảnh' : 'Tải ảnh')}
                            </span>
                        </button>

                        {/* Remove button - only show if not default */}
                        {src && src !== defaultSrc && (
                            <button
                                onClick={handleRemoveImage}
                                className="flex flex-col items-center gap-1 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-lg transition-all hover:scale-105"
                            >
                                <Trash2 className="w-6 h-6" />
                                <span className="text-xs font-medium">Xóa ảnh</span>
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ImageIcon, Video, X, Check, Upload, Link2,
    Youtube, HardDrive, Trash2, Eye, Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useEditMode } from '@/components/providers/edit-mode-provider';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/toaster';

interface EditableMediaProps {
    id: string;
    defaultSrc: string;
    type?: 'image' | 'video' | 'auto';
    alt?: string;
    className?: string;
    containerClassName?: string;
}

const STORAGE_KEY_PREFIX = 'cms_media_';

// Extract YouTube video ID
function getYouTubeId(url: string): string | null {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s]+)/);
    return match ? match[1] : null;
}

// Check if URL is a Google Drive link
function isGoogleDriveUrl(url: string): boolean {
    return url.includes('drive.google.com');
}

// Convert Google Drive link to embed
function getGoogleDriveEmbed(url: string): string {
    const match = url.match(/\/d\/([^/]+)/);
    if (match) {
        return `https://drive.google.com/file/d/${match[1]}/preview`;
    }
    return url;
}

export function EditableMedia({
    id,
    defaultSrc,
    type = 'auto',
    alt = '',
    className,
    containerClassName
}: EditableMediaProps) {
    const [src, setSrc] = useState(defaultSrc);
    const [originalSrc, setOriginalSrc] = useState(defaultSrc);
    const [mediaType, setMediaType] = useState<'image' | 'video' | 'youtube' | 'gdrive'>(
        type === 'video' ? 'video' : 'image'
    );
    const [showPicker, setShowPicker] = useState(false);
    const [urlInput, setUrlInput] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [mediaLibrary, setMediaLibrary] = useState<{ url: string; type: string; name: string }[]>([]);
    const [isHovered, setIsHovered] = useState(false);
    const toast = useToast();

    let editMode = false;
    let registerChange: (id: string, original: string, current: string, type?: 'text' | 'image' | 'media') => void = () => { };
    try {
        const ctx = useEditMode();
        editMode = ctx.editMode;
        registerChange = ctx.registerChange;
    } catch {
        // Not in EditModeProvider
    }

    // Detect media type from URL
    const detectMediaType = useCallback((url: string) => {
        if (getYouTubeId(url)) return 'youtube';
        if (isGoogleDriveUrl(url)) return 'gdrive';
        if (url.match(/\.(mp4|webm|ogg)$/i)) return 'video';
        return 'image';
    }, []);

    // Load saved media
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}${id}`);
            if (saved) {
                const data = JSON.parse(saved);
                setSrc(data.src);
                setOriginalSrc(data.src);
                setMediaType(data.type || detectMediaType(data.src));
            } else {
                setOriginalSrc(defaultSrc);
                setMediaType(detectMediaType(defaultSrc));
            }

            // Load media library
            const media = localStorage.getItem('phu-vinh-admin-media');
            if (media) {
                setMediaLibrary(JSON.parse(media));
            }
        }
    }, [id, showPicker, detectMediaType, defaultSrc]);

    const handleSelectMedia = (newSrc: string) => {
        const type = detectMediaType(newSrc);
        setSrc(newSrc);
        setMediaType(type);

        if (typeof window !== 'undefined') {
            localStorage.setItem(`${STORAGE_KEY_PREFIX}${id}`, JSON.stringify({ src: newSrc, type }));
        }

        registerChange(id, originalSrc, newSrc, 'media');
        setShowPicker(false);
        toast.success('Đã cập nhật media');
    };

    const handleUrlSubmit = () => {
        if (urlInput.trim()) {
            handleSelectMedia(urlInput.trim());
            setUrlInput('');
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            // Create object URL for demo (in production, upload to server)
            const url = URL.createObjectURL(file);
            handleSelectMedia(url);

            // Add to media library
            const newMedia = {
                id: `media-${Date.now()}`,
                name: file.name,
                type: file.type.startsWith('video/') ? 'video' : 'image',
                url,
                uploadedAt: new Date().toISOString()
            };
            const updatedLibrary = [...mediaLibrary, newMedia];
            localStorage.setItem('phu-vinh-admin-media', JSON.stringify(updatedLibrary));
            setMediaLibrary(updatedLibrary as any);
        } finally {
            setIsUploading(false);
        }
    };

    const handleDelete = () => {
        setSrc('');
        if (typeof window !== 'undefined') {
            localStorage.removeItem(`${STORAGE_KEY_PREFIX}${id}`);
        }
        setShowPicker(false);
    };

    // Render media based on type
    const renderMedia = () => {
        if (!src) {
            return (
                <div className="w-full h-48 bg-secondary/50 flex items-center justify-center rounded-xl">
                    <ImageIcon className="w-12 h-12 text-muted-foreground/50" />
                </div>
            );
        }

        switch (mediaType) {
            case 'youtube':
                const ytId = getYouTubeId(src);
                return (
                    <iframe
                        src={`https://www.youtube.com/embed/${ytId}`}
                        className={cn("w-full aspect-video rounded-xl", className)}
                        allowFullScreen
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    />
                );
            case 'gdrive':
                return (
                    <div className={cn("relative w-full aspect-video rounded-xl overflow-hidden bg-black", className)}>
                        <iframe
                            src={getGoogleDriveEmbed(src)}
                            className="absolute border-0 w-full"
                            style={{ 
                                height: 'calc(100% + 65px)', 
                                top: '-65px' 
                            }}
                            allowFullScreen
                        />
                        {/* Overlay to block the popout icon area */}
                        <div className="absolute top-0 right-0 w-24 h-16 bg-transparent z-10" />
                    </div>
                );
            case 'video':
                return (
                    <video
                        src={src}
                        controls
                        className={cn("w-full rounded-xl", className)}
                    />
                );
            default:
                return (
                    <img
                        src={src}
                        alt={alt}
                        className={cn(className)}
                    />
                );
        }
    };

    // Non-edit mode: just render
    if (!editMode) {
        return renderMedia();
    }

    return (
        <div className={cn("relative group/editable-media", containerClassName)}>
            {renderMedia()}

            {/* Overlay with change button */}
            <motion.div
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                className="absolute inset-0 bg-black/50 flex items-center justify-center gap-2 opacity-0 group-hover/editable-media:opacity-100 transition-opacity rounded-xl"
            >
                <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setShowPicker(true)}
                    className="gap-2"
                >
                    {mediaType === 'image' ? <ImageIcon className="w-4 h-4" /> : <Video className="w-4 h-4" />}
                    Thay đổi
                </Button>
                {src && (
                    <Button
                        size="sm"
                        variant="destructive"
                        onClick={handleDelete}
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                )}
            </motion.div>

            {/* Media Picker Modal */}
            <AnimatePresence>
                {showPicker && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
                        onClick={() => setShowPicker(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-card rounded-2xl p-6 max-w-2xl w-full max-h-[85vh] overflow-y-auto"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold">Chọn hình ảnh / video</h3>
                                <Button size="icon" variant="ghost" onClick={() => setShowPicker(false)}>
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>

                            <Tabs defaultValue="library" className="w-full">
                                <TabsList className="w-full mb-4">
                                    <TabsTrigger value="library" className="flex-1 gap-2">
                                        <ImageIcon className="w-4 h-4" />
                                        Thư viện
                                    </TabsTrigger>
                                    <TabsTrigger value="upload" className="flex-1 gap-2">
                                        <Upload className="w-4 h-4" />
                                        Upload
                                    </TabsTrigger>
                                    <TabsTrigger value="url" className="flex-1 gap-2">
                                        <Link2 className="w-4 h-4" />
                                        URL
                                    </TabsTrigger>
                                </TabsList>

                                {/* Library Tab */}
                                <TabsContent value="library">
                                    {mediaLibrary.length === 0 ? (
                                        <div className="text-center py-12 text-muted-foreground">
                                            <ImageIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                            <p>Chưa có media trong thư viện</p>
                                            <p className="text-sm">Upload hoặc dùng URL để thêm</p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-3 gap-3">
                                            {mediaLibrary.map((item, index) => (
                                                <motion.button
                                                    key={index}
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    onClick={() => handleSelectMedia(item.url)}
                                                    className={cn(
                                                        "aspect-square rounded-lg overflow-hidden border-2 transition-colors relative",
                                                        src === item.url
                                                            ? "border-primary"
                                                            : "border-transparent hover:border-primary/50"
                                                    )}
                                                >
                                                    {item.type === 'video' ? (
                                                        <div className="w-full h-full bg-secondary flex items-center justify-center">
                                                            <Video className="w-8 h-8 text-muted-foreground" />
                                                        </div>
                                                    ) : (
                                                        <img
                                                            src={item.url}
                                                            alt={item.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    )}
                                                </motion.button>
                                            ))}
                                        </div>
                                    )}
                                </TabsContent>

                                {/* Upload Tab */}
                                <TabsContent value="upload">
                                    <div className="border-2 border-dashed border-border rounded-xl p-8 text-center">
                                        <input
                                            type="file"
                                            accept="image/*,video/*"
                                            onChange={handleFileUpload}
                                            className="hidden"
                                            id="media-upload"
                                        />
                                        <label
                                            htmlFor="media-upload"
                                            className="cursor-pointer"
                                        >
                                            {isUploading ? (
                                                <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin text-primary" />
                                            ) : (
                                                <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                                            )}
                                            <p className="text-lg font-medium">
                                                {isUploading ? 'Đang upload...' : 'Click để chọn file'}
                                            </p>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                Hỗ trợ JPG, PNG, GIF, MP4, WebM
                                            </p>
                                        </label>
                                    </div>
                                </TabsContent>

                                {/* URL Tab */}
                                <TabsContent value="url" className="space-y-4">
                                    <div>
                                        <label className="text-sm font-medium mb-2 block">
                                            URL hình ảnh hoặc video
                                        </label>
                                        <div className="flex gap-2">
                                            <Input
                                                placeholder="https://..."
                                                value={urlInput}
                                                onChange={e => setUrlInput(e.target.value)}
                                                onKeyDown={e => e.key === 'Enter' && handleUrlSubmit()}
                                            />
                                            <Button onClick={handleUrlSubmit}>
                                                <Check className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="p-4 rounded-xl bg-secondary/50 border border-border">
                                            <Youtube className="w-6 h-6 text-red-500 mb-2" />
                                            <p className="font-medium text-sm">YouTube</p>
                                            <p className="text-xs text-muted-foreground">
                                                Dán link YouTube để nhúng video
                                            </p>
                                        </div>
                                        <div className="p-4 rounded-xl bg-secondary/50 border border-border">
                                            <HardDrive className="w-6 h-6 text-yellow-500 mb-2" />
                                            <p className="font-medium text-sm">Google Drive</p>
                                            <p className="text-xs text-muted-foreground">
                                                Dán link chia sẻ Google Drive
                                            </p>
                                        </div>
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Upload, Image as ImageIcon, X, CheckCircle2, XCircle, Loader2,
    Camera, MapPin, AlertTriangle, Send
} from 'lucide-react';
import { useLanguage } from '@/components/providers/language-provider';

interface UploadedImage {
    id: string;
    file: File;
    preview: string;
    category: string;
    status: 'pending' | 'checking' | 'approved' | 'rejected';
    message?: string;
}

const categories = [
    { id: 'heritage', label: { vi: 'Di sản văn hóa', en: 'Cultural Heritage' }, icon: '🏛️' },
    { id: 'destinations', label: { vi: 'Điểm đến', en: 'Destinations' }, icon: '🏖️' },
    { id: 'crafts', label: { vi: 'Làng nghề', en: 'Crafts' }, icon: '🏺' },
    { id: 'food', label: { vi: 'Ẩm thực', en: 'Food' }, icon: '🍲' },
    { id: 'festival', label: { vi: 'Lễ hội', en: 'Festivals' }, icon: '🎭' },
];

const content = {
    title: { vi: 'Đóng góp hình ảnh', en: 'Contribute Images' },
    subtitle: { vi: 'Chia sẻ hình ảnh đẹp về Phú Vinh để giúp mọi người khám phá', en: 'Share beautiful images of Phu Vinh to help others explore' },
    selectCategory: { vi: 'Chọn danh mục', en: 'Select Category' },
    dropzone: { vi: 'Kéo thả hoặc nhấn để chọn ảnh', en: 'Drag & drop or click to select images' },
    requirements: { vi: 'Yêu cầu: JPG/PNG, tối đa 5MB, ảnh rõ nét', en: 'Requirements: JPG/PNG, max 5MB, clear images' },
    checking: { vi: 'AI đang kiểm tra...', en: 'AI checking...' },
    approved: { vi: 'Ảnh đạt chuẩn!', en: 'Image approved!' },
    rejected: { vi: 'Ảnh chưa đạt', en: 'Image rejected' },
    submit: { vi: 'Gửi đóng góp', en: 'Submit Contribution' },
    submitting: { vi: 'Đang gửi...', en: 'Submitting...' },
    success: { vi: 'Cảm ơn bạn đã đóng góp!', en: 'Thank you for your contribution!' },
    aiReasons: {
        quality: { vi: 'Ảnh rõ nét, chất lượng tốt', en: 'Clear image, good quality' },
        relevant: { vi: 'Nội dung phù hợp với Phú Vinh', en: 'Content relevant to Phu Vinh' },
        blur: { vi: 'Ảnh bị mờ, cần ảnh rõ nét hơn', en: 'Image is blurry, needs clearer photo' },
        irrelevant: { vi: 'Nội dung không liên quan đến Phú Vinh', en: 'Content not related to Phu Vinh' },
        size: { vi: 'Kích thước file quá nhỏ', en: 'File size too small' },
    }
};

export function ImageUpload() {
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { language } = useLanguage();
    const lang = language as 'vi' | 'en';

    const handleFileSelect = useCallback(async (files: FileList | null) => {
        if (!files || !selectedCategory) return;

        const newImages: UploadedImage[] = [];

        for (let i = 0; i < Math.min(files.length, 5); i++) {
            const file = files[i];
            if (!file.type.startsWith('image/')) continue;
            if (file.size > 5 * 1024 * 1024) continue; // 5MB limit

            const id = `img-${Date.now()}-${i}`;
            const preview = URL.createObjectURL(file);

            newImages.push({
                id,
                file,
                preview,
                category: selectedCategory,
                status: 'pending'
            });
        }

        setUploadedImages(prev => [...prev, ...newImages]);

        // Simulate AI checking for each image
        for (const img of newImages) {
            await simulateAICheck(img.id);
        }
    }, [selectedCategory]);

    const simulateAICheck = async (imageId: string) => {
        // Set to checking
        setUploadedImages(prev => prev.map(img =>
            img.id === imageId ? { ...img, status: 'checking' } : img
        ));

        // Simulate AI processing time
        await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1500));

        // Simulate AI decision (80% approval rate for demo)
        const isApproved = Math.random() > 0.2;
        const reasons = isApproved
            ? [content.aiReasons.quality[lang], content.aiReasons.relevant[lang]]
            : [Math.random() > 0.5 ? content.aiReasons.blur[lang] : content.aiReasons.irrelevant[lang]];

        setUploadedImages(prev => prev.map(img =>
            img.id === imageId
                ? {
                    ...img,
                    status: isApproved ? 'approved' : 'rejected',
                    message: reasons[0]
                }
                : img
        ));
    };

    const removeImage = (imageId: string) => {
        setUploadedImages(prev => {
            const img = prev.find(i => i.id === imageId);
            if (img) URL.revokeObjectURL(img.preview);
            return prev.filter(i => i.id !== imageId);
        });
    };

    const handleSubmit = async () => {
        const approvedImages = uploadedImages.filter(img => img.status === 'approved');
        if (approvedImages.length === 0) return;

        setIsSubmitting(true);

        // Simulate submission - in reality, would save to /public/images/contributions/
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Save to localStorage as contribution record
        const contributions = JSON.parse(localStorage.getItem('phu-vinh-contributions') || '[]');
        contributions.push({
            timestamp: new Date().toISOString(),
            category: selectedCategory,
            count: approvedImages.length
        });
        localStorage.setItem('phu-vinh-contributions', JSON.stringify(contributions));

        setIsSubmitting(false);
        setSubmitted(true);
        setUploadedImages([]);

        // Reset after 3 seconds
        setTimeout(() => {
            setSubmitted(false);
            setSelectedCategory('');
        }, 3000);
    };

    const approvedCount = uploadedImages.filter(img => img.status === 'approved').length;

    return (
        <Card className="bg-card/50 backdrop-blur border-border/50">
            <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                    <Camera className="w-5 h-5 text-blue-400" />
                    <h2 className="font-bold">{content.title[lang]}</h2>
                </div>
                <p className="text-sm text-muted-foreground mb-6">{content.subtitle[lang]}</p>

                <AnimatePresence mode="wait">
                    {submitted ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-center py-8"
                        >
                            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                            <p className="font-medium text-green-500">{content.success[lang]}</p>
                        </motion.div>
                    ) : (
                        <motion.div initial={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            {/* Category Selection */}
                            <div className="mb-4">
                                <p className="text-sm font-medium mb-2">{content.selectCategory[lang]}</p>
                                <div className="flex flex-wrap gap-2">
                                    {categories.map(cat => (
                                        <button
                                            key={cat.id}
                                            onClick={() => setSelectedCategory(cat.id)}
                                            className={`px-3 py-2 rounded-lg text-sm transition-all ${selectedCategory === cat.id
                                                ? 'bg-blue-500 text-white'
                                                : 'bg-secondary hover:bg-secondary/80'
                                                }`}
                                        >
                                            {cat.icon} {cat.label[lang]}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Upload Zone */}
                            {selectedCategory && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        onDragOver={(e) => e.preventDefault()}
                                        onDrop={(e) => {
                                            e.preventDefault();
                                            handleFileSelect(e.dataTransfer.files);
                                        }}
                                        className="border-2 border-dashed border-border/50 rounded-xl p-8 text-center cursor-pointer hover:border-blue-500/50 transition-colors"
                                    >
                                        <Upload className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
                                        <p className="text-sm font-medium">{content.dropzone[lang]}</p>
                                        <p className="text-xs text-muted-foreground mt-1">{content.requirements[lang]}</p>
                                    </div>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        className="hidden"
                                        onChange={(e) => handleFileSelect(e.target.files)}
                                    />
                                </motion.div>
                            )}

                            {/* Uploaded Images Preview */}
                            {uploadedImages.length > 0 && (
                                <div className="mt-4 space-y-3">
                                    {uploadedImages.map(img => (
                                        <motion.div
                                            key={img.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50"
                                        >
                                            <img
                                                src={img.preview}
                                                alt="Preview"
                                                className="w-16 h-16 rounded-lg object-cover"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium truncate">{img.file.name}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    {img.status === 'checking' && (
                                                        <Badge className="bg-blue-500/20 text-blue-400">
                                                            <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                                                            {content.checking[lang]}
                                                        </Badge>
                                                    )}
                                                    {img.status === 'approved' && (
                                                        <Badge className="bg-green-500/20 text-green-400">
                                                            <CheckCircle2 className="w-3 h-3 mr-1" />
                                                            {content.approved[lang]}
                                                        </Badge>
                                                    )}
                                                    {img.status === 'rejected' && (
                                                        <Badge className="bg-red-500/20 text-red-400">
                                                            <XCircle className="w-3 h-3 mr-1" />
                                                            {content.rejected[lang]}
                                                        </Badge>
                                                    )}
                                                </div>
                                                {img.message && (
                                                    <p className="text-xs text-muted-foreground mt-1">{img.message}</p>
                                                )}
                                            </div>
                                            <button
                                                onClick={() => removeImage(img.id)}
                                                className="p-1 hover:bg-secondary rounded"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </motion.div>
                                    ))}
                                </div>
                            )}

                            {/* Submit Button */}
                            {approvedCount > 0 && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="mt-4"
                                >
                                    <Button
                                        onClick={handleSubmit}
                                        disabled={isSubmitting}
                                        className="w-full bg-green-500 hover:bg-green-600"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                {content.submitting[lang]}
                                            </>
                                        ) : (
                                            <>
                                                <Send className="w-4 h-4 mr-2" />
                                                {content.submit[lang]} ({approvedCount})
                                            </>
                                        )}
                                    </Button>
                                </motion.div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </CardContent>
        </Card>
    );
}

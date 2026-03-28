'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Upload, Camera, CheckCircle2, XCircle, Loader2,
    MapPin, Send, Image as ImageIcon, AlertTriangle, Sparkles
} from 'lucide-react';
import { useLanguage } from '@/components/providers/language-provider';

// All destinations in Phu Vinh that users can contribute images for
const destinations = [
    { id: 'thap-cham-phu-dien', name: { vi: 'Tháp Chăm Phú Diên', en: 'Phu Dien Cham Tower' }, category: 'heritage', keywords: ['tháp', 'chăm', 'cổ', 'tower', 'champa', 'ancient'] },
    { id: 'dinh-ha-thanh', name: { vi: 'Đình Hà Thanh', en: 'Ha Thanh Communal House' }, category: 'heritage', keywords: ['đình', 'làng', 'temple', 'communal'] },
    { id: 'chua-an-bang', name: { vi: 'Chùa An Bằng', en: 'An Bang Pagoda' }, category: 'heritage', keywords: ['chùa', 'pagoda', 'buddhist', 'temple'] },
    { id: 'lang-mo-an-bang', name: { vi: 'Lăng mộ An Bằng', en: 'An Bang Tomb Complex' }, category: 'heritage', keywords: ['lăng', 'mộ', 'tomb', 'cemetery'] },
    { id: 'bien-vinh-thanh', name: { vi: 'Biển Vinh Thanh', en: 'Vinh Thanh Beach' }, category: 'destinations', keywords: ['biển', 'bãi', 'beach', 'sea', 'ocean'] },
    { id: 'bien-phu-dien', name: { vi: 'Biển Phú Diên', en: 'Phu Dien Beach' }, category: 'destinations', keywords: ['biển', 'beach', 'fishing', 'boat'] },
    { id: 'dam-tam-giang', name: { vi: 'Đầm Tam Giang', en: 'Tam Giang Lagoon' }, category: 'destinations', keywords: ['đầm', 'lagoon', 'water', 'fishing', 'sunset'] },
    { id: 'le-hoi-cau-ngu', name: { vi: 'Lễ hội Cầu Ngư', en: 'Cau Ngu Festival' }, category: 'festivals', keywords: ['lễ', 'hội', 'festival', 'boat', 'racing'] },
    { id: 'nuoc-ot-vinh-xuan', name: { vi: 'Nước ớt Vinh Xuân', en: 'Vinh Xuan Chili Sauce' }, category: 'crafts', keywords: ['ớt', 'chili', 'sauce', 'bottle', 'red'] },
    { id: 'mam-phu-dien', name: { vi: 'Mắm Phú Diên', en: 'Phu Dien Fish Sauce' }, category: 'crafts', keywords: ['mắm', 'fish', 'sauce', 'jar'] },
    { id: 'mam-ca-ho', name: { vi: 'Mắm cá hố An Bằng', en: 'An Bang Hairtail Fish Sauce' }, category: 'crafts', keywords: ['mắm', 'cá', 'fish', 'sauce'] },
    { id: 'banh-ep', name: { vi: 'Bánh ép An Bằng', en: 'An Bang Pressed Cake' }, category: 'crafts', keywords: ['bánh', 'cake', 'food', 'pressed'] },
];

const content = {
    hero: {
        badge: { vi: 'Đóng góp hình ảnh', en: 'Contribute Images' },
        title: { vi: 'Chia sẻ hình ảnh Phú Vinh', en: 'Share Phu Vinh Images' },
        subtitle: { vi: 'Đóng góp hình ảnh của bạn để giúp mọi người khám phá vẻ đẹp địa phương', en: 'Contribute your images to help everyone explore local beauty' },
    },
    form: {
        selectDestination: { vi: 'Chọn địa điểm', en: 'Select Destination' },
        selectPlaceholder: { vi: '-- Chọn địa điểm trong ảnh --', en: '-- Select the location in photo --' },
        uploadTitle: { vi: 'Tải ảnh lên', en: 'Upload Image' },
        dropzone: { vi: 'Kéo thả hoặc nhấn để chọn ảnh', en: 'Drag & drop or click to select' },
        requirements: { vi: 'JPG/PNG, tối đa 5MB, ảnh rõ nét', en: 'JPG/PNG, max 5MB, clear images' },
        checking: { vi: 'AI đang kiểm tra...', en: 'AI checking...' },
        submit: { vi: 'Gửi đóng góp', en: 'Submit Contribution' },
    },
    status: {
        approved: { vi: '✅ Ảnh đạt chuẩn! Đang lưu...', en: '✅ Image approved! Saving...' },
        rejected: { vi: '❌ Ảnh không phù hợp', en: '❌ Image not suitable' },
        saved: { vi: '🎉 Đã lưu thành công!', en: '🎉 Saved successfully!' },
        wrongLocation: { vi: 'Nội dung ảnh không khớp với địa điểm đã chọn', en: 'Image content does not match selected location' },
        lowQuality: { vi: 'Ảnh bị mờ hoặc chất lượng thấp', en: 'Image is blurry or low quality' },
        notRelevant: { vi: 'Ảnh không liên quan đến du lịch Phú Vinh', en: 'Image not related to Phu Vinh tourism' },
    },
    guidelines: {
        title: { vi: 'Hướng dẫn', en: 'Guidelines' },
        items: {
            vi: [
                'Chọn đúng địa điểm xuất hiện trong ảnh',
                'Ảnh phải rõ nét, không bị mờ',
                'Ảnh phải liên quan đến du lịch Phú Vinh',
                'Không chứa nội dung không phù hợp',
            ],
            en: [
                'Select the correct location shown in the photo',
                'Image must be clear, not blurry',
                'Image must be related to Phu Vinh tourism',
                'No inappropriate content',
            ]
        }
    }
};

export default function ContributePage() {
    const [selectedDestination, setSelectedDestination] = useState<string>('');
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string>('');
    const [status, setStatus] = useState<'idle' | 'checking' | 'approved' | 'rejected' | 'saved'>('idle');
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { language } = useLanguage();
    const lang = language as 'vi' | 'en';

    const handleFileSelect = useCallback((files: FileList | null) => {
        if (!files || files.length === 0) return;

        const file = files[0];
        if (!file.type.startsWith('image/')) return;
        if (file.size > 5 * 1024 * 1024) return;

        setUploadedFile(file);
        setPreview(URL.createObjectURL(file));
        setStatus('idle');
        setErrorMessage('');
    }, []);

    const checkImageWithAI = async (): Promise<{ approved: boolean; reason: string }> => {
        // Simulate AI checking with Gemini
        // In production, this would call /api/check-image endpoint
        await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 1500));

        const destination = destinations.find(d => d.id === selectedDestination);
        if (!destination) {
            return { approved: false, reason: content.status.wrongLocation[lang] };
        }

        // Simulate 85% approval rate for demo
        const isApproved = Math.random() > 0.15;

        if (!isApproved) {
            const reasons = [
                content.status.wrongLocation[lang],
                content.status.lowQuality[lang],
                content.status.notRelevant[lang],
            ];
            return { approved: false, reason: reasons[Math.floor(Math.random() * reasons.length)] };
        }

        return { approved: true, reason: '' };
    };

    const handleSubmit = async () => {
        if (!selectedDestination || !uploadedFile) return;

        setStatus('checking');
        setIsSubmitting(true);

        try {
            const result = await checkImageWithAI();

            if (result.approved) {
                setStatus('approved');

                // Simulate saving to server
                await new Promise(resolve => setTimeout(resolve, 1000));

                // Save contribution record to localStorage
                const contributions = JSON.parse(localStorage.getItem('phu-vinh-contributions') || '[]');
                contributions.push({
                    id: `contrib-${Date.now()}`,
                    destination: selectedDestination,
                    fileName: uploadedFile.name,
                    timestamp: new Date().toISOString(),
                    status: 'approved'
                });
                localStorage.setItem('phu-vinh-contributions', JSON.stringify(contributions));

                setStatus('saved');

                // Reset after 3 seconds
                setTimeout(() => {
                    setUploadedFile(null);
                    setPreview('');
                    setSelectedDestination('');
                    setStatus('idle');
                }, 3000);
            } else {
                setStatus('rejected');
                setErrorMessage(result.reason);
            }
        } catch (error) {
            setStatus('rejected');
            setErrorMessage(content.status.notRelevant[lang]);
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        setUploadedFile(null);
        setPreview('');
        setStatus('idle');
        setErrorMessage('');
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const selectedDest = destinations.find(d => d.id === selectedDestination);

    return (
        <div className="min-h-screen pt-14 pb-20">
            {/* Hero */}
            <section className="py-12 px-4 hero-gradient">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <Badge className="mb-4 bg-blue-500/20 text-blue-400">
                            <Camera className="w-3 h-3 mr-1" />
                            {content.hero.badge[lang]}
                        </Badge>
                        <h1 className="text-3xl md:text-4xl font-bold mb-4">
                            {content.hero.title[lang]}
                        </h1>
                        <p className="text-muted-foreground max-w-xl mx-auto">
                            {content.hero.subtitle[lang]}
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Contribution Form */}
            <section className="py-8 px-4">
                <div className="max-w-2xl mx-auto">
                    <Card className="bg-card/50 backdrop-blur border-border/50">
                        <CardContent className="p-6">
                            {/* Step 1: Select Destination */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-blue-400" />
                                    {content.form.selectDestination[lang]}
                                </label>
                                <select
                                    value={selectedDestination}
                                    onChange={(e) => setSelectedDestination(e.target.value)}
                                    className="w-full p-3 rounded-xl bg-secondary border border-border focus:border-blue-500 focus:outline-none transition-colors"
                                >
                                    <option value="">{content.form.selectPlaceholder[lang]}</option>
                                    <optgroup label={lang === 'vi' ? '🏛️ Di sản văn hóa' : '🏛️ Cultural Heritage'}>
                                        {destinations.filter(d => d.category === 'heritage').map(dest => (
                                            <option key={dest.id} value={dest.id}>{dest.name[lang]}</option>
                                        ))}
                                    </optgroup>
                                    <optgroup label={lang === 'vi' ? '🏖️ Điểm đến' : '🏖️ Destinations'}>
                                        {destinations.filter(d => d.category === 'destinations').map(dest => (
                                            <option key={dest.id} value={dest.id}>{dest.name[lang]}</option>
                                        ))}
                                    </optgroup>
                                    <optgroup label={lang === 'vi' ? '🏺 Làng nghề' : '🏺 Crafts'}>
                                        {destinations.filter(d => d.category === 'crafts').map(dest => (
                                            <option key={dest.id} value={dest.id}>{dest.name[lang]}</option>
                                        ))}
                                    </optgroup>
                                    <optgroup label={lang === 'vi' ? '🎭 Lễ hội' : '🎭 Festivals'}>
                                        {destinations.filter(d => d.category === 'festivals').map(dest => (
                                            <option key={dest.id} value={dest.id}>{dest.name[lang]}</option>
                                        ))}
                                    </optgroup>
                                </select>
                            </div>

                            {/* Step 2: Upload Image */}
                            {selectedDestination && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mb-6"
                                >
                                    <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                                        <ImageIcon className="w-4 h-4 text-blue-400" />
                                        {content.form.uploadTitle[lang]}
                                    </label>

                                    {!uploadedFile ? (
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
                                            <p className="text-sm font-medium">{content.form.dropzone[lang]}</p>
                                            <p className="text-xs text-muted-foreground mt-1">{content.form.requirements[lang]}</p>
                                        </div>
                                    ) : (
                                        <div className="relative rounded-xl overflow-hidden">
                                            <img
                                                src={preview}
                                                alt="Preview"
                                                className="w-full h-64 object-cover"
                                            />
                                            {status === 'idle' && (
                                                <button
                                                    onClick={resetForm}
                                                    className="absolute top-2 right-2 p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
                                                >
                                                    <XCircle className="w-5 h-5 text-white" />
                                                </button>
                                            )}

                                            {/* Status Overlay */}
                                            <AnimatePresence>
                                                {status !== 'idle' && (
                                                    <motion.div
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        exit={{ opacity: 0 }}
                                                        className={`absolute inset-0 flex items-center justify-center ${status === 'checking' ? 'bg-blue-900/80' :
                                                            status === 'approved' || status === 'saved' ? 'bg-green-900/80' :
                                                                'bg-red-900/80'
                                                            }`}
                                                    >
                                                        <div className="text-center text-white p-4">
                                                            {status === 'checking' && (
                                                                <>
                                                                    <Loader2 className="w-12 h-12 mx-auto mb-3 animate-spin" />
                                                                    <p className="flex items-center gap-2 justify-center">
                                                                        <Sparkles className="w-4 h-4" />
                                                                        {content.form.checking[lang]}
                                                                    </p>
                                                                </>
                                                            )}
                                                            {status === 'approved' && (
                                                                <>
                                                                    <CheckCircle2 className="w-12 h-12 mx-auto mb-3" />
                                                                    <p>{content.status.approved[lang]}</p>
                                                                </>
                                                            )}
                                                            {status === 'saved' && (
                                                                <>
                                                                    <CheckCircle2 className="w-12 h-12 mx-auto mb-3" />
                                                                    <p>{content.status.saved[lang]}</p>
                                                                </>
                                                            )}
                                                            {status === 'rejected' && (
                                                                <>
                                                                    <XCircle className="w-12 h-12 mx-auto mb-3" />
                                                                    <p className="mb-2">{content.status.rejected[lang]}</p>
                                                                    <p className="text-sm opacity-80">{errorMessage}</p>
                                                                </>
                                                            )}
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    )}

                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => handleFileSelect(e.target.files)}
                                    />
                                </motion.div>
                            )}

                            {/* Selected destination badge */}
                            {selectedDest && (
                                <div className="mb-4">
                                    <Badge className="bg-blue-500/20 text-blue-400">
                                        <MapPin className="w-3 h-3 mr-1" />
                                        {selectedDest.name[lang]}
                                    </Badge>
                                </div>
                            )}

                            {/* Submit Button */}
                            {uploadedFile && status === 'idle' && (
                                <Button
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                                    className="w-full bg-blue-500 hover:bg-blue-600"
                                >
                                    <Sparkles className="w-4 h-4 mr-2" />
                                    {content.form.submit[lang]}
                                </Button>
                            )}

                            {/* Try Again Button */}
                            {status === 'rejected' && (
                                <Button
                                    onClick={resetForm}
                                    variant="outline"
                                    className="w-full mt-4"
                                >
                                    {lang === 'vi' ? 'Thử lại' : 'Try Again'}
                                </Button>
                            )}
                        </CardContent>
                    </Card>

                    {/* Guidelines */}
                    <Card className="bg-card/50 backdrop-blur border-border/50 mt-6">
                        <CardContent className="p-6">
                            <h3 className="font-medium mb-3 flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4 text-amber-400" />
                                {content.guidelines.title[lang]}
                            </h3>
                            <ul className="space-y-2">
                                {content.guidelines.items[lang].map((item, i) => (
                                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </section>
        </div>
    );
}

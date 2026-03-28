'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Box, Smartphone, Info } from 'lucide-react';
import { useLanguage } from '@/components/providers/language-provider';
import { ARViewer } from '@/components/features/explore-3d/ARViewer';

// AR Collection Data
const arModels = [
    {
        id: 'thap-cham',
        name: { vi: 'Tháp Chăm Phú Diên', en: 'Phu Dien Cham Tower' },
        description: {
            vi: 'Tháp cổ Champa thế kỷ VIII chìm sâu dưới lòng cát ven biển. Được công nhận kỷ lục Thế giới.',
            en: '8th-century Cham Tower buried deep under coastal sand. Recognized as a World Record.'
        },
        modelSrc: '', // Use Sketchfab embed instead of local glb for faster loading
        poster: '/images/heritage/thap-cham-1.jpg',
        embedUrl: 'https://sketchfab.com/models/1da045e230c64d78b1317c412547a590/embed?autostart=1&ui_theme=dark',
        color: '#2d5a57',
        icon: '🏛️'
    },
    {
        id: 'dinh-ha-thanh',
        name: { vi: 'Đình Hà Thanh', en: 'Ha Thanh Communal House' },
        description: {
            vi: 'Ngôi đình cổ thế kỷ XVI mang đậm kiến trúc truyền thống xứ Huế, biểu trưng cho sự đoàn kết cộng đồng.',
            en: '16th-century ancient communal house with traditional Hue architecture, symbolizing community solidarity.'
        },
        modelSrc: '', // Placeholder, as no model exists yet. Can show a "Coming soon" state.
        poster: '/images/heritage/dinh-ha-thanh-1.jpg',
        embedUrl: '',
        color: '#5a8a87',
        icon: '🏯'
    }
];

export default function ExploreARPage() {
    const { language } = useLanguage();
    const lang = language as 'vi' | 'en';
    const [selectedModel, setSelectedModel] = useState<typeof arModels[0] | null>(arModels[0]);

    return (
        <div className="min-h-screen pt-20 pb-20 bg-background text-foreground">
            {/* Header Section */}
            <section className="pt-8 pb-12 px-4 bg-gradient-to-b from-[#2d5a57]/10 to-transparent dark:from-[#2d5a57]/20">
                <div className="max-w-6xl mx-auto text-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <Badge className="mb-4 bg-[#2d5a57]/20 text-[#2d5a57] dark:text-emerald-400 border-[#2d5a57]/30">
                            <Smartphone className="w-3.5 h-3.5 mr-2" />
                            {lang === 'vi' ? 'Trải nghiệm AR & 3D' : 'AR & 3D Experience'}
                        </Badge>
                        <h1 className="text-3xl md:text-5xl font-bold mb-4 text-[#2d5a57] dark:text-emerald-400">
                            {lang === 'vi' ? 'Khám Phá ' : 'Explore '}
                            <span className="text-[#5a8a87] dark:text-emerald-300">
                                {lang === 'vi' ? 'Di Sản 3D' : '3D Heritage'}
                            </span>
                        </h1>
                        <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                            {lang === 'vi'
                                ? 'Trải nghiệm trực quan các công trình kiến trúc lịch sử của Phú Vinh thông qua công nghệ mô phỏng 3D chi tiết.'
                                : 'Visually experience the historical architectural structures of Phu Vinh through detailed 3D simulation technology.'
                            }
                        </p>
                    </motion.div>
                </div>
            </section>

            <div className="max-w-6xl mx-auto px-4 mt-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Viewer Area (Left, 2 columns on large screens) */}
                    <div className="lg:col-span-2 order-2 lg:order-1">
                        <AnimatePresence mode="wait">
                            {selectedModel ? (
                                <motion.div
                                    key={selectedModel.id}
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.98 }}
                                    transition={{ duration: 0.3 }}
                                    className="h-full min-h-[500px] flex flex-col relative z-0"
                                >
                                    <div className="bg-card rounded-2xl overflow-hidden shadow-2xl border border-border/50 flex-1 flex flex-col relative group">
                                        <div className="p-6 border-b border-border/50 bg-muted/30">
                                            <h2 className="text-2xl font-bold text-[#2d5a57] dark:text-emerald-400 flex items-center gap-3">
                                                <span className="text-3xl">{selectedModel.icon}</span>
                                                {selectedModel.name[lang]}
                                            </h2>
                                            <p className="text-muted-foreground mt-2">
                                                {selectedModel.description[lang]}
                                            </p>
                                        </div>

                                        <div className="w-full flex-1 min-h-[500px] bg-slate-900 flex items-center justify-center relative">
                                            {selectedModel.modelSrc ? (
                                              <ARViewer
                                                src={selectedModel.modelSrc}
                                                poster={selectedModel.poster}
                                                alt={selectedModel.name[lang]}
                                                className="w-full h-full absolute inset-0 rounded-none mix-blend-screen"
                                              />
                                            ) : selectedModel.embedUrl ? (
                                                <div className="sketchfab-embed-wrapper w-full h-full absolute inset-0">
                                                    <iframe
                                                        title={selectedModel.name[lang]}
                                                        frameBorder="0"
                                                        allowFullScreen
                                                        // @ts-ignore
                                                        mozallowfullscreen="true"
                                                        // @ts-ignore
                                                        webkitallowfullscreen="true"
                                                        allow="autoplay; fullscreen; xr-spatial-tracking"
                                                        // @ts-ignore
                                                        xr-spatial-tracking="true"
                                                        // @ts-ignore
                                                        execution-while-out-of-viewport="true"
                                                        // @ts-ignore
                                                        execution-while-not-rendered="true"
                                                        // @ts-ignore
                                                        web-share="true"
                                                        loading="lazy"
                                                        src={selectedModel.embedUrl}
                                                        className="w-full h-full"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="text-center text-slate-400 p-8">
                                                    <Box className="w-20 h-20 mx-auto mb-4 opacity-50 text-[#2d5a57]" />
                                                    <h3 className="text-xl font-medium text-white mb-2">
                                                        {lang === 'vi' ? 'Đang cập nhật mô hình 3D' : '3D Model Coming Soon'}
                                                    </h3>
                                                    <p className="max-w-md mx-auto">
                                                        {lang === 'vi' 
                                                            ? 'Đội ngũ dự án đang trong quá trình số hóa và xây dựng mô hình 3D cho di tích này. Vui lòng quay lại sau.'
                                                            : 'Project team is in the process of digitizing and building the 3D model for this monument. Please check back later.'
                                                        }
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ) : null}
                        </AnimatePresence>
                    </div>

                    {/* Sidebar / List (Right) */}
                    <div className="lg:col-span-1 space-y-6 order-1 lg:order-2">
                        <div className="bg-card rounded-2xl p-6 shadow-lg border border-border/50 relative z-10">
                            <h2 className="text-xl font-bold mb-6 flex items-center text-[#2d5a57] dark:text-emerald-400">
                                <Box className="w-6 h-6 mr-3" />
                                {lang === 'vi' ? 'Danh sách Di tích 3D' : '3D Heritage List'}
                            </h2>

                            <div className="space-y-4">
                                {arModels.map((model) => (
                                    <div
                                        key={model.id}
                                        onClick={() => setSelectedModel(model)}
                                        className={`p-4 rounded-xl cursor-pointer transition-all border-2 flex items-center gap-4 ${
                                            selectedModel?.id === model.id
                                                ? 'border-[#2d5a57] bg-[#2d5a57]/5 shadow-md'
                                                : 'border-transparent bg-muted/50 hover:bg-muted'
                                        }`}
                                    >
                                        <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center text-2xl shadow-sm shrink-0 border border-border/50">
                                            {model.icon}
                                        </div>
                                        <div>
                                            <h3 className={`font-semibold ${selectedModel?.id === model.id ? 'text-[#2d5a57] dark:text-emerald-400' : ''}`}>
                                                {model.name[lang]}
                                            </h3>
                                            {(!model.embedUrl && !model.modelSrc) && (
                                                <span className="text-[10px] uppercase tracking-wider font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full mt-1 inline-block">
                                                    {lang === 'vi' ? 'Sắp ra mắt' : 'Coming Soon'}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Instructions */}
                        <div className="bg-[#2d5a57]/5 dark:bg-[#2d5a57]/10 p-6 rounded-2xl border border-[#2d5a57]/20 relative z-10">
                            <h4 className="font-bold text-[#2d5a57] dark:text-emerald-400 mb-4 flex items-center text-lg">
                                <Info className="w-5 h-5 mr-3" />
                                {lang === 'vi' ? 'Hướng dẫn thao tác' : 'Interaction Guide'}
                            </h4>
                            <ul className="space-y-3 text-muted-foreground text-sm">
                                <li className="flex gap-3">
                                    <span className="font-bold text-[#2d5a57]">•</span>
                                    {lang === 'vi' ? 'Sử dụng chuột trái (hoặc 1 ngón tay) để xoay mô hình 360 độ.' : 'Use left click (or 1 finger) to rotate the model 360 degrees.'}
                                </li>
                                <li className="flex gap-3">
                                    <span className="font-bold text-[#2d5a57]">•</span>
                                    {lang === 'vi' ? 'Cuộn chuột (hoặc chụm 2 ngón tay) để phóng to/thu nhỏ chi tiết.' : 'Scroll wheel (or pinch 2 fingers) to zoom in/out on details.'}
                                </li>
                                <li className="flex gap-3">
                                    <span className="font-bold text-[#2d5a57]">•</span>
                                    {lang === 'vi' ? 'Nhấn nút Khởi động (nếu có ARViewer), hoặc giữ chuột phải để di chuyển tâm nhìn.' : 'Click start (if using ARViewer), or use right click to pan the viewpoint.'}
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

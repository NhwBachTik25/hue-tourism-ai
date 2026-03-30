'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Landmark, MapPin, Navigation, Clock, History,
    Play, Pause, Volume2, Info, Star, ImageIcon, Camera, MessageCircle
} from 'lucide-react';
import { useLanguage } from '@/components/providers/language-provider';
import { EditableText } from '@/components/cms/EditableText';
import { EditableImage } from '@/components/cms/EditableImage';
import { ImagePreview } from '@/components/ui/image-preview';
import { cn } from '@/lib/utils';

// Bilingual heritage data - ONLY 2 REMAINING
const heritageData = {
    'thap-cham-phu-dien': {
        id: 'thap-cham-phu-dien',
        audio: {
            vi: '/audio/heritage/thap-cham-phu-dien_vi.mp3',
            en: '/audio/heritage/thap-cham-phu-dien_en.mp3'
        },
        title: { vi: 'Tháp Chăm Phú Diên', en: 'Phu Dien Cham Tower' },
        category: { vi: 'Di tích Quốc gia', en: 'National Heritage' },
        badge: { vi: '🏆 Kỷ lục Thế giới', en: '🏆 World Record' },
        description: {
            vi: 'Tháp Champa cổ nhất còn tồn tại dọc miền Trung Việt Nam, có niên đại thế kỷ VIII. Được phát hiện năm 2001 trong lòng cồn cát.',
            en: 'The oldest surviving Champa tower along Central Vietnam, dating back to the 8th century. Discovered in 2001 buried in sand dunes.'
        },
        fullDescription: {
            vi: `Tháp Phú Diên hay còn gọi là tháp Mỹ Khánh là một cụm tháp Champa cổ nằm ở thôn Mỹ Khánh, xã Phú Vinh, thành phố Huế. Đây được coi là công trình cổ nhất trong số tháp Champa còn tồn tại.

Tháp được phát hiện năm 2001 trong lòng cồn cát ven biển, vùi sâu dưới lòng cát từ 5-7m, thấp hơn mực nước biển và chỉ cách mép nước biển 120m. Đây là ngôi tháp nằm gần bờ biển nhất hiện còn tồn tại.

Tháp có hình đồ kiến trúc hình chữ nhật dài 8,22m, rộng 7,12m. Nghiên cứu cho thấy tháp Mỹ Khánh thuộc dạng tháp Lùn trong nghệ thuật kiến trúc tháp Champa - nhóm tháp khởi đầu của kiến trúc tôn giáo Chàm.

Cuối tháng 6/2022, Tháp Champa Phú Diên được xác lập hai kỷ lục: Tháp Champa cổ chìm sâu dưới cồn cát ven biển được khai quật, bảo tồn đầu tiên tại Việt Nam và thế giới.`,
            en: `Phu Dien Tower, also known as My Khanh Tower, is an ancient Champa tower complex located in My Khanh village, Phu Vinh commune, Hue city. It is considered the oldest structure among surviving Champa towers.

The tower was discovered in 2001 buried in coastal sand dunes, 5-7m below sand level, lower than sea level and only 120m from the water's edge. This is the tower closest to the beach that still exists today.

The tower has a rectangular architecture measuring 8.22m long and 7.12m wide. Research shows My Khanh Tower belongs to the "Squat Tower" type in Champa tower architecture - the initial group of Cham religious architecture.

In late June 2022, Phu Dien Champa Tower was recognized with two records: The first ancient Champa tower buried deep under coastal sand dunes to be excavated and preserved in Vietnam and the world.`
        },
        images: [
            '/images/heritage/thap-cham-1.jpg',
            '/images/heritage/thap-cham-2.jpg',
            '/images/heritage/thap-cham-3.jpg',
            '/images/heritage/thap-cham-4.jpg',
        ],
        video: 'https://drive.google.com/file/d/10ND6A1rlfpaPCORyCr_txFeZcbvpApLa/preview',
        location: { vi: 'Thôn Mỹ Khánh, Xã Phú Vinh', en: 'My Khanh Village, Phu Vinh Commune' },
        coordinates: { lat: 16.4957912, lng: 107.7460799 },
        facts: [
            { vi: 'Niên đại: Thế kỷ VIII', en: 'Dating: 8th Century' },
            { vi: 'Kích thước: 8,22m x 7,12m', en: 'Size: 8.22m x 7.12m' },
            { vi: 'Phát hiện: Năm 2001', en: 'Discovered: 2001' },
            { vi: 'Độ sâu: 5-7m dưới cát', en: 'Depth: 5-7m under sand' },
        ]
    },
    'dinh-ha-thanh': {
        id: 'dinh-ha-thanh',
        audio: {
            vi: '/audio/heritage/dinh-ha-thanh_vi.mp3',
            en: '/audio/heritage/dinh-ha-thanh_en.mp3'
        },
        title: { vi: 'Đình Hà Thanh', en: 'Ha Thanh Communal House' },
        category: { vi: 'Di tích cấp Tỉnh', en: 'Provincial Heritage' },
        badge: { vi: '🏛️ Thế kỷ XVI', en: '🏛️ 16th Century' },
        description: {
            vi: 'Một trong những ngôi đình được xây dựng dưới thời các chúa Nguyễn, đánh dấu quá trình mở mang bờ cõi thuộc xứ Đàng Trong vào những năm cuối thế kỷ XVI.',
            en: 'One of the communal houses built during the Nguyen Lords period, marking the territorial expansion of Dang Trong region in the late 16th century.'
        },
        fullDescription: {
            vi: `Đình Hà Thanh tọa lạc tại xã Phú Vinh, thành phố Huế (nay thuộc thôn 3). Quá trình xây dựng Đình gắn với quá trình thành lập làng, đánh dấu bước tiến mới trong tiến trình mở mang bờ cõi thuộc xứ Đàng Trong.

Ban đầu Đình làng được xây dựng bằng tranh tre, nứa lá, sau dần có điều kiện kinh tế dân làng đóng góp xây dựng bằng gỗ, tường gạch, mái lợp ngói liệt.

Theo tài liệu của làng, Đình được xây dựng khang trang vào năm Gia Long thứ 2 (1803), tiểu tu năm 1845, đại tu năm 1902, xây dựng lại năm 1940, đại tu năm 1944.

Đình Hà Thanh có kết cấu và bố cục kiến trúc mang đặc trưng của ngôi đình xứ Huế. Đây là ngôi đình gắn liền với quá trình hình thành và phát triển của làng Hà Thanh, biểu trưng cho sự đoàn kết, gắn bó của cộng đồng.

Với những giá trị lịch sử, Đình Hà Thanh được UBND tỉnh xếp hạng di tích lịch sử cấp tỉnh theo Quyết định số 709/QĐ-UBND ngày 21/3/2024.`,
            en: `Ha Thanh Communal House is located in Phu Vinh commune, Hue city (now in hamlet 3). Its construction is linked to the village's establishment, marking a new step in the territorial expansion of Dang Trong.

Initially, the communal house was built with bamboo and thatch. Later, as economic conditions improved, villagers contributed to rebuild it with wood, brick walls, and tiled roofs.

According to village records, the house was grandly built in Gia Long year 2 (1803), minor repairs in 1845, major renovation in 1902, rebuilt in 1940, and major renovation in 1944.

Ha Thanh Communal House has the characteristic architecture of Hue communal houses. It symbolizes the unity and cohesion of the community throughout the village's formation and development.

With its historical values, Ha Thanh Communal House was classified as a provincial-level historical site by Decision No. 709/QD-UBND dated March 21, 2024.`
        },
        images: [
            '/images/heritage/dinh-ha-thanh-1.jpg',
            '/images/heritage/dinh-ha-thanh-2.jpg',
            '/images/heritage/dinh-ha-thanh-3.jpg',
            '/images/heritage/dinh-ha-thanh-4.jpg',
            '/images/heritage/dinh-ha-thanh-5.jpg',
        ],
        video: 'https://drive.google.com/file/d/1UjqMzbM_g3wGlptzIS_xfyM7XZBMYoCq/preview',
        location: { vi: 'Thôn 3, Xã Phú Vinh', en: 'Hamlet 3, Phu Vinh Commune' },
        coordinates: { lat: 16.4335918, lng: 107.7796597 },
        facts: [
            { vi: 'Xây dựng: Thế kỷ XVI', en: 'Built: 16th Century' },
            { vi: 'Trùng tu: 1803, 1902, 1940', en: 'Renovated: 1803, 1902, 1940' },
            { vi: 'Xếp hạng: Di tích cấp tỉnh', en: 'Rank: Provincial Heritage' },
            { vi: 'Công nhận: 21/3/2024', en: 'Recognized: March 21, 2024' },
        ]
    }
};

const pageContent = {
    header: {
        badge: { vi: 'Di sản văn hóa', en: 'Cultural Heritage' },
        title1: { vi: 'Di sản ', en: 'Heritage of ' },
        title2: { vi: 'Phú Vinh', en: 'Phu Vinh' },
        subtitle: { vi: 'Khám phá các di tích lịch sử và văn hóa độc đáo của xã Phú Vinh', en: 'Discover unique historical and cultural sites of Phu Vinh commune' }
    },
    sections: {
        about: { vi: 'Giới thiệu', en: 'Introduction' },
        facts: { vi: 'Thông tin nổi bật', en: 'Key Facts' },
        gallery: { vi: 'Thư viện Ảnh', en: 'Photo Gallery' },
        location: { vi: 'Vị trí', en: 'Location' },
    },
    buttons: {
        directions: { vi: 'Chỉ đường', en: 'Directions' },
        askAI: { vi: 'Hỏi AI', en: 'Ask AI' },
    }
};

export default function HeritagePage() {
    const [mounted, setMounted] = useState(false);
    const [activeTab, setActiveTab] = useState<'thap-cham-phu-dien' | 'dinh-ha-thanh'>('thap-cham-phu-dien');
    const [isPlaying, setIsPlaying] = useState(false);
    const [audioProgress, setAudioProgress] = useState(0);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const { language } = useLanguage();
    const lang = language as 'vi' | 'en';

    useEffect(() => {
        setMounted(true);
    }, []);

    // Reset audio when tab changes
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
        setIsPlaying(false);
        setAudioProgress(0);
    }, [activeTab]);

    const toggleAudio = useCallback(() => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    }, [isPlaying]);

    const handleTimeUpdate = useCallback(() => {
        if (audioRef.current) {
            const progress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
            setAudioProgress(progress || 0);
        }
    }, []);

    const handleAudioEnded = useCallback(() => {
        setIsPlaying(false);
        setAudioProgress(0);
        if (audioRef.current) {
            audioRef.current.currentTime = 0;
        }
    }, []);

    const openDirections = useCallback((coords: { lat: number; lng: number }) => {
        window.open(`https://www.google.com/maps/dir/?api=1&destination=${coords.lat},${coords.lng}`, '_blank');
    }, []);

    const askAI = useCallback((title: string) => {
        const question = language === 'vi'
            ? `Hãy cho tôi biết thêm về ${title} ở Phú Vinh`
            : `Tell me more about ${title} in Phu Vinh`;
        const event = new CustomEvent('open-chat-with-message', { detail: question });
        window.dispatchEvent(event);
    }, [language]);

    if (!mounted) {
        return (
            <div className="min-h-screen pt-14 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-[#2d5a57] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const currentHeritage = heritageData[activeTab];

    return (
        <div className="min-h-screen pb-20 bg-background text-foreground">
            {/* Minimal Header & Tabs Area */}
            <section className="pt-20 pb-12 px-4 bg-gradient-to-b from-[#2d5a57]/10 to-transparent dark:from-[#2d5a57]/20">
                <div className="max-w-6xl mx-auto text-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <Badge className="mb-4 bg-[#2d5a57]/20 text-[#2d5a57] dark:text-emerald-400">
                            <Landmark className="w-3 h-3 mr-1" />
                            {pageContent.header.badge[lang]}
                        </Badge>
                        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-[#2d5a57] dark:text-emerald-400">
                            {pageContent.header.title1[lang]}
                            <span className="text-[#5a8a87] dark:text-emerald-300">{pageContent.header.title2[lang]}</span>
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto mb-8">
                            {pageContent.header.subtitle[lang]}
                        </p>

                        {/* Tab Switcher */}
                        <div className="inline-flex bg-white dark:bg-gray-800 rounded-full p-1 shadow-sm border border-gray-200 dark:border-gray-700 max-w-full overflow-x-auto">
                            {(['thap-cham-phu-dien', 'dinh-ha-thanh'] as const).map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={cn(
                                        "px-5 py-2.5 rounded-full text-sm font-medium transition-all whitespace-nowrap",
                                        activeTab === tab
                                            ? "bg-[#2d5a57] text-white shadow-md"
                                            : "text-gray-500 dark:text-gray-400 hover:text-[#2d5a57] dark:hover:text-emerald-400"
                                    )}
                                >
                                    {heritageData[tab].title[lang]}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                >
                    {/* Hero Section of selected Heritage */}
                    <div className="relative h-[50vh] md:h-[60vh] flex items-center justify-center overflow-hidden mb-8">
                        <div
                            className="absolute inset-0 bg-cover bg-center z-0"
                            style={{ backgroundImage: `url('${currentHeritage.images[0]}')` }}
                        >
                            <div className="absolute inset-0 bg-black/50 bg-gradient-to-t from-background via-black/30 to-transparent" />
                        </div>
                        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-10">
                            <Badge className="mb-4 bg-amber-500/80 hover:bg-amber-500 backdrop-blur-sm px-4 py-1.5 border-none text-white">
                                {currentHeritage.category[lang]}
                            </Badge>
                            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 drop-shadow-lg">
                                {currentHeritage.title[lang]}
                            </h1>
                            <p className="text-sm md:text-xl text-white/90 font-medium max-w-2xl mx-auto drop-shadow-md">
                                {currentHeritage.description[lang]}
                            </p>
                        </div>
                    </div>

                    {/* Big Video Section (like in Lễ đua ghe nan) */}
                    {currentHeritage.video && (
                        <div className="max-w-6xl mx-auto px-4 -mt-24 relative z-20 mb-16">
                            <div className="rounded-2xl overflow-hidden shadow-2xl border border-border/50 bg-black aspect-video relative group">
                                {currentHeritage.video.includes('drive.google.com') ? (
                                    <iframe
                                        src={currentHeritage.video}
                                        allowFullScreen
                                        className="w-full h-full object-cover rounded-2xl"
                                    />
                                ) : (
                                    <video
                                        src={currentHeritage.video}
                                        controls
                                        className="w-full h-full object-cover rounded-2xl"
                                        poster={currentHeritage.images[0]}
                                    />
                                )}
                            </div>
                        </div>
                    )}

                    {/* Content Section */}
                    <div className="max-w-6xl mx-auto px-4 relative z-20">
                        <div className="bg-card shadow-xl rounded-2xl p-6 md:p-10 mb-12 border border-border/50">
                            <div className="grid md:grid-cols-2 gap-10">
                                {/* Left Column: Description & Audio */}
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3 mb-6">
                                        <Info className="w-8 h-8 text-[#2d5a57] dark:text-emerald-400" />
                                        <h2 className="text-2xl md:text-3xl font-bold">{pageContent.sections.about[lang]}</h2>
                                    </div>
                                    <p className="text-lg leading-relaxed text-muted-foreground whitespace-pre-line">
                                        {currentHeritage.fullDescription[lang]}
                                    </p>

                                    {/* Audio Player */}
                                    {currentHeritage.audio && (
                                        <div className="mt-8 bg-gradient-to-r from-amber-500/10 to-orange-500/10 dark:from-amber-500/20 dark:to-orange-500/20 rounded-xl p-5 border border-amber-500/20">
                                            <audio
                                                ref={audioRef}
                                                src={currentHeritage.audio[lang]}
                                                onTimeUpdate={handleTimeUpdate}
                                                onEnded={handleAudioEnded}
                                            />
                                            <div className="flex items-center gap-4">
                                                <button
                                                    onClick={toggleAudio}
                                                    className="w-14 h-14 shrink-0 rounded-full bg-amber-500 hover:bg-amber-600 flex items-center justify-center text-white shadow-lg shadow-amber-500/30 transition-all hover:scale-105"
                                                >
                                                    {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
                                                </button>
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="font-medium text-amber-600 dark:text-amber-400 flex items-center gap-2">
                                                            <Volume2 className="w-5 h-5" />
                                                            {lang === 'vi' ? 'Nghe Thuyết minh' : 'Listen to Audio Guide'}
                                                        </span>
                                                        <span className="text-xs text-amber-600/70 dark:text-amber-400/70">
                                                            {isPlaying ? (lang === 'vi' ? 'Đang phát...' : 'Playing...') : ''}
                                                        </span>
                                                    </div>
                                                    <div className="w-full h-2.5 bg-background shadow-inner rounded-full overflow-hidden">
                                                        <motion.div
                                                            className="h-full bg-gradient-to-r from-amber-400 to-orange-500"
                                                            style={{ width: `${audioProgress}%` }}
                                                            transition={{ duration: 0.1 }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Facts List */}
                                    <div className="mt-8">
                                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                            <Star className="w-6 h-6 text-[#2d5a57] dark:text-emerald-400" />
                                            {pageContent.sections.facts[lang]}
                                        </h3>
                                        <div className="grid grid-cols-2 gap-3">
                                            {currentHeritage.facts.map((fact, idx) => (
                                                <div key={idx} className="p-4 rounded-xl bg-muted/50 border border-border flex items-center">
                                                    <Badge variant="outline" className="mr-3 shrink-0 bg-background text-xs px-2 py-0.5 border-[#2d5a57]/30 text-[#2d5a57] dark:text-emerald-400">
                                                        {idx + 1}
                                                    </Badge>
                                                    <span className="text-sm font-medium">{fact[lang]}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column: Gallery & Actions */}
                                <div className="space-y-8">
                                    <div>
                                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                            <ImageIcon className="w-6 h-6 text-[#2d5a57] dark:text-emerald-400" />
                                            {pageContent.sections.gallery[lang]}
                                        </h3>
                                        <div className="grid grid-cols-2 gap-3">
                                            {currentHeritage.images.slice(1, 5).map((img, idx) => (
                                                <div key={idx} className={`rounded-xl overflow-hidden relative group aspect-square ${idx === 0 ? 'col-span-2 aspect-video' : ''}`}>
                                                    <ImagePreview
                                                        src={img}
                                                        alt={`${currentHeritage.title[lang]} - image ${idx + 1}`}
                                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Location and Info */}
                                    <div className="bg-[#2d5a57]/5 dark:bg-[#2d5a57]/10 border border-[#2d5a57]/20 rounded-xl p-6">
                                        <div className="flex items-start gap-4 mb-6">
                                            <div className="w-12 h-12 rounded-full bg-[#2d5a57]/10 flex items-center justify-center shrink-0">
                                                <MapPin className="w-6 h-6 text-[#2d5a57] dark:text-emerald-400" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-lg">{pageContent.sections.location[lang]}</p>
                                                <p className="text-muted-foreground">{currentHeritage.location[lang]}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="grid grid-cols-2 gap-3">
                                            <Button
                                                onClick={() => openDirections(currentHeritage.coordinates)}
                                                className="w-full bg-[#2d5a57] hover:bg-[#1e3f3d] text-white"
                                            >
                                                <Navigation className="w-4 h-4 mr-2" />
                                                {pageContent.buttons.directions[lang]}
                                            </Button>
                                            <Button
                                                onClick={() => askAI(currentHeritage.title[lang])}
                                                variant="outline"
                                                className="w-full border-[#2d5a57]/30 text-[#2d5a57] dark:text-emerald-400 hover:bg-[#2d5a57]/5"
                                            >
                                                <MessageCircle className="w-4 h-4 mr-2" />
                                                {pageContent.buttons.askAI[lang]}
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Google Map */}
                                    <div className="rounded-xl overflow-hidden border border-[#2d5a57]/20 shadow-lg min-h-[250px] mt-6">
                                        <iframe
                                            src={`https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d2000!2d${currentHeritage.coordinates.lng}!3d${currentHeritage.coordinates.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1s${lang}!2svn!4v1`}
                                            width="100%"
                                            height="100%"
                                            style={{ border: 0, minHeight: '250px' }}
                                            allowFullScreen
                                            loading="lazy"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}

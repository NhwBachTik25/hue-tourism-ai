'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    Clock, Users, Sun, Sunset, Calendar, Sparkles, Navigation,
    Loader2, CheckCircle, MapPin
} from 'lucide-react';
import { useLanguage } from '@/components/providers/language-provider';
import { cn } from '@/lib/utils';

// ========== TRIP PLANNER CONTENT ==========
const plannerContent = {
    hero: {
        badge: { vi: 'Xây dựng lộ trình', en: 'Trip Planning' },
        title1: { vi: 'Lên kế hoạch ', en: 'Plan Your Trip to ' },
        title2: { vi: 'Phú Vinh', en: 'Phu Vinh' },
        subtitle: { vi: 'Chọn lộ trình có sẵn hoặc để AI tạo lộ trình riêng cho bạn', en: 'Choose a preset or let AI create a custom one' }
    },
    sections: {
        suggested: { vi: 'Lộ trình gợi ý', en: 'Suggested Itineraries' },
        estimatedCost: { vi: 'Chi phí ước tính:', en: 'Estimated cost:' },
        detail: { vi: 'Chi tiết', en: 'Details' },
        aiTitle: { vi: 'AI Tạo lộ trình riêng', en: 'AI Custom Itinerary' },
        aiSubtitle: { vi: 'Mô tả yêu cầu, AI sẽ tạo lộ trình phù hợp', en: 'Describe requirements, AI will create a suitable itinerary' },
        aiPlaceholder: { vi: 'Ví dụ: Tôi muốn đi 1 ngày với vợ, thích biển và hải sản...', en: 'Example: I want a 1-day trip with my wife, love beaches and seafood...' },
        generating: { vi: 'Đang tạo lộ trình...', en: 'Generating itinerary...' },
        generateBtn: { vi: 'Tạo lộ trình bằng AI', en: 'Generate with AI' },
        yourItinerary: { vi: '📋 Lộ trình của bạn', en: '📋 Your Itinerary' },
        tips: { vi: '💡 Mẹo du lịch Phú Vinh', en: '💡 Phu Vinh Travel Tips' }
    },
    tips: {
        transport: { vi: 'Di chuyển bằng xe máy thuê tiện lợi nhất (~100-150k/ngày)', en: 'Renting a motorbike is most convenient (~100-150k VND/day)' },
        cash: { vi: 'Mang theo tiền mặt - nhiều nơi không có ATM', en: 'Bring cash - many places have no ATM' },
        sun: { vi: 'Đem kem chống nắng, mũ nón - biển nắng gắt', en: 'Bring sunscreen & hat - beach is very sunny' },
        season: { vi: 'Thời gian tốt nhất: tháng 3-8, tránh mùa mưa bão', en: 'Best time: March-August, avoid rainy season' }
    }
};

const itineraryContent = {
    'half-day-morning': {
        title: { vi: 'Nửa ngày buổi sáng', en: 'Half Day Morning' },
        description: { vi: 'Ngắm bình minh, khám phá làng chài và làng nghề', en: 'Watch sunrise, explore fishing village and craft villages' },
        duration: { vi: '5h - 11h (6 tiếng)', en: '5AM - 11AM (6 hours)' },
        stops: { vi: ['Biển Vinh Thanh', 'Làng An Bằng', 'Làng nghề nước ớt'], en: ['Vinh Thanh Beach', 'An Bang Village', 'Chili Sauce Village'] },
        detailTitle: { vi: 'Lộ trình nửa ngày buổi sáng', en: 'Half Day Morning Itinerary' },
        totalCost: { vi: '300-550k/người', en: '300-550k VND/person' },
        schedule: [
            { time: '5:00 - 5:30', activity: { vi: 'Di chuyển từ Huế đến Biển Vinh Thanh', en: 'Travel from Hue to Vinh Thanh Beach' }, icon: '🚗', tip: { vi: 'Thuê xe máy hoặc Grab', en: 'Rent motorbike or use Grab' } },
            { time: '5:30 - 7:00', activity: { vi: 'Ngắm bình minh + Xem thuyền cá về bến', en: 'Watch sunrise + See fishing boats return' }, icon: '🌅', tip: { vi: 'Mang theo máy ảnh', en: 'Bring a camera' } },
            { time: '7:00 - 8:00', activity: { vi: 'Ăn sáng tại quán ven biển', en: 'Breakfast at beachside restaurant' }, icon: '🍜', tip: { vi: 'Bánh canh cá, bún hải sản', en: 'Try fish noodle soup' } },
            { time: '8:00 - 9:30', activity: { vi: 'Tham quan Làng An Bằng', en: 'Visit An Bang Village' }, icon: '🏛️', tip: { vi: 'Thuê người dẫn ~50k', en: 'Hire guide ~50k VND' } },
            { time: '9:30 - 10:30', activity: { vi: 'Làng nghề nước ớt Vinh Xuân', en: 'Vinh Xuan Chili Sauce Village' }, icon: '🌶️', tip: { vi: 'Mua sản phẩm làm quà', en: 'Buy as souvenirs' } },
            { time: '10:30 - 11:00', activity: { vi: 'Về Huế', en: 'Return to Hue' }, icon: '🏠', tip: { vi: '', en: '' } },
        ]
    },
    'half-day-afternoon': {
        title: { vi: 'Nửa ngày buổi chiều', en: 'Half Day Afternoon' },
        description: { vi: 'Tắm biển, ngắm hoàng hôn và thưởng thức hải sản', en: 'Swim, watch sunset and enjoy seafood' },
        duration: { vi: '14h - 20h (6 tiếng)', en: '2PM - 8PM (6 hours)' },
        stops: { vi: ['Biển Phú Diên', 'Làng nghề mắm', 'Biển Vinh Thanh'], en: ['Phu Dien Beach', 'Fish Sauce Village', 'Vinh Thanh Beach'] },
        detailTitle: { vi: 'Lộ trình nửa ngày buổi chiều', en: 'Half Day Afternoon Itinerary' },
        totalCost: { vi: '350-600k/người', en: '350-600k VND/person' },
        schedule: [
            { time: '14:00 - 14:30', activity: { vi: 'Di chuyển từ Huế đến Biển Phú Diên', en: 'Travel from Hue to Phu Dien Beach' }, icon: '🚗', tip: { vi: '', en: '' } },
            { time: '14:30 - 15:30', activity: { vi: 'Tham quan làng chài + Làng nghề mắm', en: 'Visit fishing village + Fish sauce craft' }, icon: '🐟', tip: { vi: 'Xem quy trình làm mắm', en: 'See sauce making process' } },
            { time: '15:30 - 16:30', activity: { vi: 'Tham quan Làng An Bằng', en: 'Visit An Bang Village' }, icon: '🏛️', tip: { vi: '', en: '' } },
            { time: '16:30 - 17:30', activity: { vi: 'Biển Vinh Thanh - Tắm biển', en: 'Vinh Thanh Beach - Swimming' }, icon: '🏖️', tip: { vi: 'Mang theo đồ bơi', en: 'Bring swimwear' } },
            { time: '17:30 - 18:30', activity: { vi: 'Ngắm hoàng hôn', en: 'Watch sunset' }, icon: '🌅', tip: { vi: 'Vị trí đẹp: bến thuyền', en: 'Best spot: boat pier' } },
            { time: '18:30 - 19:30', activity: { vi: 'Ăn tối hải sản', en: 'Seafood dinner' }, icon: '🍽️', tip: { vi: 'Cá nướng, mực, tôm', en: 'Grilled fish, squid, shrimp' } },
            { time: '19:30 - 20:00', activity: { vi: 'Về Huế', en: 'Return to Hue' }, icon: '🏠', tip: { vi: '', en: '' } },
        ]
    },
    'full-day': {
        title: { vi: '1 ngày đầy đủ', en: 'Full Day Experience' },
        description: { vi: 'Trải nghiệm trọn vẹn Phú Vinh từ bình minh đến hoàng hôn', en: 'Complete experience from sunrise to sunset' },
        duration: { vi: '5h - 20h (15 tiếng)', en: '5AM - 8PM (15 hours)' },
        stops: { vi: ['Bình minh', 'Làng An Bằng', 'Làng nghề', 'Tắm biển', 'Hải sản', 'Hoàng hôn'], en: ['Sunrise', 'An Bang', 'Crafts', 'Beach', 'Seafood', 'Sunset'] },
        detailTitle: { vi: 'Lộ trình 1 ngày đầy đủ', en: 'Full Day Itinerary' },
        totalCost: { vi: '500k-1 triệu/người', en: '500k-1M VND/person' },
        schedule: [
            { time: '5:00 - 5:30', activity: { vi: 'Di chuyển từ Huế', en: 'Travel from Hue' }, icon: '🚗', tip: { vi: '', en: '' } },
            { time: '5:30 - 7:30', activity: { vi: 'Biển Vinh Thanh - Bình minh', en: 'Vinh Thanh Beach - Sunrise' }, icon: '🌅', tip: { vi: 'Không nên bỏ lỡ!', en: "Don't miss!" } },
            { time: '7:30 - 8:30', activity: { vi: 'Ăn sáng tại làng chài', en: 'Breakfast at fishing village' }, icon: '🍜', tip: { vi: 'Bánh canh, bún', en: 'Noodle soup' } },
            { time: '8:30 - 10:00', activity: { vi: 'Làng An Bằng', en: 'An Bang Village' }, icon: '🏛️', tip: { vi: 'Điểm nhấn chuyến đi', en: 'Trip highlight' } },
            { time: '10:00 - 11:30', activity: { vi: 'Làng nghề nước ớt', en: 'Chili Sauce Village' }, icon: '🌶️', tip: { vi: 'Mua sản phẩm', en: 'Buy products' } },
            { time: '11:30 - 14:00', activity: { vi: 'Tắm biển + Ăn trưa', en: 'Beach + Lunch' }, icon: '🏖️', tip: { vi: 'Nghỉ trưa tại quán', en: 'Rest at restaurant' } },
            { time: '14:00 - 15:30', activity: { vi: 'Biển Phú Diên + Làng nghề mắm', en: 'Phu Dien + Fish sauce craft' }, icon: '🐟', tip: { vi: '', en: '' } },
            { time: '15:30 - 17:00', activity: { vi: 'Nghỉ ngơi, tắm biển', en: 'Rest and swim' }, icon: '🌊', tip: { vi: '', en: '' } },
            { time: '17:00 - 18:00', activity: { vi: 'Ngắm hoàng hôn', en: 'Watch sunset' }, icon: '🌅', tip: { vi: '', en: '' } },
            { time: '18:00 - 19:30', activity: { vi: 'Ăn tối hải sản', en: 'Seafood dinner' }, icon: '🍽️', tip: { vi: 'Gọi nhiều món!', en: 'Order many dishes!' } },
            { time: '19:30 - 20:00', activity: { vi: 'Về Huế', en: 'Return to Hue' }, icon: '🏠', tip: { vi: '', en: '' } },
        ]
    },
    'family': {
        title: { vi: 'Dành cho gia đình', en: 'Family Friendly' },
        description: { vi: 'Lịch trình phù hợp với trẻ em, nhẹ nhàng và vui vẻ', en: 'Kid-friendly, relaxed and fun' },
        duration: { vi: '8h - 17h (9 tiếng)', en: '8AM - 5PM (9 hours)' },
        stops: { vi: ['Biển Phú Diên', 'Làng An Bằng', 'Tắm biển Vinh Thanh'], en: ['Phu Dien Beach', 'An Bang Village', 'Vinh Thanh Beach'] },
        detailTitle: { vi: 'Lộ trình cho gia đình', en: 'Family Itinerary' },
        totalCost: { vi: '400-700k/người lớn', en: '400-700k VND/adult' },
        schedule: [
            { time: '8:00 - 8:30', activity: { vi: 'Xuất phát từ Huế', en: 'Depart from Hue' }, icon: '🚗', tip: { vi: 'Không cần dậy sớm', en: 'No early wake-up' } },
            { time: '9:00 - 10:30', activity: { vi: 'Biển Phú Diên - Xem thuyền, chơi cát', en: 'Phu Dien - Boats, play in sand' }, icon: '🏖️', tip: { vi: 'Trẻ em thích xem thuyền', en: 'Kids love boats' } },
            { time: '10:30 - 11:30', activity: { vi: 'Làng An Bằng', en: 'An Bang Village' }, icon: '🏛️', tip: { vi: 'Giải thích cho trẻ', en: 'Explain to children' } },
            { time: '11:30 - 13:30', activity: { vi: 'Ăn trưa + Nghỉ ngơi', en: 'Lunch + Rest' }, icon: '🍽️', tip: { vi: 'Chọn quán có bóng mát', en: 'Choose shaded restaurant' } },
            { time: '13:30 - 16:00', activity: { vi: 'Biển Vinh Thanh - Tắm biển', en: 'Vinh Thanh - Swimming' }, icon: '🌊', tip: { vi: 'Mang phao cho trẻ', en: 'Bring floats for kids' } },
            { time: '16:00 - 17:00', activity: { vi: 'Ăn nhẹ + Về Huế', en: 'Snack + Return' }, icon: '🏠', tip: { vi: '', en: '' } },
        ]
    },
};

export default function PlannerPage() {
    const [mounted, setMounted] = useState(false);
    
    // Planner state
    const [selectedItinerary, setSelectedItinerary] = useState<string | null>(null);
    const [aiPrompt, setAiPrompt] = useState('');
    const [aiResult, setAiResult] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { language } = useLanguage();
    const lang = language as 'vi' | 'en';

    useEffect(() => { setMounted(true); }, []);

    // AI planner
    const generateCustomItinerary = async () => {
        if (!aiPrompt.trim()) return;
        setIsLoading(true);
        try {
            const promptText = lang === 'vi'
                ? `Hãy tạo lộ trình tham quan xã Phú Vinh với yêu cầu: ${aiPrompt}. Bao gồm: thời gian cụ thể, địa điểm, gợi ý ăn uống, chi phí ước tính, mẹo hữu ích.`
                : `Create a Phu Vinh travel itinerary: ${aiPrompt}. Include: times, locations, food, costs, tips.`;
            const response = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: promptText }) });
            const data = await response.json();
            setAiResult(data.response || data.message);
        } catch {
            setAiResult(lang === 'vi' ? 'Có lỗi xảy ra. Vui lòng thử lại.' : 'An error occurred. Please try again.');
        }
        setIsLoading(false);
    };

    const detail = selectedItinerary ? itineraryContent[selectedItinerary as keyof typeof itineraryContent] : null;
    const presetItineraries = [
        { id: 'half-day-morning', icon: <Sun className="w-5 h-5" />, color: 'from-orange-500/20 to-yellow-500/20' },
        { id: 'half-day-afternoon', icon: <Sunset className="w-5 h-5" />, color: 'from-purple-500/20 to-pink-500/20' },
        { id: 'full-day', icon: <Calendar className="w-5 h-5" />, color: 'from-blue-500/20 to-cyan-500/20' },
        { id: 'family', icon: <Users className="w-5 h-5" />, color: 'from-green-500/20 to-emerald-500/20' },
    ];

    if (!mounted) return <div className="min-h-screen pt-16 flex items-center justify-center"><div className="w-8 h-8 border-2 border-[#2d5a57] border-t-transparent rounded-full animate-spin" /></div>;

    return (
        <div className="min-h-screen">
            {/* Hero */}
            <section className="relative py-12 px-4 bg-gradient-to-b from-[#2d5a57]/10 to-transparent dark:from-[#2d5a57]/20">
                <div className="max-w-6xl mx-auto text-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <Badge className="mb-4 bg-[#2d5a57]/20 text-[#2d5a57] dark:text-emerald-400">
                            <Clock className="w-3 h-3 mr-1" />
                            {plannerContent.hero.badge[lang]}
                        </Badge>
                        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-[#2d5a57] dark:text-emerald-400">
                            {plannerContent.hero.title1[lang]}<span className="text-[#5a8a87] dark:text-emerald-300">{plannerContent.hero.title2[lang]}</span>
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto mb-8">
                             {plannerContent.hero.subtitle[lang]}
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* ===== TAB: AI PLANNER ===== */}
            <section className="py-8 px-4">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-[#2d5a57] dark:text-emerald-400">
                        <Clock className="w-5 h-5" />
                        {plannerContent.sections.suggested[lang]}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                        {presetItineraries.map((itinerary, index) => {
                            const c = itineraryContent[itinerary.id as keyof typeof itineraryContent];
                            return (
                                <motion.div key={itinerary.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                                    <Card className={cn("cursor-pointer transition-all bg-white dark:bg-gray-800",
                                        selectedItinerary === itinerary.id ? 'border-[#2d5a57] ring-2 ring-[#2d5a57]/20' : 'border-gray-200 dark:border-gray-700 hover:border-[#2d5a57]/50'
                                    )} onClick={() => setSelectedItinerary(selectedItinerary === itinerary.id ? null : itinerary.id)}>
                                        <CardContent className={`p-6 bg-gradient-to-br ${itinerary.color}`}>
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="w-10 h-10 rounded-xl bg-white/50 dark:bg-gray-900/50 flex items-center justify-center">{itinerary.icon}</div>
                                                {selectedItinerary === itinerary.id && <CheckCircle className="w-5 h-5 text-[#2d5a57] dark:text-emerald-400" />}
                                            </div>
                                            <h3 className="font-bold text-lg mb-1 text-gray-900 dark:text-white">{c.title[lang]}</h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{c.description[lang]}</p>
                                            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mb-3"><Clock className="w-3 h-3" />{c.duration[lang]}</div>
                                            <div className="flex flex-wrap gap-1">{c.stops[lang].map((stop, i) => <Badge key={i} variant="secondary" className="text-xs">{stop}</Badge>)}</div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Detail */}
                    <AnimatePresence>
                        {detail && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mb-8">
                                <Card className="border-[#2d5a57]/30 bg-[#2d5a57]/5 dark:bg-[#2d5a57]/10">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between mb-6">
                                            <div>
                                                <h3 className="font-bold text-xl text-[#2d5a57] dark:text-emerald-400">{detail.detailTitle[lang]}</h3>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">{plannerContent.sections.estimatedCost[lang]} <span className="text-[#2d5a57] dark:text-emerald-400 font-medium">{detail.totalCost[lang]}</span></p>
                                            </div>
                                            <Badge className="bg-[#2d5a57]">{plannerContent.sections.detail[lang]}</Badge>
                                        </div>
                                        <div className="space-y-4">
                                            {detail.schedule.map((item, index) => (
                                                <div key={index} className="flex items-start gap-4">
                                                    <div className="flex-shrink-0 w-20 text-sm font-medium text-[#2d5a57] dark:text-emerald-400">{item.time.split(' - ')[0]}</div>
                                                    <div className="flex-shrink-0 text-2xl">{item.icon}</div>
                                                    <div className="flex-1">
                                                        <p className="font-medium text-gray-900 dark:text-white">{item.activity[lang]}</p>
                                                        {item.tip[lang] && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">💡 {item.tip[lang]}</p>}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </section>

            {/* AI Custom */}
            <section className="py-8 px-4">
                <div className="max-w-3xl mx-auto">
                    <Card className="border-[#2d5a57]/30 bg-gradient-to-br from-[#2d5a57]/10 to-[#5a8a87]/10 dark:from-[#2d5a57]/20 dark:to-[#5a8a87]/20">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-xl bg-[#2d5a57]/20 flex items-center justify-center"><Sparkles className="w-5 h-5 text-[#2d5a57] dark:text-emerald-400" /></div>
                                <div>
                                    <h3 className="font-bold text-gray-900 dark:text-white">{plannerContent.sections.aiTitle[lang]}</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{plannerContent.sections.aiSubtitle[lang]}</p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <textarea
                                    className="w-full h-24 p-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-[#2d5a57]/50 text-gray-900 dark:text-white"
                                    placeholder={plannerContent.sections.aiPlaceholder[lang]}
                                    value={aiPrompt}
                                    onChange={(e) => setAiPrompt(e.target.value)}
                                />
                                <Button className="w-full bg-[#2d5a57] hover:bg-[#1e3f3d] text-white" onClick={generateCustomItinerary} disabled={isLoading || !aiPrompt.trim()}>
                                    {isLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />{plannerContent.sections.generating[lang]}</> : <><Sparkles className="w-4 h-4 mr-2" />{plannerContent.sections.generateBtn[lang]}</>}
                                </Button>
                                {aiResult && (
                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                                        <h4 className="font-semibold mb-2 text-[#2d5a57] dark:text-emerald-400">{plannerContent.sections.yourItinerary[lang]}</h4>
                                        <div className="text-sm whitespace-pre-wrap text-gray-700 dark:text-gray-300">{aiResult}</div>
                                    </motion.div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* Tips */}
            <section className="py-8 px-4">
                <div className="max-w-3xl mx-auto">
                    <Card className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-700/30">
                        <CardContent className="p-6">
                            <h3 className="font-bold mb-4 text-amber-700 dark:text-amber-400">{plannerContent.sections.tips[lang]}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700 dark:text-gray-300">
                                <div className="flex items-start gap-2"><MapPin className="w-4 h-4 text-amber-500 mt-0.5" /><p>{plannerContent.tips.transport[lang]}</p></div>
                                <div className="flex items-start gap-2"><Navigation className="w-4 h-4 text-amber-500 mt-0.5" /><p>{plannerContent.tips.cash[lang]}</p></div>
                                <div className="flex items-start gap-2"><Sun className="w-4 h-4 text-amber-500 mt-0.5" /><p>{plannerContent.tips.sun[lang]}</p></div>
                                <div className="flex items-start gap-2"><Clock className="w-4 h-4 text-amber-500 mt-0.5" /><p>{plannerContent.tips.season[lang]}</p></div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </section>
        </div>
    );
}

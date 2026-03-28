'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    Map,
    Clock,
    Users,
    Sun,
    Sunset,
    Calendar,
    Sparkles,
    Navigation,
    MapPin,
    Loader2,
    CheckCircle,
    ChevronRight,
    ExternalLink,
    Info
} from 'lucide-react';
import { useLanguage } from '@/components/providers/language-provider';

// ============================================
// COMPREHENSIVE DESTINATION DATA FOR AI
// ============================================
const allDestinations = [
    { 
        name: 'Đình Làng Hà Thanh', 
        type: 'Di tích', 
        lat: 16.4335, 
        lng: 107.7796, 
        link: 'https://www.google.com/maps/search/?api=1&query=Đình+Làng+Hà+Thanh,+Vinh+Thanh,+Thừa+Thiên+Huế',
        desc: 'Di tích lịch sử cấp tỉnh, được xây dựng từ thế kỷ XVI, mang kiến trúc đình làng cổ kính đặc trưng của miền Trung. Đặc điểm nổi bật: Di tích cấp tỉnh, Xây từ thế kỷ XVI, Thờ Thành hoàng làng.' 
    },
    { 
        name: 'Tháp Chăm Phú Diên', 
        type: 'Di tích', 
        lat: 16.4957, 
        lng: 107.7460, 
        link: 'https://www.google.com/maps/search/?api=1&query=Tháp+Chăm+Phú+Diên,+Thừa+Thiên+Huế',
        desc: 'Công trình Champa cổ nhất còn tồn tại dọc miền Trung Việt Nam. Đặc điểm nổi bật: Tháp Champa cổ nhất miền Trung, Niên đại thế kỷ VIII, Cách bờ biển 120m.' 
    },
    { 
        name: 'Biển Vinh Thanh', 
        type: 'Biển', 
        lat: 16.4505, 
        lng: 107.8035, 
        link: 'https://www.google.com/maps/search/?api=1&query=Bãi+biển+Vinh+Thanh,+Thừa+Thiên+Huế',
        desc: 'Bãi biển hoang sơ đẹp nhất vùng ven biển Phú Vinh. Đặc điểm nổi bật: Bình minh tuyệt đẹp, Bãi biển hoang sơ, Làng chài truyền thống.' 
    },
    { 
        name: 'Biển Phú Diên', 
        type: 'Biển', 
        lat: 16.4957, 
        lng: 107.7470, 
        link: 'https://www.google.com/maps/search/?api=1&query=Bãi+biển+Phú+Diên,+Thừa+Thiên+Huế',
        desc: 'Bãi biển yên bình của làng chài truyền thống, nổi tiếng với những chiếc thuyền đánh cá bằng gỗ nhiều màu sắc.' 
    },
    { 
        name: 'Khu lăng mộ làng An Bằng', 
        type: 'Văn hóa', 
        lat: 16.4207, 
        lng: 107.8243, 
        link: 'https://www.google.com/maps/search/?api=1&query=Nghĩa+trang+An+Bằng,+Vinh+An,+Thừa+Thiên+Huế',
        desc: 'Làng An Bằng nổi tiếng thế giới với kiến trúc lăng mộ độc đáo, vô cùng nguy nga và đồ sộ. Được mệnh danh là "Thành phố của những bóng ma".' 
    },
    { 
        name: 'Lễ hội Đua Ghe Nan Làng Phương Diên', 
        type: 'Lễ hội', 
        lat: 16.4925, 
        lng: 107.7495, 
        link: 'https://www.google.com/maps/search/?api=1&query=Thôn+Phương+Diên,+Phú+Diên,+Thừa+Thiên+Huế',
        desc: 'Lễ hội truyền thống tiêu biểu của cư dân vùng biển Phú Vinh. Thể hiện tinh thần thượng võ, cầu mong mưa thuận gió hòa.' 
    },
];

interface AIScheduleItem {
    time: string;
    activity: string;
    icon: string;
    tip: string;
    lat?: number;
    lng?: number;
    mapUrl?: string;
}

interface AIItinerary {
    title: string;
    totalCost: string;
    schedule: AIScheduleItem[];
}

const pageContent = {
    hero: {
        badge: { vi: 'Xây dựng lộ trình', en: 'Trip Planning' },
        title1: { vi: 'Lên kế hoạch ', en: 'Plan Your Trip to ' },
        title2: { vi: 'Phú Vinh', en: 'Phu Vinh' },
        subtitle: { vi: 'Chọn lộ trình có sẵn hoặc để AI tạo lộ trình riêng cho bạn', en: 'Choose a preset itinerary or let AI create a custom one for you' }
    },
    sections: {
        suggested: { vi: 'Lộ trình gợi ý', en: 'Suggested Itineraries' },
        estimatedCost: { vi: 'Chi phí ước tính:', en: 'Estimated cost:' },
        detail: { vi: 'Chi tiết', en: 'Details' },
        aiTitle: { vi: 'AI Tạo lộ trình riêng', en: 'AI Custom Itinerary' },
        aiSubtitle: { vi: 'Mô tả yêu cầu, AI sẽ tạo lộ trình chuyên sâu dựa trên các địa điểm tại xã Phú Vinh mới', en: 'Describe your requirements, AI will generate a detailed itinerary based on locations in the new Phu Vinh commune' },
        aiPlaceholder: { vi: 'Ví dụ: Tôi muốn đi 1 ngày khám phá Đình Hà Thanh và Tháp Chăm...', en: 'Example: I want a 1-day trip to explore Ha Thanh House and Cham Tower...' },
        generating: { vi: 'AI đang phân tích & lên kế hoạch...', en: 'AI is analyzing & planning...' },
        generateBtn: { vi: 'Tạo lộ trình bằng AI', en: 'Generate with AI' },
        yourItinerary: { vi: 'Lộ trình của bạn', en: 'Your Itinerary' },
        tips: { vi: '💡', en: '💡' },
        openMap: { vi: 'Mở Google Maps chỉ đường toàn bộ', en: 'Open full route on Google Maps' },
        directions: { vi: 'Chỉ đường', en: 'Directions' },
    }
};

const presetItineraries: Record<string, {
    title: { vi: string; en: string };
    description: { vi: string; en: string };
    duration: { vi: string; en: string };
    stops: { vi: string[]; en: string[] };
    detailTitle: { vi: string; en: string };
    totalCost: { vi: string; en: string };
    schedule: { time: string; activity: { vi: string; en: string }; icon: string; tip: { vi: string; en: string }; coords?: { lat: number; lng: number } }[];
    color: string;
    icon: any;
}> = {
    'half-day-morning': {
        title: { vi: 'Bình minh biển Phú Vinh', en: 'Phu Vinh Sunrise' },
        description: { vi: 'Ngắm bình minh biển & làng lăng mộ', en: 'Watch sunrise & tomb village' },
        duration: { vi: '5h - 11h', en: '5AM - 11AM' },
        stops: { vi: ['Biển Vinh Thanh', 'Khu lăng mộ An Bằng'], en: ['Vinh Thanh Beach', 'An Bang Tomb City'] },
        detailTitle: { vi: 'Lộ trình Nửa ngày sáng', en: 'Half Day Morning' },
        totalCost: { vi: '300-500k', en: '300-500k VND' },
        color: 'from-orange-500/20 to-yellow-500/20',
        icon: <Sun className="w-5 h-5 text-orange-400" />,
        schedule: [
            { time: '05:00', activity: { vi: 'Di chuyển từ Huế đến Vinh Thanh', en: 'Travel to Vinh Thanh' }, icon: '🚗', tip: { vi: 'Dọc đường ven biển tuyệt đẹp', en: 'Beautiful coastal road' }, coords: { lat: 16.4505, lng: 107.8035 } },
            { time: '05:30', activity: { vi: 'Đón bình minh trên biển Vinh Thanh', en: 'Watch sunrise at beach' }, icon: '🌅', tip: { vi: 'Không nên bỏ lỡ cảnh này!', en: 'Don\'t miss this view!' } },
            { time: '08:00', activity: { vi: 'Thăm Khu lăng mộ làng An Bằng', en: 'Visit An Bang Village' }, icon: '🏛️', tip: { vi: "Kiến trúc xa hoa độc đáo", en: "Unique and luxurious architecture" }, coords: { lat: 16.4207, lng: 107.8243 } },
            { time: '10:30', activity: { vi: 'Thưởng thức mắm địa phương & Về Huế', en: 'Local fish sauce & Back to Hue' }, icon: '🏠', tip: { vi: 'Mua quà lưu niệm', en: 'Buy souvenirs' } },
        ]
    },
    'full-day': {
        title: { vi: 'Phú Vinh Truyền Thống', en: 'Traditional Phu Vinh' },
        description: { vi: 'Trải nghiệm di tích & văn hóa bản địa', en: 'Experience heritage & local culture' },
        duration: { vi: '8h - 19h', en: '8AM - 7PM' },
        stops: { vi: ['Tháp Chăm', 'Đình Hà Thanh', 'Đua Ghe Nan'], en: ['Cham Tower', 'Ha Thanh House', 'Boat Racing'] },
        detailTitle: { vi: 'Lộ trình 1 Ngày văn hóa', en: 'Culture Day Journey' },
        totalCost: { vi: '500k-1 triệu/người', en: '500k-1M VND/person' },
        color: 'from-blue-500/20 to-cyan-500/20',
        icon: <Calendar className="w-5 h-5 text-blue-400" />,
        schedule: [
            { time: '08:00', activity: { vi: 'Tham quan Tháp Chăm Phú Diên', en: 'Visit Phu Dien Cham Tower' }, icon: '🛕', tip: { vi: 'Di tích quốc gia đặc biệt', en: 'National special heritage' }, coords: { lat: 16.4957, lng: 107.7460 } },
            { time: '10:00', activity: { vi: 'Thăm Đình Làng Hà Thanh', en: 'Visit Ha Thanh House' }, icon: '🏛️', tip: { vi: 'Lịch sử làng xã lâu đời', en: 'Long village history' }, coords: { lat: 16.4335, lng: 107.7796 } },
            { time: '12:00', activity: { vi: 'Ăn trưa hải sản tại biển Phú Diên', en: 'Lunch at Phu Dien beach' }, icon: '🍜', tip: { vi: 'Mực nướng tươi ngon', en: 'Fresh grilled squid' } },
            { time: '14:00', activity: { vi: 'Tìm hiểu Lễ hội Đua Ghe Nan', en: 'Learn about Boat Racing' }, icon: '🛶', tip: { vi: 'Văn hóa cầu ngư đặc sắc', en: 'Traditional fishing culture' }, coords: { lat: 16.4925, lng: 107.7495 } },
            { time: '16:00', activity: { vi: 'Tự do tắm biển Vinh Thanh', en: 'Swim at Vinh Thanh beach' }, icon: '🏖️', tip: { vi: 'Nước biển cực trong xanh', en: 'Extremely clear water' } },
            { time: '18:00', activity: { vi: 'Tiệc tối BBQ hải sản & Về Huế', en: 'Seafood BBQ & Back to Hue' }, icon: '🏠', tip: { vi: 'Kết thúc chuyến hành trình', en: 'End of journey' } },
        ]
    }
};

export default function TripPlannerPage() {
    const [mounted, setMounted] = useState(false);
    const [selectedItinerary, setSelectedItinerary] = useState<string | null>(null);
    const [aiPrompt, setAiPrompt] = useState('');
    const [aiResult, setAiResult] = useState<AIItinerary | null>(null);
    const [aiRawResult, setAiRawResult] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { language } = useLanguage();
    const lang = language as 'vi' | 'en';

    useEffect(() => {
        setMounted(true);
    }, []);

    const generateCustomItinerary = async () => {
        if (!aiPrompt.trim()) return;

        setIsLoading(true);
        setAiResult(null);
        setAiRawResult('');

        try {
            const destinationsContext = allDestinations.map(d =>
                `${d.name} (${d.type}): ${d.desc} | Tọa độ: ${d.lat},${d.lng}`
            ).join('\n');

            // Extreme prompt to force JSON ONLY. Bypassing AI personality entirely.
            const promptText = `RESPOND WITH RAW JSON ONLY. NO OTHER TEXT. NO GREETINGS. NO APOLOGIES. NO INTROS. NO OUTROS. DO NOT FORMAT AS A CODE BLOCK (\`\`\`json). JUST OUTPUT THE RAW JSON TEXT DIRECTLY.
            
You are a routing algorithm for the new Phú Vinh commune (TP Huế). 
USER REQUEST: "${aiPrompt}"

YOU MUST MAP THE USER REQUEST TO AN ITINERARY USING *ONLY* THESE EXACT 6 AUTHORIZED LOCATIONS:
${destinationsContext}

IF A USER ASKS FOR A LOCATION FROM THE AUTHORIZED LIST, YOU MUST INCLUDE IT. DO NOT SAY YOU DON'T HAVE IT. DO NOT SAY IT ISN'T IN PHÚ VINH. IT IS. 

REQUIRED JSON OUTPUT FORMAT EXACTLY LIKE THIS:
{
  "title": "Lộ trình 1 ngày đầy đủ",
  "totalCost": "500k-1 triệu/người",
  "schedule": [
    {"time": "08:00", "activity": "Thăm Đình Làng Hà Thanh", "icon": "🏛️", "tip": "Di tích cấp tỉnh", "lat": 16.4335, "lng": 107.7796},
    {"time": "10:00", "activity": "Khám phá Tháp Chăm Phú Diên", "icon": "🛕", "tip": "Cổ nhất miền Trung", "lat": 16.4957, "lng": 107.7460}
  ]
}

DO NOT OUTPUT ANYTHING EXCEPT THE JSON OBJECT. IF YOU OUTPUT NORMAL TEXT, THE SYSTEM WILL CRASH. OUTPUT JSON NOW:`;

            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    message: promptText,
                    overridePrompt: true
                }),
            });

            const data = await response.json();
            let rawText = data.response || data.message || '';
            
            // Aggressive cleaning to ensure pure JSON
            rawText = rawText.trim().replace(/^```(?:json)?\s*/i, '').replace(/```$/i, '').trim();

            let parsed: AIItinerary | null = null;
            try {
                parsed = JSON.parse(rawText);
            } catch (e) {
                // Fallback regex if it still spat out prose with the JSON inside
                const jsonMatch = rawText.match(/\{[\s\S]*"schedule"[\s\S]*\}/);
                if (jsonMatch) {
                    try { 
                        parsed = JSON.parse(jsonMatch[0]); 
                    } catch { /* fail fully */ }
                }
            }

            if (parsed && parsed.schedule) {
                // Post-process: ensure map links are added from our local DB
                parsed.schedule = parsed.schedule.map((item: AIScheduleItem) => {
                    const dest = allDestinations.find(d => 
                        (d.lat && Math.abs(d.lat - (item.lat || 0)) < 0.001) && 
                        (d.lng && Math.abs(d.lng - (item.lng || 0)) < 0.001)
                    );
                    return {
                        ...item,
                        mapUrl: dest?.link || (item.lat && item.lng ? `https://www.google.com/maps/dir/?api=1&destination=${item.lat},${item.lng}` : undefined)
                    };
                });
                setAiResult(parsed);
            } else {
                // If it fails to parse, we show it but styled better
                setAiRawResult(rawText);
            }
        } catch (error) {
            setAiRawResult(lang === 'vi' ? 'Lỗi kết nối AI.' : 'AI Connection error.');
        }
        setIsLoading(false);
    };

    if (!mounted) return null;

    return (
        <div className="min-h-screen pt-20 pb-12 bg-background">
            <div className="max-w-4xl mx-auto px-4">
                {/* Hero */}
                <div className="text-center mb-12">
                    <Badge variant="outline" className="mb-4 text-purple-400 border-purple-500/20 py-1">
                        <Sparkles className="w-3 h-3 mr-2" />
                        {pageContent.hero.badge[lang]}
                    </Badge>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                        {pageContent.hero.title1[lang]}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
                            {pageContent.hero.title2[lang]}
                        </span>
                    </h1>
                    <p className="text-muted-foreground text-lg">{pageContent.hero.subtitle[lang]}</p>
                </div>

                {/* AI Input Section */}
                <Card className="mb-12 border-purple-500/20 bg-purple-500/5 backdrop-blur-sm overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Sparkles className="w-24 h-24 text-purple-400" />
                    </div>
                    <CardContent className="p-8">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 flex items-center justify-center border border-purple-500/30">
                                <Map className="w-6 h-6 text-purple-400" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold">{pageContent.sections.aiTitle[lang]}</h2>
                                <p className="text-sm text-muted-foreground">{pageContent.sections.aiSubtitle[lang]}</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <textarea
                                className="w-full h-32 p-4 rounded-2xl bg-background/50 border border-border/50 focus:ring-2 focus:ring-purple-500/40 outline-none transition-all resize-none text-sm md:text-base"
                                placeholder={pageContent.sections.aiPlaceholder[lang]}
                                value={aiPrompt}
                                onChange={(e) => setAiPrompt(e.target.value)}
                            />
                            <Button 
                                onClick={generateCustomItinerary}
                                disabled={isLoading || !aiPrompt.trim()}
                                className="w-full bg-purple-500 hover:bg-purple-600 text-white h-12 rounded-xl font-bold text-lg shadow-lg shadow-purple-500/20"
                            >
                                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Sparkles className="w-5 h-5 mr-2" /> {pageContent.sections.generateBtn[lang]}</>}
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* AI Result Area */}
                <AnimatePresence>
                    {(aiResult || aiRawResult) && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
                            {aiResult ? (
                                <div className="relative overflow-hidden">
                                    <div className="mb-10">
                                        <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500 mb-2">
                                            {aiResult.title}
                                        </h3>
                                        <p className="text-muted-foreground text-sm flex items-center gap-2">
                                            {pageContent.sections.estimatedCost[lang]} 
                                            <span className="font-bold text-emerald-400 px-2 py-0.5 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                                                {aiResult.totalCost}
                                            </span>
                                        </p>
                                    </div>

                                    <div className="relative space-y-8 pb-4">
                                        {/* Seamless Vertical Line */}
                                        <div className="absolute left-[74px] md:left-[84px] top-4 bottom-4 w-[1px] bg-gradient-to-b from-emerald-500/50 via-emerald-500/20 to-transparent" />

                                        {aiResult.schedule.map((item, idx) => (
                                            <motion.div 
                                                key={idx} 
                                                initial={{ opacity: 0, x: -10 }} 
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: idx * 0.05 }}
                                                className="flex items-start gap-4 md:gap-8 group"
                                            >
                                                {/* Time Section */}
                                                <div className="w-16 md:w-20 pt-1 text-sm md:text-base font-bold text-emerald-400 shrink-0 tabular-nums">
                                                    {item.time}
                                                </div>

                                                {/* Icon Section (Acts as timeline node) */}
                                                <div className="relative z-10 w-8 h-8 md:w-10 md:h-10 rounded-xl bg-background border border-emerald-500/30 flex items-center justify-center text-xl md:text-2xl shadow-sm transition-transform group-hover:scale-110">
                                                    {item.icon}
                                                </div>

                                                {/* Content Section */}
                                                <div className="flex-1 pt-1">
                                                    <div className="flex items-center justify-between gap-4 mb-1">
                                                        <h4 className="text-base md:text-lg font-bold text-foreground group-hover:text-emerald-400 transition-colors">
                                                            {item.activity}
                                                        </h4>
                                                        {item.mapUrl && (
                                                            <a 
                                                                href={item.mapUrl} target="_blank" rel="noreferrer"
                                                                className="p-1.5 rounded-lg text-muted-foreground hover:text-emerald-400 hover:bg-emerald-400/10 transition-all"
                                                                title={pageContent.sections.directions[lang]}
                                                            >
                                                                <Navigation className="w-4 h-4" />
                                                            </a>
                                                        )}
                                                    </div>
                                                    {item.tip && (
                                                        <p className="text-xs md:text-sm text-muted-foreground flex items-center gap-2">
                                                            <span className="text-amber-400">💡</span>
                                                            {item.tip}
                                                        </p>
                                                    )}
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>

                                    <div className="mt-12">
                                        <Button 
                                            variant="outline" 
                                            className="w-full h-12 rounded-xl border-emerald-500/30 text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all shadow-lg shadow-emerald-500/5"
                                            onClick={() => {
                                                const coords = aiResult.schedule.filter(s => s.lat && s.lng).map(s => `${s.lat},${s.lng}`);
                                                if (coords.length > 0) window.open(`https://www.google.com/maps/dir/?api=1&destination=${coords[coords.length-1]}&waypoints=${coords.slice(0,-1).join('|')}`, '_blank');
                                            }}
                                        >
                                            <ExternalLink className="w-4 h-4 mr-2" /> {pageContent.sections.openMap[lang]}
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-8 rounded-3xl bg-card border border-border/50 shadow-xl whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                                    {aiRawResult}
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Preset Suggestions Title */}
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
                        <Clock className="w-5 h-5 text-orange-400" />
                    </div>
                    <h2 className="text-2xl font-bold">{pageContent.sections.suggested[lang]}</h2>
                </div>

                {/* Preset Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.entries(presetItineraries).map(([id, item], idx) => (
                        <motion.div key={id} onClick={() => setSelectedItinerary(selectedItinerary === id ? null : id)}>
                            <Card className={`group cursor-pointer border-border/40 hover:border-orange-500/30 transition-all ${selectedItinerary === id ? 'ring-2 ring-orange-500 shadow-xl' : 'hover:shadow-lg'}`}>
                                <CardContent className={`p-6 bg-gradient-to-br ${item.color}`}>
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="w-12 h-12 rounded-xl bg-background/50 flex items-center justify-center border border-border/20">{item.icon}</div>
                                        {selectedItinerary === id && <div className="h-6 w-6 rounded-full bg-orange-500 flex items-center justify-center ring-4 ring-orange-500/20"><CheckCircle className="w-4 h-4 text-white" /></div>}
                                    </div>
                                    <h3 className="text-xl font-bold mb-1">{item.title[lang]}</h3>
                                    <p className="text-sm text-muted-foreground mb-4">{item.description[lang]}</p>
                                    <div className="flex flex-wrap gap-2">
                                        {item.stops[lang].map((s, i) => <Badge key={i} variant="secondary" className="bg-background/40 hover:bg-background/60">{s}</Badge>)}
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}

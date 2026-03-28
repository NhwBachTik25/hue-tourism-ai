'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Map, MapPin, Navigation, Waves, Landmark, Flame, UtensilsCrossed } from 'lucide-react';
import { useLanguage } from '@/components/providers/language-provider';
import { EditableText } from '@/components/cms/EditableText';

// ============================================
// LOCATION DATA WITH OFFICIAL GOOGLE MAPS EMBEDS
// ============================================

interface MapLocation {
    id: string;
    name: { vi: string; en: string };
    description: { vi: string; en: string };
    category: { vi: string; en: string };
    icon: string;
    type: 'heritage' | 'beach' | 'culture' | 'spiritual';
    coordinates: { lat: number; lng: number };
}

const locationsData: MapLocation[] = [
    {
        id: 'dinh-ha-thanh',
        name: { vi: 'Đình Hà Thanh', en: 'Ha Thanh Communal House' },
        description: { vi: 'Di tích lịch sử cấp tỉnh, xây dựng từ thế kỷ XVI', en: 'Provincial heritage site, built in the 16th century' },
        category: { vi: 'Di tích', en: 'Heritage' },
        icon: '🏛️',
        type: 'heritage',
        coordinates: { lat: 16.4335918, lng: 107.7796597 },
    },
    {
        id: 'thap-cham-phu-dien',
        name: { vi: 'Tháp Chăm Phú Diên', en: 'Phu Dien Cham Tower' },
        description: { vi: 'Tháp Champa cổ nhất, kỷ lục thế giới', en: 'Oldest Champa tower, world record' },
        category: { vi: 'Di tích', en: 'Heritage' },
        icon: '🛕',
        type: 'heritage',
        coordinates: { lat: 16.4957912, lng: 107.7460799 },
    },
    {
        id: 'bien-phu-dien',
        name: { vi: 'Biển Phú Diên', en: 'Phu Dien Beach' },
        description: { vi: 'Bãi biển yên bình của làng chài truyền thống', en: 'Peaceful beach of the traditional fishing village' },
        category: { vi: 'Biển', en: 'Beach' },
        icon: '🌊',
        type: 'beach',
        coordinates: { lat: 16.4957433, lng: 107.7470525 },
    },
    {
        id: 'bien-vinh-thanh',
        name: { vi: 'Biển Vinh Thanh', en: 'Vinh Thanh Beach' },
        description: { vi: 'Bãi biển hoang sơ đẹp nhất vùng ven biển Phú Vinh', en: 'Most pristine beach in Phu Vinh coastal area' },
        category: { vi: 'Biển', en: 'Beach' },
        icon: '🏖️',
        type: 'beach',
        coordinates: { lat: 16.4505427, lng: 107.8035808 },
    },
    {
        id: 'an-bang',
        name: { vi: 'An Bằng', en: 'An Bang Village' },
        description: { vi: 'Thành phố lăng mộ nổi tiếng thế giới', en: 'World-famous city of tombs' },
        category: { vi: 'Văn hóa', en: 'Culture' },
        icon: '🪦',
        type: 'culture',
        coordinates: { lat: 16.4207477, lng: 107.8243632 },
    },
    {
        id: 'lang-ong-ngu',
        name: { vi: 'Lăng Ông Ngư', en: 'Whale Temple' },
        description: { vi: 'Nơi thờ Cá Ông - tín ngưỡng ngư dân biển', en: 'Whale worship temple - fishing tradition' },
        category: { vi: 'Tâm linh', en: 'Spiritual' },
        icon: '⛩️',
        type: 'spiritual',
        coordinates: { lat: 16.4780, lng: 107.7180 },
    },
];

// ============================================
// PAGE CONTENT
// ============================================

const pageContent = {
    hero: {
        badge: { vi: 'Bản đồ & Chỉ dẫn', en: 'Map & Directions' },
        title1: { vi: 'Bản đồ ', en: 'Map of ' },
        title2: { vi: 'Phú Vinh', en: 'Phu Vinh' },
        subtitle: { vi: 'Khám phá các địa danh nổi bật tại xã Phú Vinh trên Google Maps', en: 'Explore notable landmarks in Phu Vinh commune on Google Maps' }
    },
    sections: {
        locations: { vi: 'Chọn địa điểm', en: 'Select Location' },
        directions: { vi: 'Chỉ đường', en: 'Directions' },
        legend: { vi: 'Chú thích', en: 'Legend' }
    },
    categories: {
        heritage: { vi: 'Di tích', en: 'Heritage' },
        beach: { vi: 'Biển', en: 'Beach' },
        culture: { vi: 'Văn hóa', en: 'Culture' },
        spiritual: { vi: 'Tâm linh', en: 'Spiritual' },
    }
};

// ============================================
// MAP PAGE COMPONENT
// ============================================

export default function MapPage() {
    const [mounted, setMounted] = useState(false);
    const [activeLocationId, setActiveLocationId] = useState<string>(locationsData[0].id);
    const [isLoading, setIsLoading] = useState(false);
    const { language } = useLanguage();
    const lang = language as 'vi' | 'en';

    useEffect(() => {
        setMounted(true);
    }, []);

    const activeLocation = locationsData.find(loc => loc.id === activeLocationId)!;

    const handleLocationChange = useCallback((locationId: string) => {
        if (locationId === activeLocationId) return;
        setIsLoading(true);
        setActiveLocationId(locationId);
        // Clear loading state after iframe loads
        const timeout = setTimeout(() => setIsLoading(false), 1200);
        return () => clearTimeout(timeout);
    }, [activeLocationId]);

    const openDirections = useCallback((coords: { lat: number; lng: number }) => {
        window.open(`https://www.google.com/maps/dir/?api=1&destination=${coords.lat},${coords.lng}`, '_blank');
    }, []);

    const getTypeColor = (type: MapLocation['type']) => {
        switch (type) {
            case 'heritage': return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
            case 'beach': return 'text-blue-400 border-blue-500/30 bg-blue-500/10';
            case 'culture': return 'text-purple-400 border-purple-500/30 bg-purple-500/10';
            case 'spiritual': return 'text-rose-400 border-rose-500/30 bg-rose-500/10';
        }
    };

    const getActiveRing = (type: MapLocation['type']) => {
        switch (type) {
            case 'heritage': return 'border-amber-500 bg-amber-500/15 shadow-amber-500/20';
            case 'beach': return 'border-blue-500 bg-blue-500/15 shadow-blue-500/20';
            case 'culture': return 'border-purple-500 bg-purple-500/15 shadow-purple-500/20';
            case 'spiritual': return 'border-rose-500 bg-rose-500/15 shadow-rose-500/20';
        }
    };

    if (!mounted) {
        return (
            <div className="min-h-screen pt-14 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-14">
            {/* Hero */}
            <section className="py-8 px-4 hero-gradient">
                <div className="max-w-6xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <Badge className="mb-4 bg-green-500/20 text-green-400">
                            <Map className="w-3 h-3 mr-1" />
                            {pageContent.hero.badge[lang]}
                        </Badge>
                        <h1 className="text-3xl md:text-4xl font-bold mb-4 flex items-center justify-center gap-2">
                            <EditableText
                                id={`map.hero.title1.${lang}`}
                                defaultValue={pageContent.hero.title1[lang]}
                                as="span"
                            />
                            <EditableText
                                id={`map.hero.title2.${lang}`}
                                defaultValue={pageContent.hero.title2[lang]}
                                as="span"
                                className="text-green-400"
                            />
                        </h1>
                        <EditableText
                            id={`map.hero.subtitle.${lang}`}
                            defaultValue={pageContent.hero.subtitle[lang]}
                            as="p"
                            className="text-muted-foreground max-w-xl mx-auto"
                        />
                    </motion.div>
                </div>
            </section>

            {/* Map Viewer + Location Selector */}
            <section className="px-4 py-6">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* === MAP VIEWER (2/3 width) === */}
                        <div className="lg:col-span-2 space-y-3">
                            {/* Active location header */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">{activeLocation.icon}</span>
                                    <div>
                                        <h2 className="font-bold text-lg">{activeLocation.name[lang]}</h2>
                                        <p className="text-sm text-muted-foreground">{activeLocation.description[lang]}</p>
                                    </div>
                                </div>
                                <Button
                                    size="sm"
                                    className="bg-green-500 hover:bg-green-600 shrink-0"
                                    onClick={() => openDirections(activeLocation.coordinates)}
                                >
                                    <Navigation className="w-4 h-4 mr-2" />
                                    {pageContent.sections.directions[lang]}
                                </Button>
                            </div>

                            {/* Single iframe viewer */}
                            <div className="relative aspect-video lg:aspect-[4/3] rounded-2xl overflow-hidden border-2 border-border bg-muted/30">
                                {/* Loading overlay */}
                                <AnimatePresence>
                                    {isLoading && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="absolute inset-0 z-10 bg-background/60 backdrop-blur-sm flex items-center justify-center"
                                        >
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
                                                <span className="text-sm text-muted-foreground">
                                                    {lang === 'vi' ? 'Đang tải bản đồ...' : 'Loading map...'}
                                                </span>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* THE SINGLE IFRAME */}
                                <iframe
                                    key={activeLocationId}
                                    src={`https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d2000!2d${activeLocation.coordinates.lng}!3d${activeLocation.coordinates.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1s${lang}!2svn!4v1`}
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    onLoad={() => setIsLoading(false)}
                                />
                            </div>
                        </div>

                        {/* === LOCATION SELECTOR (1/3 width) === */}
                        <div className="space-y-3">
                            <h3 className="font-bold text-lg flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-green-400" />
                                {pageContent.sections.locations[lang]}
                            </h3>

                            <div className="space-y-2 lg:max-h-[600px] lg:overflow-y-auto lg:pr-1">
                                {locationsData.map((loc, index) => {
                                    const isActive = loc.id === activeLocationId;

                                    return (
                                        <motion.div
                                            key={loc.id}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.08 }}
                                        >
                                            <Card
                                                className={`cursor-pointer transition-all duration-200 ${isActive
                                                    ? `${getActiveRing(loc.type)} shadow-lg`
                                                    : 'border-border/50 hover:border-green-500/50 hover:shadow-md'
                                                    }`}
                                                onClick={() => handleLocationChange(loc.id)}
                                            >
                                                <CardContent className="p-3">
                                                    <div className="flex items-start gap-3">
                                                        <div className={`text-2xl w-10 h-10 flex items-center justify-center rounded-lg shrink-0 ${isActive ? 'scale-110' : ''} transition-transform`}>
                                                            {loc.icon}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <EditableText
                                                                id={`map.loc.${loc.id}.name.${lang}`}
                                                                defaultValue={loc.name[lang]}
                                                                as="h4"
                                                                className={`font-semibold text-sm ${isActive ? 'text-green-400' : ''}`}
                                                            />
                                                            <EditableText
                                                                id={`map.loc.${loc.id}.desc.${lang}`}
                                                                defaultValue={loc.description[lang]}
                                                                as="p"
                                                                className="text-xs text-muted-foreground mt-0.5 line-clamp-1"
                                                            />
                                                            <div className="flex items-center gap-2 mt-1.5">
                                                                <Badge variant="secondary" className={`text-xs py-0 ${getTypeColor(loc.type)}`}>
                                                                    {loc.category[lang]}
                                                                </Badge>
                                                                {isActive && (
                                                                    <motion.span
                                                                        initial={{ opacity: 0, scale: 0.8 }}
                                                                        animate={{ opacity: 1, scale: 1 }}
                                                                        className="text-xs text-green-400 font-medium"
                                                                    >
                                                                        {lang === 'vi' ? '◉ Đang xem' : '◉ Viewing'}
                                                                    </motion.span>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            className="shrink-0 h-8 w-8 p-0"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                openDirections(loc.coordinates);
                                                            }}
                                                            title={pageContent.sections.directions[lang]}
                                                        >
                                                            <Navigation className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Legend */}
            <section className="px-4 pb-8">
                <div className="max-w-6xl mx-auto">
                    <div className="glass rounded-xl p-4">
                        <h4 className="font-semibold mb-3">{pageContent.sections.legend[lang]}</h4>
                        <div className="flex flex-wrap gap-4">
                            <div className="flex items-center gap-2">
                                <Landmark className="w-4 h-4 text-amber-400" />
                                <span className="text-sm">{pageContent.categories.heritage[lang]}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Waves className="w-4 h-4 text-blue-400" />
                                <span className="text-sm">{pageContent.categories.beach[lang]}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-purple-400" />
                                <span className="text-sm">{pageContent.categories.culture[lang]}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Flame className="w-4 h-4 text-rose-400" />
                                <span className="text-sm">{pageContent.categories.spiritual[lang]}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

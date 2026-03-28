'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, Navigation, MessageCircle, Info, Sparkles, X, Lightbulb, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ImageCarousel } from '@/components/ui/image-carousel';
import { ImagePreview } from '@/components/ui/image-preview';
import { useLanguage } from '@/components/providers/language-provider';
import { destinations, commonTranslations } from '@/data/bilingual-data';
import { EditableText } from '@/components/cms/EditableText';
import { EditableImage } from '@/components/cms/EditableImage';

export default function DestinationsPage() {
    const [mounted, setMounted] = useState(false);
    const [selectedDestination, setSelectedDestination] = useState<typeof destinations[0] | null>(null);
    const { language } = useLanguage();

    useEffect(() => {
        setMounted(true);
    }, []);

    const openDirections = useCallback((coords: { lat: number; lng: number }) => {
        window.open(`https://www.google.com/maps/dir/?api=1&destination=${coords.lat},${coords.lng}`, '_blank');
    }, []);

    const askAI = useCallback((title: string) => {
        const question = language === 'vi'
            ? `Cho tôi biết thêm về ${title} ở Phú Vinh?`
            : `Tell me more about ${title} in Phu Vinh?`;
        const event = new CustomEvent('open-chat-with-message', { detail: question });
        window.dispatchEvent(event);
    }, [language]);

    // Translation helper
    const t = (key: keyof typeof commonTranslations) => commonTranslations[key][language];

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
            <section className="py-12 px-4 hero-gradient">
                <div className="max-w-6xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <Badge className="mb-4 bg-blue-500/20 text-blue-400">
                            <MapPin className="w-3 h-3 mr-1" />
                            {language === 'vi' ? 'Địa điểm du lịch' : 'Tourist Destinations'}
                        </Badge>
                        <h1 className="text-3xl md:text-4xl font-bold mb-4">
                            {language === 'vi' ? 'Khám phá ' : 'Explore '}
                            <span className="text-blue-400">Phú Vinh</span>
                        </h1>
                        <EditableText
                            id={`destinations.page.subtitle.${language}`}
                            defaultValue={language === 'vi'
                                ? 'Những điểm đến tự nhiên và văn hóa đặc sắc tại xã Phú Vinh, thành phố Huế'
                                : 'Natural and cultural destinations in Phu Vinh commune, Hue city'}
                            as="p"
                            className="text-muted-foreground max-w-xl mx-auto"
                        />
                    </motion.div>
                </div>
            </section>

            {/* Destinations Grid */}
            <section className="py-8 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {destinations.map((dest, index) => (
                            <motion.div
                                key={dest.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ y: -5 }}
                            >
                                <Card
                                    className="overflow-hidden bg-card/50 backdrop-blur border-border/50 cursor-pointer hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10 transition-all"
                                    onClick={() => setSelectedDestination(dest)}
                                >
                                    <div className="relative aspect-video overflow-hidden group">
                                        {/* EDITABLE Image */}
                                        <EditableImage
                                            id={`destinations.${dest.id}.image`}
                                            defaultSrc={dest.images[0]}
                                            alt={dest.title[language]}
                                            className="w-full h-full object-cover"
                                            containerClassName="w-full h-full"
                                        />
                                        <Badge className="absolute top-3 left-3 bg-blue-500/90 z-10">
                                            {dest.category[language]}
                                        </Badge>
                                        {/* Hover overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4 z-10">
                                            <span className="text-white text-sm font-medium">
                                                {t('label.viewDetails')} →
                                            </span>
                                        </div>
                                    </div>
                                    <CardContent className="p-4">
                                        {/* EDITABLE Title */}
                                        <EditableText
                                            id={`destinations.${dest.id}.title.${language}`}
                                            defaultValue={dest.title[language]}
                                            as="h3"
                                            className="font-bold text-lg mb-2"
                                        />
                                        {/* EDITABLE Description */}
                                        <EditableText
                                            id={`destinations.${dest.id}.description.${language}`}
                                            defaultValue={dest.description[language]}
                                            as="p"
                                            className="text-sm text-muted-foreground mb-3 line-clamp-2"
                                        />

                                        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
                                            <MapPin className="w-3 h-3" />
                                            {dest.location[language]}
                                        </div>

                                        <div className="flex flex-wrap gap-1 mb-3">
                                            {dest.highlights[language].slice(0, 3).map((h, i) => (
                                                <Badge key={i} variant="secondary" className="text-xs">
                                                    {h}
                                                </Badge>
                                            ))}
                                        </div>

                                        <div className="flex gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="flex-1"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    openDirections(dest.coordinates);
                                                }}
                                            >
                                                <Navigation className="w-3 h-3 mr-1" />
                                                {t('button.directions')}
                                            </Button>
                                            <Button
                                                size="sm"
                                                className="flex-1 bg-blue-500 hover:bg-blue-600"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedDestination(dest);
                                                }}
                                            >
                                                <Info className="w-3 h-3 mr-1" />
                                                {t('button.details')}
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Detail Modal */}
            <AnimatePresence>
                {selectedDestination && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
                            onClick={() => setSelectedDestination(null)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="fixed inset-4 md:inset-8 lg:inset-16 z-50 bg-card rounded-2xl overflow-hidden flex flex-col"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div className="p-4 border-b border-border flex items-center justify-between">
                                <div>
                                    <EditableText
                                        id={`destinations.${selectedDestination.id}.title.${language}`}
                                        defaultValue={selectedDestination.title[language]}
                                        as="h2"
                                        className="text-xl font-bold"
                                    />
                                    <p className="text-sm text-muted-foreground">{selectedDestination.location[language]}</p>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => setSelectedDestination(null)}>
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>

                            {/* Content - Two Column */}
                            <div className="flex-1 overflow-y-auto">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4">
                                    {/* Left: Gallery */}
                                    <div className="space-y-4">
                                        <div className="aspect-video rounded-xl overflow-hidden">
                                            <ImageCarousel
                                                images={selectedDestination.images}
                                                title={selectedDestination.title[language]}
                                            />
                                        </div>
                                    </div>

                                    {/* Right: Info */}
                                    <div className="space-y-4">
                                        {/* Intro - EDITABLE */}
                                        <div className="p-4 bg-muted/50 rounded-xl">
                                            <h3 className="font-semibold mb-2 flex items-center gap-2">
                                                <Info className="w-4 h-4 text-blue-400" />
                                                {t('section.intro')}
                                            </h3>
                                            <EditableText
                                                id={`destinations.${selectedDestination.id}.description.${language}`}
                                                defaultValue={selectedDestination.description[language]}
                                                as="p"
                                                className="text-muted-foreground text-sm"
                                            />
                                        </div>

                                        {/* Hours & Cost */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="p-3 bg-blue-500/10 rounded-xl">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Clock className="w-4 h-4 text-blue-400" />
                                                    <span className="text-xs font-medium">{t('label.hours')}</span>
                                                </div>
                                                <p className="text-xs text-muted-foreground">
                                                    {selectedDestination.hours[language]}
                                                </p>
                                            </div>
                                            <div className="p-3 bg-green-500/10 rounded-xl">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <DollarSign className="w-4 h-4 text-green-400" />
                                                    <span className="text-xs font-medium">{t('label.cost')}</span>
                                                </div>
                                                <p className="text-xs text-muted-foreground">
                                                    {selectedDestination.cost[language]}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Highlights */}
                                        <div>
                                            <h3 className="font-semibold mb-2 flex items-center gap-2">
                                                <Sparkles className="w-4 h-4 text-yellow-400" />
                                                {t('section.highlights')}
                                            </h3>
                                            <div className="flex flex-wrap gap-2">
                                                {selectedDestination.highlights[language].map((h, i) => (
                                                    <Badge key={i} className="bg-blue-500/20 text-blue-400">
                                                        {h}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Tips - EDITABLE */}
                                        <div className="p-4 bg-yellow-500/10 rounded-xl">
                                            <h3 className="font-semibold mb-2 flex items-center gap-2 text-yellow-400">
                                                <Lightbulb className="w-4 h-4" />
                                                {t('section.tips')}
                                            </h3>
                                            <ul className="space-y-2">
                                                {selectedDestination.tips[language].map((tip, i) => (
                                                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                                                        <span className="mt-1">•</span>
                                                        <EditableText
                                                            id={`destinations.${selectedDestination.id}.tips.${i}.${language}`}
                                                            defaultValue={tip}
                                                            as="span"
                                                            className=""
                                                        />
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        {/* Map */}
                                        <div className="rounded-xl overflow-hidden border border-border/50 mt-4">
                                            <iframe
                                                src={`https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d2000!2d${selectedDestination.coordinates.lng}!3d${selectedDestination.coordinates.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1s${language}!2svn!4v1`}
                                                width="100%"
                                                height="200"
                                                style={{ border: 0 }}
                                                allowFullScreen
                                                loading="lazy"
                                            />
                                        </div>


                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="p-4 border-t border-border flex gap-2">
                                <Button
                                    variant="outline"
                                    className="flex-1"
                                    onClick={() => askAI(selectedDestination.title[language])}
                                >
                                    <MessageCircle className="w-4 h-4 mr-2" />
                                    {t('button.askAI')}
                                </Button>
                                <Button
                                    className="flex-1 bg-blue-500 hover:bg-blue-600"
                                    onClick={() => openDirections(selectedDestination.coordinates)}
                                >
                                    <Navigation className="w-4 h-4 mr-2" />
                                    {t('button.getDirections')}
                                </Button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}

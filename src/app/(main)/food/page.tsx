'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Navigation, Info, UtensilsCrossed, X, Lightbulb, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ImageCarousel } from '@/components/ui/image-carousel';
import { useLanguage } from '@/components/providers/language-provider';
import { foods, commonTranslations } from '@/data/bilingual-data';
import { EditableText } from '@/components/cms/EditableText';
import { EditableImage } from '@/components/cms/EditableImage';

export default function FoodPage() {
    const [mounted, setMounted] = useState(false);
    const [selectedFood, setSelectedFood] = useState<typeof foods[0] | null>(null);
    const { language } = useLanguage();

    useEffect(() => {
        setMounted(true);
    }, []);

    const openDirections = useCallback((coords: { lat: number; lng: number }) => {
        window.open(`https://www.google.com/maps/dir/?api=1&destination=${coords.lat},${coords.lng}`, '_blank');
    }, []);

    const askAI = useCallback((title: string) => {
        const question = language === 'vi'
            ? `Cho tôi biết thêm về ${title}?`
            : `Tell me more about ${title}?`;
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
                        <Badge className="mb-4 bg-emerald-500/20 text-emerald-400">
                            <UtensilsCrossed className="w-3 h-3 mr-1" />
                            {language === 'vi' ? 'Ẩm thực địa phương' : 'Local Cuisine'}
                        </Badge>
                        <h1 className="text-3xl md:text-4xl font-bold mb-4">
                            {language === 'vi' ? 'Ẩm thực ' : 'Cuisine of '}
                            <span className="text-emerald-400">Phú Vinh</span>
                        </h1>
                        <EditableText
                            id={`food.page.subtitle.${language}`}
                            defaultValue={language === 'vi'
                                ? 'Hương vị biển cả và đặc sản làng nghề truyền thống'
                                : 'Ocean flavors and traditional craft village specialties'}
                            as="p"
                            className="text-muted-foreground max-w-xl mx-auto"
                        />
                    </motion.div>
                </div>
            </section>

            {/* Food Grid */}
            <section className="py-8 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {foods.map((food, index) => (
                            <motion.div
                                key={food.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card
                                    className="overflow-hidden bg-card/50 backdrop-blur border-border/50 cursor-pointer hover:border-emerald-500/50 transition-all"
                                    onClick={() => setSelectedFood(food)}
                                >
                                    <div className="relative aspect-video overflow-hidden group">
                                        <EditableImage
                                            id={`food.${food.id}.image`}
                                            defaultSrc={food.images[0]}
                                            alt={food.title[language]}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            containerClassName="w-full h-full"
                                        />
                                        <Badge className="absolute top-3 left-3 bg-emerald-500/80 z-10">
                                            {food.category[language]}
                                        </Badge>
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4 z-10">
                                            <span className="text-white text-sm font-medium">
                                                {t('label.viewDetails')} →
                                            </span>
                                        </div>
                                    </div>
                                    <CardContent className="p-4">
                                        <EditableText
                                            id={`food.${food.id}.title.${language}`}
                                            defaultValue={food.title[language]}
                                            as="h3"
                                            className="font-bold text-lg mb-2"
                                        />
                                        <EditableText
                                            id={`food.${food.id}.description.${language}`}
                                            defaultValue={food.description[language]}
                                            as="p"
                                            className="text-sm text-muted-foreground mb-3 line-clamp-2"
                                        />

                                        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
                                            <MapPin className="w-3 h-3" />
                                            {food.location[language]}
                                        </div>

                                        <div className="flex flex-wrap gap-1 mb-3">
                                            {food.dishes[language].slice(0, 3).map((d, i) => (
                                                <Badge key={i} variant="secondary" className="text-xs">
                                                    {d}
                                                </Badge>
                                            ))}
                                            {food.dishes[language].length > 3 && (
                                                <Badge variant="secondary" className="text-xs">
                                                    +{food.dishes[language].length - 3}
                                                </Badge>
                                            )}
                                        </div>

                                        <div className="flex gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="flex-1"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    openDirections(food.coordinates);
                                                }}
                                            >
                                                <Navigation className="w-3 h-3 mr-1" />
                                                {t('button.directions')}
                                            </Button>
                                            <Button
                                                size="sm"
                                                className="flex-1 bg-emerald-500 hover:bg-emerald-600"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedFood(food);
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
                {selectedFood && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
                            onClick={() => setSelectedFood(null)}
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
                                        id={`food.${selectedFood.id}.title.${language}`}
                                        defaultValue={selectedFood.title[language]}
                                        as="h2"
                                        className="text-xl font-bold"
                                    />
                                    <p className="text-sm text-muted-foreground">{selectedFood.location[language]}</p>
                                </div>
                                <Button variant="ghost" size="sm" onClick={() => setSelectedFood(null)}>
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>

                            {/* Content */}
                            <div className="flex-1 overflow-y-auto p-4">
                                {/* Image Carousel */}
                                <div className="aspect-video rounded-xl overflow-hidden mb-4">
                                    <ImageCarousel
                                        images={selectedFood.images}
                                        title={selectedFood.title[language]}
                                    />
                                </div>

                                {/* Description - EDITABLE */}
                                <div className="mb-4">
                                    <h3 className="font-semibold mb-2">{t('section.intro')}</h3>
                                    <EditableText
                                        id={`food.${selectedFood.id}.description.${language}`}
                                        defaultValue={selectedFood.description[language]}
                                        as="p"
                                        className="text-muted-foreground"
                                    />
                                </div>

                                {/* Dishes - EDITABLE */}
                                <div className="mb-4">
                                    <h3 className="font-semibold mb-2">{t('section.dishes')}</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedFood.dishes[language].map((d, i) => (
                                            <Badge key={i} className="bg-emerald-500/20 text-emerald-400">
                                                <EditableText
                                                    id={`food.${selectedFood.id}.dishes.${i}.${language}`}
                                                    defaultValue={d}
                                                    as="span"
                                                    className=""
                                                />
                                            </Badge>
                                        ))}
                                    </div>
                                </div>

                                {/* Tips - EDITABLE */}
                                <div className="mb-4 p-4 bg-emerald-500/10 rounded-xl">
                                    <h3 className="font-semibold mb-2 text-emerald-400 flex items-center gap-2">
                                        <Lightbulb className="w-4 h-4" />
                                        {language === 'vi' ? 'Mẹo' : 'Tips'}
                                    </h3>
                                    <EditableText
                                        id={`food.${selectedFood.id}.tips.${language}`}
                                        defaultValue={selectedFood.tips[language]}
                                        as="p"
                                        className="text-sm text-muted-foreground"
                                    />
                                </div>


                            </div>

                            {/* Footer */}
                            <div className="p-4 border-t border-border flex gap-2">
                                <Button
                                    variant="outline"
                                    className="flex-1"
                                    onClick={() => askAI(selectedFood.title[language])}
                                >
                                    <MessageCircle className="w-4 h-4 mr-2" />
                                    {t('button.askAI')}
                                </Button>
                                <Button
                                    className="flex-1 bg-emerald-500 hover:bg-emerald-600"
                                    onClick={() => openDirections(selectedFood.coordinates)}
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

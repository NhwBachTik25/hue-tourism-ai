'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Navigation, Info, Flame, X, Sparkles, ShoppingBag, History, Cog, Lightbulb, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ImageCarousel } from '@/components/ui/image-carousel';
import { useLanguage } from '@/components/providers/language-provider';
import { crafts, commonTranslations } from '@/data/bilingual-data';
import { EditableText } from '@/components/cms/EditableText';
import { EditableImage } from '@/components/cms/EditableImage';
import { Play } from 'lucide-react';

export default function CraftsPage() {
    const [mounted, setMounted] = useState(false);
    const [selectedCraft, setSelectedCraft] = useState<typeof crafts[0] | null>(null);
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
                        <Badge className="mb-4 bg-orange-500/20 text-orange-400">
                            <Flame className="w-3 h-3 mr-1" />
                            {language === 'vi' ? 'Làng nghề truyền thống' : 'Traditional Crafts'}
                        </Badge>
                        <h1 className="text-3xl md:text-4xl font-bold mb-4">
                            {language === 'vi' ? 'Nghề truyền thống ' : 'Traditional Crafts of '}
                            <span className="text-orange-400">Phú Vinh</span>
                        </h1>
                        <EditableText
                            id={`crafts.page.subtitle.${language}`}
                            defaultValue={language === 'vi'
                                ? 'Khám phá các làng nghề truyền thống với sản phẩm đặc sản địa phương độc đáo'
                                : 'Discover traditional craft villages with unique local specialty products'}
                            as="p"
                            className="text-muted-foreground max-w-xl mx-auto"
                        />
                    </motion.div>
                </div>
            </section>

            {/* Featured Video Section */}
            <section className="py-10 px-4">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-2xl md:text-3xl font-bold text-center mb-2">
                            {language === 'vi' ? 'Video ' : 'Traditional Craft '}
                            <span className="text-orange-400">{language === 'vi' ? 'Nghề Truyền Thống' : 'Video'}</span>
                        </h2>
                        <p className="text-center text-muted-foreground mb-8 max-w-xl mx-auto">
                            {language === 'vi'
                                ? 'Khám phá quy trình làm mắm truyền thống của ngư dân Phú Diên qua video tư liệu'
                                : 'Discover the traditional fish sauce making process of Phu Dien fishermen through documentary footage'}
                        </p>
                        <div className="rounded-2xl overflow-hidden shadow-2xl border border-border/50 bg-black aspect-video relative group max-w-4xl mx-auto">
                            <video
                                src="/video/5_ngelammam.mp4"
                                controls
                                className="w-full h-full object-cover rounded-2xl"
                                poster={crafts.find(c => c.id === 'mam-phu-dien')?.images[0]}
                            />
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Crafts Grid */}
            <section className="py-8 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {crafts.map((craft, index) => (
                            <motion.div
                                key={craft.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ y: -5 }}
                            >
                                <Card
                                    className="overflow-hidden bg-card/50 backdrop-blur border-border/50 cursor-pointer hover:border-orange-500/50 hover:shadow-lg hover:shadow-orange-500/10 transition-all"
                                    onClick={() => setSelectedCraft(craft)}
                                >
                                    <div className="relative aspect-video overflow-hidden group">
                                        <EditableImage
                                            id={`crafts.${craft.id}.image`}
                                            defaultSrc={craft.images[0]}
                                            alt={craft.title[language]}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            containerClassName="w-full h-full"
                                        />
                                        <Badge className="absolute top-3 left-3 bg-orange-500/90 z-10">
                                            {craft.category[language]}
                                        </Badge>
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4 z-10">
                                            <span className="text-white text-sm font-medium">
                                                {t('label.viewDetails')} →
                                            </span>
                                        </div>
                                    </div>
                                    <CardContent className="p-4">
                                        <EditableText
                                            id={`crafts.${craft.id}.title.${language}`}
                                            defaultValue={craft.title[language]}
                                            as="h3"
                                            className="font-bold text-lg mb-2"
                                        />
                                        <EditableText
                                            id={`crafts.${craft.id}.description.${language}`}
                                            defaultValue={craft.description[language]}
                                            as="p"
                                            className="text-sm text-muted-foreground mb-3 line-clamp-2"
                                        />

                                        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
                                            <MapPin className="w-3 h-3" />
                                            {craft.location[language]}
                                        </div>

                                        <div className="flex flex-wrap gap-1 mb-3">
                                            {craft.products.slice(0, 3).map((p, i) => (
                                                <Badge key={i} variant="secondary" className="text-xs">
                                                    {p.name[language]}
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
                                                    openDirections(craft.coordinates);
                                                }}
                                            >
                                                <Navigation className="w-3 h-3 mr-1" />
                                                {t('button.directions')}
                                            </Button>
                                            <Button
                                                size="sm"
                                                className="flex-1 bg-orange-500 hover:bg-orange-600"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedCraft(craft);
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
                {selectedCraft && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
                            onClick={() => setSelectedCraft(null)}
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
                                        id={`crafts.${selectedCraft.id}.title.${language}`}
                                        defaultValue={selectedCraft.title[language]}
                                        as="h2"
                                        className="text-xl font-bold"
                                    />
                                    <p className="text-sm text-muted-foreground">{selectedCraft.location[language]}</p>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => setSelectedCraft(null)}>
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>

                            {/* Content */}
                            <div className="flex-1 overflow-y-auto">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4">
                                    {/* Left: Gallery */}
                                    <div className="space-y-4">
                                        <div className="aspect-video rounded-xl overflow-hidden">
                                            <ImageCarousel
                                                images={selectedCraft.images}
                                                title={selectedCraft.title[language]}
                                            />
                                        </div>

                                        {/* History - EDITABLE */}
                                        <div className="p-4 bg-orange-500/10 rounded-xl">
                                            <h3 className="font-semibold mb-2 flex items-center gap-2 text-orange-400">
                                                <History className="w-4 h-4" />
                                                {t('section.history')}
                                            </h3>
                                            <EditableText
                                                id={`crafts.${selectedCraft.id}.history.${language}`}
                                                defaultValue={selectedCraft.history[language]}
                                                as="p"
                                                className="text-sm text-muted-foreground"
                                            />
                                        </div>
                                    </div>

                                    {/* Right: Info */}
                                    <div className="space-y-4">
                                        {/* Process */}
                                        <div className="p-4 bg-muted/50 rounded-xl">
                                            <h3 className="font-semibold mb-3 flex items-center gap-2">
                                                <Cog className="w-4 h-4 text-blue-400" />
                                                {t('section.process')}
                                            </h3>
                                            <div className="space-y-2">
                                                {selectedCraft.process.map((step, i) => (
                                                    <div key={i} className="flex items-start gap-3 text-sm">
                                                        <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-bold flex-shrink-0">
                                                            {i + 1}
                                                        </span>
                                                        <EditableText
                                                            id={`crafts.${selectedCraft.id}.process.${i}.${language}`}
                                                            defaultValue={step[language].replace(/^\d+\.\s*/, '')}
                                                            as="span"
                                                            className="text-muted-foreground pt-0.5"
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Products */}
                                        <div>
                                            <h3 className="font-semibold mb-3 flex items-center gap-2">
                                                <ShoppingBag className="w-4 h-4 text-green-400" />
                                                {t('section.products')}
                                            </h3>
                                            <div className="grid grid-cols-2 gap-2">
                                                {selectedCraft.products.map((product, i) => (
                                                    <div key={i} className="p-3 bg-green-500/10 rounded-lg">
                                                        <EditableText
                                                            id={`crafts.${selectedCraft.id}.products.${i}.name.${language}`}
                                                            defaultValue={product.name[language]}
                                                            as="p"
                                                            className="text-sm font-medium"
                                                        />
                                                        <p className="text-xs text-green-400 font-bold">{product.price}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Tips - EDITABLE */}
                                        <div className="p-4 bg-yellow-500/10 rounded-xl">
                                            <h3 className="font-semibold mb-2 flex items-center gap-2 text-yellow-400">
                                                <Lightbulb className="w-4 h-4" />
                                                {t('section.buyTips')}
                                            </h3>
                                            <ul className="space-y-2">
                                                {selectedCraft.tips[language].map((tip, i) => (
                                                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                                                        <span className="mt-1">•</span>
                                                        <EditableText
                                                            id={`crafts.${selectedCraft.id}.tips.${i}.${language}`}
                                                            defaultValue={tip}
                                                            as="span"
                                                            className=""
                                                        />
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        {/* Video instead of Map */}
                                        {selectedCraft.video && (
                                            <div>
                                                <h3 className="font-semibold mb-2 flex items-center gap-2">
                                                    <Play className="w-4 h-4 text-emerald-500" />
                                                    {language === 'vi' ? 'Video' : 'Video'}
                                                </h3>
                                                <div className="rounded-xl overflow-hidden border border-border/50 bg-black aspect-video">
                                                    {selectedCraft.video.includes('drive.google.com') ? (
                                                        <iframe
                                                            src={selectedCraft.video}
                                                            allowFullScreen
                                                            className="w-full h-full"
                                                        />
                                                    ) : (
                                                        <video 
                                                            src={selectedCraft.video} 
                                                            controls 
                                                            className="w-full h-full"
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="p-4 border-t border-border flex gap-2">
                                <Button
                                    variant="outline"
                                    className="flex-1"
                                    onClick={() => askAI(selectedCraft.title[language])}
                                >
                                    <MessageCircle className="w-4 h-4 mr-2" />
                                    {t('button.askAI')}
                                </Button>
                                <Button
                                    className="flex-1 bg-orange-500 hover:bg-orange-600"
                                    onClick={() => openDirections(selectedCraft.coordinates)}
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

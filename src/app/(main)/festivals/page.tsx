'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Clock, Info, Navigation, Image as ImageIcon, Sparkles, Ship, Music, Flag } from 'lucide-react';
import { useLanguage } from '@/components/providers/language-provider';
import { ImagePreview } from '@/components/ui/image-preview';

export default function FestivalsPage() {
    const { language } = useLanguage();
    const lang = language as 'vi' | 'en';

    const content = {
        hero: {
            title: { vi: 'Lễ Hội Đua Ghe Nan Làng Phương Diên', en: 'Phuong Dien Bamboo Boat Racing Festival' },
            subtitle: {
                vi: 'Lễ hội truyền thống tiêu biểu của cư dân vùng biển Phú Vinh',
                en: 'Signature traditional festival of Phu Vinh coastal community'
            },
            badge: { vi: 'Lễ hội truyền thống', en: 'Traditional Festival' }
        },
        intro: {
            title: { vi: 'Về Lễ Hội', en: 'About the Festival' },
            description: {
                vi: 'Đua ghe nan làng Phương Diên là lễ hội truyền thống tiêu biểu của cư dân vùng biển Phú Vinh. Lễ hội có từ thế kỷ XVII, gắn với quá trình khai canh, lập làng của cha ông. Qua đó, người dân gửi gắm ước mong mưa thuận gió hòa, ra khơi bình an, đánh bắt thuận lợi.',
                en: 'Phuong Dien bamboo boat racing is a signature traditional festival of the Phu Vinh coastal community. Dating from the 17th century, it is linked to the ancestors\' process of land cultivation and village establishment. Through the festival, local people express their wishes for favorable weather, safe voyages, and bountiful catches.'
            },
            history: {
                vi: 'Gắn liền với lịch sử khai hoang lập ấp, lễ hội thể hiện lòng biết ơn đối với các bậc tiền nhân và thần Nam Hải (Cá Ông) - vị thần che chở cho ngư dân giữa biển khơi.',
                en: 'Tied to the history of land cultivation and village establishment, the festival expresses gratitude to ancestors and the Nam Hai God (Whale God) - the deity protecting fishermen at sea.'
            }
        },
        activities: {
            title: { vi: 'Hoạt Động Đặc Sắc', en: 'Key Activities' },
            items: [
                {
                    icon: <Ship className="w-8 h-8 text-blue-500" />,
                    title: { vi: 'Đua Ghe Nan Truyền Thống', en: 'Traditional Bamboo Boat Racing' },
                    desc: {
                        vi: 'Cuộc thi gay cấn giữa các đội ghe nan đại diện cho các dòng họ, thể hiện sức mạnh và tinh thần đoàn kết cộng đồng.',
                        en: 'Thrilling competition between bamboo boat teams representing different clans, showcasing strength and community spirit.'
                    }
                },
                {
                    icon: <Sparkles className="w-8 h-8 text-yellow-500" />,
                    title: { vi: 'Lễ Tế Thần Biển', en: 'Sea God Worship' },
                    desc: {
                        vi: 'Nghi lễ trang trọng dâng hương, hoa và lễ vật lên thần Nam Hải, cầu mong bình an.',
                        en: 'Solemn ritual offering incense, flowers, and offerings to the Nam Hai God, praying for peace.'
                    }
                },
                {
                    icon: <Music className="w-8 h-8 text-pink-500" />,
                    title: { vi: 'Hát Bội & Hò Khoan', en: 'Folk Singing & Performance' },
                    desc: {
                        vi: 'Các làn điệu hò khoan đối đáp và biểu diễn hát bội (tuồng) truyền thống phục vụ bà con.',
                        en: 'Call-and-response folk singing and traditional Tuong performances for the community.'
                    }
                },
                {
                    icon: <Flag className="w-8 h-8 text-red-500" />,
                    title: { vi: 'Rước Kiệu', en: 'Procession' },
                    desc: {
                        vi: 'Đám rước kiệu thần đi quanh làng với cờ xí rợp trời, chiêng trống vang lừng.',
                        en: 'Procession of the deity palanquin around the village with flags and resounding drums.'
                    }
                }
            ]
        },
        gallery: {
            title: { vi: 'Thư Viện Ảnh', en: 'Photo Gallery' },
            items: [
                '/images/destinations/le-hoi-cau-ngu-1.jpg',
                '/images/destinations/le-hoi-cau-ngu-2.jpg',
                '/images/destinations/le-hoi-cau-ngu-3.jpg',
                '/images/destinations/le-hoi-cau-ngu-4.jpg',
                '/images/destinations/le-hoi-cau-ngu-5.jpg',
                '/images/destinations/le-hoi-cau-ngu-6.jpg',
            ]
        },
        info: {
            title: { vi: 'Thông Tin Tham Gia', en: 'Information' },
            time: { label: { vi: 'Thời gian:', en: 'Time:' }, value: { vi: 'Tháng 2 - Tháng 3 Âm lịch', en: 'Lunar February - March' } },
            location: { label: { vi: 'Địa điểm:', en: 'Location:' }, value: { vi: 'Làng Phương Diên, Xã Phú Vinh', en: 'Phuong Dien Village, Phu Vinh Commune' } },
            ticket: { label: { vi: 'Vé tham quan:', en: 'Ticket:' }, value: { vi: 'Miễn phí', en: 'Free' } },
            tips: {
                vi: 'Nên đến sớm vào buổi sáng khai mạc để xem lễ rước và đua ghe nan. Trang phục lịch sự khi vào khu vực tế lễ.',
                en: 'Arrive early on the opening morning to watch the procession and bamboo boat racing. Dress modestly when entering worship areas.'
            }
        }
    };

    const openDirections = () => {
        window.open(`https://www.google.com/maps/dir/?api=1&destination=16.4925034,107.7495569`, '_blank');
    };

    return (
        <div className="min-h-screen pt-14 pb-20">
            {/* Hero Section */}
            <div className="relative h-[60vh] md:h-[70vh] flex items-center justify-center overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center z-0"
                    style={{ backgroundImage: `url('/images/destinations/le-hoi-cau-ngu-1.jpg')` }}
                >
                    <div className="absolute inset-0 bg-black/40 bg-gradient-to-t from-background to-transparent" />
                </div>

                <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-20">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <Badge className="mb-4 bg-primary/80 hover:bg-primary backdrop-blur-sm text-lg px-4 py-1.5 border-none">
                            {content.hero.badge[lang]}
                        </Badge>
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 drop-shadow-lg">
                            {content.hero.title[lang]}
                        </h1>
                        <p className="text-lg md:text-2xl text-white/90 font-medium max-w-2xl mx-auto drop-shadow-md">
                            {content.hero.subtitle[lang]}
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Video Section */}
            <div className="max-w-6xl mx-auto px-4 -mt-20 relative z-20 mb-16">
                 <div className="rounded-2xl overflow-hidden shadow-2xl border border-border/50 bg-black aspect-video relative group">
                    <video 
                        src="/video/LeCauNgu.mp4" 
                        controls 
                        className="w-full h-full object-cover rounded-2xl"
                        poster="/images/destinations/le-hoi-cau-ngu-1.jpg"
                    />
                 </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 relative z-20">
                {/* Intro Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-card shadow-xl rounded-2xl p-8 md:p-12 mb-16 border border-border/50"
                >
                    <div className="grid md:grid-cols-2 gap-10 items-center">
                        <div className="space-y-6">
                            <h2 className="text-3xl font-bold text-primary">{content.intro.title[lang]}</h2>
                            <p className="text-lg leading-relaxed text-muted-foreground">
                                {content.intro.description[lang]}
                            </p>
                            <div className="bg-muted/50 p-4 rounded-xl border-l-4 border-primary">
                                <p className="italic text-muted-foreground">
                                    &quot;{content.intro.history[lang]}&quot;
                                </p>
                            </div>
                        </div>
                        <div className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-lg group">
                            <ImagePreview
                                src="/images/destinations/le-hoi-cau-ngu-2.jpg"
                                alt="Lễ hội Đua Ghe Nan"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                        </div>
                    </div>
                </motion.div>

                {/* Activities Grid */}
                <div className="mb-20">
                    <h2 className="text-3xl font-bold text-center mb-10">{content.activities.title[lang]}</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {content.activities.items.map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-card/50 backdrop-blur border border-border/50 p-6 rounded-xl hover:shadow-lg transition-all hover:-translate-y-1"
                            >
                                <div className="mb-4 bg-background w-16 h-16 rounded-full flex items-center justify-center shadow-sm">
                                    {item.icon}
                                </div>
                                <h3 className="text-xl font-bold mb-3">{item.title[lang]}</h3>
                                <p className="text-muted-foreground text-sm leading-relaxed">
                                    {item.desc[lang]}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Gallery */}
                <div className="mb-20">
                    <h2 className="text-3xl font-bold text-center mb-10 flex items-center justify-center gap-3">
                        <ImageIcon className="w-8 h-8" />
                        {content.gallery.title[lang]}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[400px] md:h-[500px]">
                        <div className="md:col-span-2 h-full rounded-2xl overflow-hidden relative group">
                            <ImagePreview
                                src={content.gallery.items[0]}
                                alt="Festival Main"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                                <p className="text-white font-medium">{content.activities.items[0].title[lang]}</p>
                            </div>
                        </div>
                        <div className="h-full flex flex-col gap-4">
                            {content.gallery.items.slice(1, 3).map((img, idx) => (
                                <div key={idx} className="flex-1 rounded-2xl overflow-hidden relative group">
                                    <ImagePreview
                                        src={img}
                                        alt={`Festival ${idx + 1}`}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Information & Map */}
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="md:col-span-1 bg-primary/5 border border-primary/20 rounded-2xl p-8">
                        <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                            <Info className="w-6 h-6 text-primary" />
                            {content.info.title[lang]}
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <Clock className="w-5 h-5 text-primary mt-0.5" />
                                <div>
                                    <p className="font-medium">{content.info.time.label[lang]}</p>
                                    <p className="text-muted-foreground">{content.info.time.value[lang]}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-primary mt-0.5" />
                                <div>
                                    <p className="font-medium">{content.info.location.label[lang]}</p>
                                    <p className="text-muted-foreground">{content.info.location.value[lang]}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Flag className="w-5 h-5 text-primary mt-0.5" />
                                <div>
                                    <p className="font-medium">{content.info.ticket.label[lang]}</p>
                                    <p className="text-muted-foreground">{content.info.ticket.value[lang]}</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-primary/10">
                            <p className="text-sm italic text-muted-foreground mb-4">
                                &quot;{content.info.tips[lang]}&quot;
                            </p>
                            <Button className="w-full" onClick={openDirections}>
                                <Navigation className="w-4 h-4 mr-2" />
                                {lang === 'vi' ? 'Chỉ đường' : 'Get Directions'}
                            </Button>
                        </div>
                    </div>

                    {/* Map Iframe */}
                    <div className="md:col-span-2 rounded-2xl overflow-hidden border border-primary/20 shadow-lg min-h-[300px]">
                        <iframe
                            src={`https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d2000!2d107.7495569!3d16.4925034!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1s${lang}!2svn!4v1`}
                            width="100%"
                            height="100%"
                            style={{ border: 0, minHeight: '100%' }}
                            allowFullScreen
                            loading="lazy"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

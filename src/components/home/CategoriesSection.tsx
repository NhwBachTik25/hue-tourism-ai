'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, UtensilsCrossed, Palette, PartyPopper, ArrowRight } from 'lucide-react';

const categories = [
    {
        icon: MapPin,
        title: 'Điểm đến',
        description: 'Đại Nội, lăng tẩm, chùa chiền và cảnh quan thiên nhiên',
        href: '/destinations',
        color: 'from-emerald-500 to-teal-600',
    },
    {
        icon: UtensilsCrossed,
        title: 'Ẩm thực',
        description: 'Bún bò, bánh bèo, cơm hến và nhiều món đặc sản',
        href: '/food',
        color: 'from-orange-500 to-red-500',
    },
    {
        icon: Palette,
        title: 'Nghề truyền thống',
        description: 'Nón lá, đúc đồng, gốm sứ và thêu thùa',
        href: '/crafts',
        color: 'from-purple-500 to-pink-500',
    },
    {
        icon: PartyPopper,
        title: 'Lễ hội',
        description: 'Festival Huế, ca Huế và các lễ hội truyền thống',
        href: '/festivals',
        color: 'from-amber-500 to-yellow-500',
    },
];

export function CategoriesSection() {
    return (
        <section className="py-16 px-4">
            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Khám phá <span className="gradient-text">Huế</span>
                    </h2>
                    <p className="text-muted-foreground max-w-xl mx-auto">
                        Trải nghiệm vẻ đẹp văn hóa, lịch sử và ẩm thực của cố đô Huế
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {categories.map((cat, index) => (
                        <motion.div
                            key={cat.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Link href={cat.href}>
                                <Card className="group bg-card/50 border-border/50 hover:bg-card transition-all duration-300 h-full card-hover">
                                    <CardContent className="p-6">
                                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                            <cat.icon className="w-7 h-7 text-white" />
                                        </div>
                                        <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                                            {cat.title}
                                        </h3>
                                        <p className="text-sm text-muted-foreground mb-4">
                                            {cat.description}
                                        </p>
                                        <div className="flex items-center text-primary text-sm font-medium">
                                            Khám phá
                                            <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

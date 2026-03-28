'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, MapPin } from 'lucide-react';

export function HeroSection() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <section className="relative min-h-[85vh] flex items-center justify-center hero-gradient pt-14 overflow-hidden">
            {/* Animated Background Elements - only render after mount */}
            {mounted && (
                <div className="absolute inset-0 overflow-hidden">
                    <motion.div
                        className="absolute top-20 left-10 w-64 h-64 rounded-full bg-primary/10 blur-3xl"
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.3, 0.5, 0.3],
                        }}
                        transition={{ duration: 8, repeat: Infinity }}
                    />
                    <motion.div
                        className="absolute bottom-20 right-10 w-72 h-72 rounded-full bg-accent/10 blur-3xl"
                        animate={{
                            scale: [1, 1.3, 1],
                            opacity: [0.2, 0.4, 0.2],
                        }}
                        transition={{ duration: 10, repeat: Infinity, delay: 1 }}
                    />
                </div>
            )}

            <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
                {mounted ? (
                    <>
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="inline-flex items-center gap-2 bg-primary/20 rounded-full px-4 py-2 mb-6">
                                <MapPin className="w-4 h-4 text-primary" />
                                <span className="text-sm font-medium text-primary">Di sản Văn hóa Thế giới</span>
                            </div>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.1 }}
                            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6"
                        >
                            Khám phá{' '}
                            <span className="gradient-text">Huế</span>
                            <br />
                            Cùng AI
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl mx-auto"
                        >
                            Trải nghiệm du lịch thông minh với hướng dẫn viên AI -
                            khám phá văn hóa, ẩm thực và di sản cố đô Huế
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            className="flex flex-col sm:flex-row gap-4 justify-center"
                        >
                            <Link href="/destinations">
                                <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg w-full sm:w-auto">
                                    Bắt đầu khám phá
                                    <ArrowRight className="ml-2 w-5 h-5" />
                                </Button>
                            </Link>
                            <Link href="/food">
                                <Button size="lg" variant="outline" className="text-lg w-full sm:w-auto border-primary/50 hover:bg-primary/10">
                                    Ẩm thực Huế
                                </Button>
                            </Link>
                        </motion.div>

                        {/* Stats */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="grid grid-cols-3 gap-4 mt-12 max-w-lg mx-auto"
                        >
                            {[
                                { value: '7+', label: 'Di sản UNESCO' },
                                { value: '20+', label: 'Món đặc sản' },
                                { value: '10+', label: 'Làng nghề' },
                            ].map((stat, i) => (
                                <div key={i} className="text-center">
                                    <div className="text-2xl md:text-3xl font-bold gradient-text">{stat.value}</div>
                                    <div className="text-xs md:text-sm text-muted-foreground">{stat.label}</div>
                                </div>
                            ))}
                        </motion.div>
                    </>
                ) : (
                    // SSR fallback without animations
                    <>
                        <div className="inline-flex items-center gap-2 bg-primary/20 rounded-full px-4 py-2 mb-6">
                            <MapPin className="w-4 h-4 text-primary" />
                            <span className="text-sm font-medium text-primary">Di sản Văn hóa Thế giới</span>
                        </div>

                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
                            Khám phá{' '}
                            <span className="gradient-text">Huế</span>
                            <br />
                            Cùng AI
                        </h1>

                        <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl mx-auto">
                            Trải nghiệm du lịch thông minh với hướng dẫn viên AI -
                            khám phá văn hóa, ẩm thực và di sản cố đô Huế
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/destinations">
                                <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg w-full sm:w-auto">
                                    Bắt đầu khám phá
                                    <ArrowRight className="ml-2 w-5 h-5" />
                                </Button>
                            </Link>
                            <Link href="/food">
                                <Button size="lg" variant="outline" className="text-lg w-full sm:w-auto border-primary/50 hover:bg-primary/10">
                                    Ẩm thực Huế
                                </Button>
                            </Link>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mt-12 max-w-lg mx-auto">
                            {[
                                { value: '7+', label: 'Di sản UNESCO' },
                                { value: '20+', label: 'Món đặc sản' },
                                { value: '10+', label: 'Làng nghề' },
                            ].map((stat, i) => (
                                <div key={i} className="text-center">
                                    <div className="text-2xl md:text-3xl font-bold gradient-text">{stat.value}</div>
                                    <div className="text-xs md:text-sm text-muted-foreground">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Scroll Indicator - only render after mount */}
            {mounted && (
                <motion.div
                    className="absolute bottom-8 left-1/2 -translate-x-1/2"
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/50 flex items-start justify-center p-1">
                        <motion.div
                            className="w-1.5 h-3 bg-muted-foreground/50 rounded-full"
                            animate={{ y: [0, 12, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        />
                    </div>
                </motion.div>
            )}
        </section>
    );
}

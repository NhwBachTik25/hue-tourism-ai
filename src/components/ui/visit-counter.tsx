'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Users, TrendingUp, Clock } from 'lucide-react';
import { useLanguage } from '@/components/providers/language-provider';

interface VisitStats {
    totalVisits: number;
    todayVisits: number;
    lastVisit: string;
    currentOnline: number;
}

const content = {
    title: { vi: 'Thống kê truy cập', en: 'Visit Statistics' },
    total: { vi: 'Tổng lượt xem', en: 'Total Views' },
    today: { vi: 'Hôm nay', en: 'Today' },
    online: { vi: 'Đang online', en: 'Online Now' },
    lastVisit: { vi: 'Lần truy cập cuối', en: 'Last Visit' },
};

export function VisitCounter() {
    const [stats, setStats] = useState<VisitStats>({
        totalVisits: 0,
        todayVisits: 0,
        lastVisit: '',
        currentOnline: 1
    });
    const [mounted, setMounted] = useState(false);
    const { language } = useLanguage();
    const lang = language as 'vi' | 'en';

    useEffect(() => {
        setMounted(true);

        // Get stored stats
        const storedStats = localStorage.getItem('phu-vinh-visit-stats');
        const today = new Date().toDateString();

        let newStats: VisitStats;

        if (storedStats) {
            const parsed = JSON.parse(storedStats);
            const lastVisitDate = new Date(parsed.lastVisit).toDateString();

            newStats = {
                totalVisits: parsed.totalVisits + 1,
                todayVisits: lastVisitDate === today ? parsed.todayVisits + 1 : 1,
                lastVisit: new Date().toISOString(),
                currentOnline: Math.floor(Math.random() * 5) + 1 // Simulate online users
            };
        } else {
            newStats = {
                totalVisits: 1,
                todayVisits: 1,
                lastVisit: new Date().toISOString(),
                currentOnline: Math.floor(Math.random() * 5) + 1
            };
        }

        setStats(newStats);
        localStorage.setItem('phu-vinh-visit-stats', JSON.stringify(newStats));

        // Simulate real-time online counter updates
        const interval = setInterval(() => {
            setStats(prev => ({
                ...prev,
                currentOnline: Math.max(1, prev.currentOnline + (Math.random() > 0.5 ? 1 : -1))
            }));
        }, 10000);

        return () => clearInterval(interval);
    }, []);

    const formatLastVisit = (dateStr: string) => {
        if (!dateStr) return '-';
        const date = new Date(dateStr);
        return date.toLocaleString(language === 'vi' ? 'vi-VN' : 'en-US', {
            dateStyle: 'short',
            timeStyle: 'short'
        });
    };

    if (!mounted) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-xl p-4"
        >
            <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-400" />
                {content.title[lang]}
            </h3>

            <div className="grid grid-cols-2 gap-3">
                {/* Total Visits */}
                <div className="bg-blue-500/10 rounded-lg p-3 text-center">
                    <Eye className="w-4 h-4 mx-auto mb-1 text-blue-400" />
                    <div className="text-xl font-bold text-blue-400">
                        {stats.totalVisits.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground">{content.total[lang]}</div>
                </div>

                {/* Today */}
                <div className="bg-green-500/10 rounded-lg p-3 text-center">
                    <Clock className="w-4 h-4 mx-auto mb-1 text-green-400" />
                    <div className="text-xl font-bold text-green-400">
                        {stats.todayVisits.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground">{content.today[lang]}</div>
                </div>

                {/* Online Now */}
                <div className="bg-amber-500/10 rounded-lg p-3 text-center col-span-2">
                    <div className="flex items-center justify-center gap-2">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        <Users className="w-4 h-4 text-amber-400" />
                        <span className="font-bold text-amber-400">{stats.currentOnline}</span>
                        <span className="text-xs text-muted-foreground">{content.online[lang]}</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

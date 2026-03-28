'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Home, MapPin, Utensils, Palette, Calendar, Map,
    MessageCircle, ChevronLeft, ChevronRight, Sparkles,
    GraduationCap, Move3d, Route
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/components/providers/language-provider';
import { cn } from '@/lib/utils';

const navGroups = [
    {
        labelVi: 'Khám phá',
        labelEn: 'Explore',
        items: [
            { href: '/', icon: Home, labelVi: 'Trang chủ', labelEn: 'Home' },
            { href: '/destinations', icon: MapPin, labelVi: 'Điểm đến', labelEn: 'Destinations' },
            // { href: '/map', icon: Map, labelVi: 'Bản đồ', labelEn: 'Map' },
            { href: '/explore-3d', icon: Move3d, labelVi: 'Khám phá 3D', labelEn: 'Explore 3D' },
        ]
    },
    {
        labelVi: 'Văn hóa & Di sản',
        labelEn: 'Culture & Heritage',
        items: [
            { href: '/heritage', icon: Sparkles, labelVi: 'Di sản', labelEn: 'Heritage' },
            // { href: '/food', icon: Utensils, labelVi: 'Ẩm thực', labelEn: 'Food' },
            // { href: '/crafts', icon: Palette, labelVi: 'Làng nghề', labelEn: 'Crafts' },
            { href: '/festivals', icon: Calendar, labelVi: 'Lễ hội', labelEn: 'Festivals' },
        ]
    },
    {
        labelVi: 'Trải nghiệm',
        labelEn: 'Experiences',
        items: [
            { href: '/trip-planner', icon: Route, labelVi: 'Lên lịch trình', labelEn: 'Trip Planner' },
            { href: '/learning', icon: GraduationCap, labelVi: 'Góc học tập', labelEn: 'Learning' },
            { href: '/stories', icon: MessageCircle, labelVi: 'Câu chuyện AI', labelEn: 'AI Stories' },
        ]
    }
];

export function Sidebar() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const pathname = usePathname();
    const { language } = useLanguage();

    return (
        <motion.aside
            initial={false}
            animate={{ width: isCollapsed ? 72 : 240 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className={cn(
                "fixed left-0 top-0 h-screen bg-card/80 backdrop-blur-xl border-r border-border/50 z-40",
                "flex flex-col py-4 shadow-xl"
            )}
        >
            {/* Logo */}
            <div className="px-4 mb-6">
                <Link href="/" className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shrink-0">
                        <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <AnimatePresence>
                        {!isCollapsed && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                className="flex flex-col"
                            >
                                <span className="font-bold text-sm">Phú Vinh</span>
                                <span className="text-xs text-muted-foreground">Heritage</span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-2 space-y-4 overflow-y-auto [&::-webkit-scrollbar]:hidden pb-4">
                {navGroups.map((group, groupIndex) => (
                    <div key={groupIndex} className="space-y-1">
                        {/* Group Header */}
                        {(!isCollapsed) && (
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="px-3 text-[11px] font-semibold text-muted-foreground/70 uppercase tracking-widest mt-4 mb-2"
                            >
                                {language === 'vi' ? group.labelVi : group.labelEn}
                            </motion.div>
                        )}
                        {(isCollapsed && groupIndex > 0) && (
                            <div className="h-px bg-border/50 mx-4 my-3" />
                        )}

                        {group.items.map((item) => {
                            const isActive = pathname === item.href;
                            const Icon = item.icon;
                            const label = language === 'vi' ? item.labelVi : item.labelEn;

                            return (
                                <Link key={item.href} href={item.href}>
                                    <motion.div
                                        whileHover={{ x: 4 }}
                                        whileTap={{ scale: 0.98 }}
                                        className={cn(
                                            "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all relative group",
                                            "hover:bg-primary/10",
                                            isActive
                                                ? "bg-primary/15 text-primary font-medium shadow-sm"
                                                : "text-muted-foreground hover:text-foreground"
                                        )}
                                        title={isCollapsed ? label : undefined}
                                    >
                                        <Icon className={cn("w-5 h-5 shrink-0 transition-colors", isActive && "text-primary")} />
                                        <AnimatePresence>
                                            {!isCollapsed && (
                                                <motion.span
                                                    initial={{ opacity: 0, width: 0 }}
                                                    animate={{ opacity: 1, width: 'auto' }}
                                                    exit={{ opacity: 0, width: 0 }}
                                                    className="text-sm border-none overflow-hidden whitespace-nowrap"
                                                >
                                                    {label}
                                                </motion.span>
                                            )}
                                        </AnimatePresence>
                                        {isActive && (
                                            <motion.div
                                                layoutId="activeIndicator"
                                                className="absolute left-0 w-1 h-8 bg-primary rounded-r-full"
                                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                            />
                                        )}
                                    </motion.div>
                                </Link>
                            );
                        })}
                    </div>
                ))}
            </nav>

            {/* Collapse Toggle */}
            <div className="px-2 pt-4 border-t border-border/50">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="w-full justify-center"
                >
                    {isCollapsed ? (
                        <ChevronRight className="w-4 h-4" />
                    ) : (
                        <>
                            <ChevronLeft className="w-4 h-4 mr-2" />
                            <span className="text-xs">{language === 'vi' ? 'Thu gọn' : 'Collapse'}</span>
                        </>
                    )}
                </Button>
            </div>
        </motion.aside>
    );
}

// Export sidebar width for layout calculations
export const SIDEBAR_WIDTH = 240;
export const SIDEBAR_COLLAPSED_WIDTH = 72;

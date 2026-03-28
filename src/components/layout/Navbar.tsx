'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon, Globe } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useLanguage } from '@/components/providers/language-provider';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const navItems = [
    { href: '/', labelVi: 'Trang chủ', labelEn: 'Home' },
    { href: '/heritage', labelVi: 'Di sản', labelEn: 'Heritage' },
    { href: '/festivals', labelVi: 'Lễ hội', labelEn: 'Festivals' },
    { href: '/explore-3d', labelVi: 'Khám phá 3D', labelEn: 'Explore 3D' },
    { href: '/destinations', labelVi: 'Điểm đến', labelEn: 'Destinations' },
    { href: '/learning', labelVi: 'Học tập', labelEn: 'Learning' },
    { href: '/stories', labelVi: 'Câu chuyện AI', labelEn: 'AI Stories' },
];

export function Navbar() {
    const [mounted, setMounted] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { theme, setTheme } = useTheme();
    const { language, toggleLanguage } = useLanguage();
    const pathname = usePathname();

    useEffect(() => {
        setMounted(true);
        const handler = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handler);
        return () => window.removeEventListener('scroll', handler);
    }, []);

    const isActive = (href: string) => {
        if (href === '/') return pathname === '/';
        return pathname.startsWith(href);
    };

    return (
        <header
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
                scrolled
                    ? "bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-md"
                    : "bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm"
            )}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-3 shrink-0">
                    <div className="w-10 h-10 rounded-full bg-[#2d5a57] flex items-center justify-center shadow-md">
                        <span className="text-white font-bold text-sm">PV</span>
                    </div>
                    <div className="hidden sm:flex flex-col">
                        <span className="font-bold text-[#2d5a57] dark:text-emerald-400 text-sm leading-tight">
                            {language === 'vi' ? 'Bộ học liệu di sản văn hóa xã Phú Vinh' : 'Phu Vinh Cultural Heritage Learning'}
                        </span>
                        <span className="text-xs text-[#5a8a87] dark:text-emerald-500/70 leading-tight">
                            {language === 'vi' ? 'Học để hiểu – trải nghiệm để yêu – gìn giữ để lan tỏa' : 'Learn to understand – experience to love – preserve to spread'}
                        </span>
                    </div>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden lg:flex items-center gap-1">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                                isActive(item.href)
                                    ? "bg-[#2d5a57]/15 text-[#2d5a57] dark:bg-emerald-500/20 dark:text-emerald-400"
                                    : "text-[#2d5a57] dark:text-gray-300 hover:bg-[#2d5a57]/10 dark:hover:bg-gray-700"
                            )}
                        >
                            {language === 'vi' ? item.labelVi : item.labelEn}
                        </Link>
                    ))}

                    {/* Divider */}
                    <div className="h-6 w-px bg-gray-300 dark:bg-gray-600 mx-1" />

                    {/* Language Toggle */}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleLanguage}
                        className="h-9 w-9 text-[#2d5a57] dark:text-gray-300"
                        title={language === 'vi' ? 'Switch to English' : 'Chuyển sang Tiếng Việt'}
                    >
                        <Globe className="w-4 h-4" />
                        <span className="sr-only">Toggle language</span>
                    </Button>

                    {/* Theme Toggle */}
                    {mounted && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                            className="h-9 w-9 text-[#2d5a57] dark:text-gray-300"
                            title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
                        >
                            <AnimatePresence mode="wait">
                                {theme === 'dark' ? (
                                    <motion.div
                                        key="moon"
                                        initial={{ rotate: -90, opacity: 0 }}
                                        animate={{ rotate: 0, opacity: 1 }}
                                        exit={{ rotate: 90, opacity: 0 }}
                                    >
                                        <Moon className="w-4 h-4" />
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="sun"
                                        initial={{ rotate: 90, opacity: 0 }}
                                        animate={{ rotate: 0, opacity: 1 }}
                                        exit={{ rotate: -90, opacity: 0 }}
                                    >
                                        <Sun className="w-4 h-4" />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </Button>
                    )}
                </nav>

                {/* Mobile: toggles + menu button */}
                <div className="lg:hidden flex items-center gap-1">
                    <Button variant="ghost" size="icon" onClick={toggleLanguage} className="h-9 w-9 text-[#2d5a57] dark:text-gray-300">
                        <Globe className="w-4 h-4" />
                    </Button>
                    {mounted && (
                        <Button variant="ghost" size="icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="h-9 w-9 text-[#2d5a57] dark:text-gray-300">
                            {theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                        </Button>
                    )}
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="p-2 rounded-lg hover:bg-[#2d5a57]/10 dark:hover:bg-gray-700 text-[#2d5a57] dark:text-gray-300"
                    >
                        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.nav
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="lg:hidden bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-700 overflow-hidden"
                    >
                        <div className="px-4 py-3 space-y-1">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setMobileOpen(false)}
                                    className={cn(
                                        "block px-3 py-2.5 text-sm font-medium rounded-lg transition-colors",
                                        isActive(item.href)
                                            ? "bg-[#2d5a57]/15 text-[#2d5a57] dark:bg-emerald-500/20 dark:text-emerald-400"
                                            : "text-[#2d5a57] dark:text-gray-300 hover:bg-[#2d5a57]/10 dark:hover:bg-gray-700"
                                    )}
                                >
                                    {language === 'vi' ? item.labelVi : item.labelEn}
                                </Link>
                            ))}
                        </div>
                    </motion.nav>
                )}
            </AnimatePresence>
        </header>
    );
}

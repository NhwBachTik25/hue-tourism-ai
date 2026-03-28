'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Map, BookOpen, Sun, Moon, Globe, Menu, X, Compass, Camera } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useLanguage } from '@/components/providers/language-provider';
// Auth disabled
// import { useAuth } from '@/components/providers/auth-provider';
import { Button } from '@/components/ui/button';

export function Header() {
    const [mounted, setMounted] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const pathname = usePathname();
    const { theme, setTheme } = useTheme();
    const { language, toggleLanguage, t } = useLanguage();
    // Auth disabled
    // const { user, isAuthenticated, logout } = useAuth();
    const lang = language as 'vi' | 'en';

    useEffect(() => {
        setMounted(true);
    }, []);

    // Auth disabled - handleLogout removed

    const isActive = (href: string) => {
        if (href === '/') return pathname === '/';
        return pathname.startsWith(href);
    };

    const navLinks = [
        { href: '/', label: t('nav.intro') },
        { href: '/heritage', label: t('nav.heritage') },
        { href: '/crafts', label: t('nav.crafts') },
        { href: '/destinations', label: t('nav.destinations') },
        { href: '/food', label: t('nav.food') },
    ];

    const secondaryLinks = [
        { href: '/explore-3d', label: lang === 'vi' ? 'Khám phá 3D' : '3D Explore', icon: Compass },
        { href: '/contribute', label: lang === 'vi' ? 'Đóng góp' : 'Contribute', icon: Camera },
        { href: '/trip-planner', label: t('nav.tripPlanner'), icon: Map },
        { href: '/learning', label: t('nav.learning'), icon: BookOpen },
    ];

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-50 glass">
            <div className="flex items-center justify-between h-14 px-4 max-w-7xl mx-auto">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    {mounted ? (
                        <motion.div
                            className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <span className="text-lg font-bold text-white">🌊</span>
                        </motion.div>
                    ) : (
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
                            <span className="text-lg font-bold text-white">🌊</span>
                        </div>
                    )}
                    <div className="flex flex-col">
                        <span className="text-sm font-bold gradient-text">{t('brand.name')}</span>
                        <span className="text-[10px] text-muted-foreground">{t('brand.tagline')}</span>
                    </div>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden lg:flex items-center gap-5">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`text-sm transition-colors ${isActive(link.href) && (link.href === '/' ? pathname === '/' : true)
                                ? 'text-primary font-medium'
                                : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            {link.label}
                        </Link>
                    ))}

                    <div className="w-px h-4 bg-border" />

                    {secondaryLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`flex items-center gap-1.5 text-sm transition-colors ${isActive(link.href)
                                ? 'text-primary font-medium'
                                : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            <link.icon className="w-3.5 h-3.5" />
                            {link.label}
                        </Link>
                    ))}
                </nav>

                {/* Right Controls */}
                <div className="flex items-center gap-2">
                    {/* Language Toggle */}
                    {mounted && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={toggleLanguage}
                            className="h-8 px-2 gap-1.5"
                            title={language === 'vi' ? 'Switch to English' : 'Chuyển sang Tiếng Việt'}
                        >
                            <Globe className="w-4 h-4" />
                            <span className="text-xs font-medium uppercase">{language}</span>
                        </Button>
                    )}

                    {/* Theme Toggle */}
                    {mounted && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={toggleTheme}
                            className="h-8 w-8"
                            title={theme === 'dark' ? t('theme.light') : t('theme.dark')}
                        >
                            <AnimatePresence mode="wait">
                                {theme === 'dark' ? (
                                    <motion.div
                                        key="sun"
                                        initial={{ opacity: 0, rotate: -90 }}
                                        animate={{ opacity: 1, rotate: 0 }}
                                        exit={{ opacity: 0, rotate: 90 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <Sun className="w-4 h-4" />
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="moon"
                                        initial={{ opacity: 0, rotate: 90 }}
                                        animate={{ opacity: 1, rotate: 0 }}
                                        exit={{ opacity: 0, rotate: -90 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <Moon className="w-4 h-4" />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </Button>
                    )}

                    {/* Auth UI removed - login/signup buttons disabled */}

                    {/* Mobile Menu Button */}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="lg:hidden h-8 w-8"
                    >
                        {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                    </Button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="lg:hidden border-t border-border/50 bg-background/95 backdrop-blur-xl"
                    >
                        <nav className="p-4 space-y-2">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`block py-2 px-3 rounded-lg transition-colors ${isActive(link.href)
                                        ? 'bg-primary/10 text-primary font-medium'
                                        : 'text-foreground hover:bg-muted'
                                        }`}
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <div className="border-t border-border/50 my-2" />
                            {secondaryLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`flex items-center gap-2 py-2 px-3 rounded-lg transition-colors ${isActive(link.href)
                                        ? 'bg-primary/10 text-primary font-medium'
                                        : 'text-foreground hover:bg-muted'
                                        }`}
                                >
                                    <link.icon className="w-4 h-4" />
                                    {link.label}
                                </Link>
                            ))}

                            {/* Auth UI removed - mobile login/signup/logout disabled */}
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}

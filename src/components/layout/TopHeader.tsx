'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import { Search, Globe, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/components/providers/language-provider';

export function TopHeader() {
    const [mounted, setMounted] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const { theme, setTheme } = useTheme();
    const { language, toggleLanguage } = useLanguage();

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            console.log('Search:', searchQuery);
        }
    };

    return (
        <header className="fixed top-0 right-0 left-0 md:left-[240px] h-16 bg-card/80 backdrop-blur-xl border-b border-border/50 z-30 transition-all duration-300">
            <div className="h-full px-4 md:px-6 flex items-center justify-between gap-4">
                {/* Search Bar */}
                <form onSubmit={handleSearch} className="flex-1 max-w-md">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder={language === 'vi' ? 'Tìm kiếm...' : 'Search...'}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 bg-muted/50 border-0 focus-visible:ring-1"
                        />
                    </div>
                </form>

                {/* Right side utilities */}
                <div className="flex items-center gap-2">
                    {/* Language Toggle */}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleLanguage}
                        className="h-9 w-9"
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
                            className="h-9 w-9"
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

                    {/* Auth UI removed - login/admin/profile buttons disabled */}
                </div>
            </div>
        </header>
    );
}

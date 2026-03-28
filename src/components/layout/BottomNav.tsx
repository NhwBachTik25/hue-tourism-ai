'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    Home,
    MapPin,
    Landmark,
    Compass,
    Camera,
} from 'lucide-react';

const navItems = [
    { href: '/', icon: Home, label: 'Trang chủ' },
    { href: '/heritage', icon: Landmark, label: 'Di sản' },
    { href: '/explore-3d', icon: Compass, label: '3D Map' },
    { href: '/destinations', icon: MapPin, label: 'Điểm đến' },
    { href: '/contribute', icon: Camera, label: 'Đóng góp' },
];

export function BottomNav() {
    const [mounted, setMounted] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-border/50 pb-[env(safe-area-inset-bottom)] md:hidden">
                <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <div
                                key={item.href}
                                className="relative flex flex-col items-center justify-center w-16 h-full"
                            >
                                <div className="flex flex-col items-center justify-center p-2 rounded-xl text-muted-foreground">
                                    <Icon className="w-5 h-5" />
                                    <span className="text-[10px] mt-1 font-medium truncate max-w-[56px]">
                                        {item.label}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </nav>
        );
    }

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-border/50 pb-[env(safe-area-inset-bottom)] md:hidden">
            <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href ||
                        (item.href !== '/' && pathname.startsWith(item.href));
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="relative flex flex-col items-center justify-center w-16 h-full group"
                            aria-label={item.label}
                        >
                            <motion.div
                                className={`relative flex flex-col items-center justify-center p-2 rounded-xl transition-colors ${isActive
                                    ? 'text-primary'
                                    : 'text-muted-foreground group-hover:text-foreground'
                                    }`}
                                whileTap={{ scale: 0.9 }}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="nav-indicator"
                                        className="absolute inset-0 bg-primary/20 rounded-xl"
                                        initial={false}
                                        transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                                    />
                                )}
                                <Icon className="w-5 h-5 relative z-10" />
                                <span className="text-[10px] mt-1 font-medium relative z-10 truncate max-w-[56px]">
                                    {item.label}
                                </span>
                            </motion.div>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}


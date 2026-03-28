'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

type Language = 'vi' | 'en';

interface Translations {
    [key: string]: {
        vi: string;
        en: string;
    };
}

// Centralized translations
export const translations: Translations = {
    // Header/Navigation
    'nav.home': { vi: 'Trang chủ', en: 'Home' },
    'nav.intro': { vi: 'Giới thiệu', en: 'About' },
    'nav.heritage': { vi: 'Di sản văn hóa', en: 'Cultural Heritage' },
    'nav.destinations': { vi: 'Địa điểm', en: 'Destinations' },
    'nav.crafts': { vi: 'Làng nghề', en: 'Crafts' },
    'nav.food': { vi: 'Ẩm thực', en: 'Food' },
    'nav.tripPlanner': { vi: 'Cẩm nang', en: 'Travel Guide' },
    'nav.map': { vi: 'Bản đồ', en: 'Map' },
    'nav.stories': { vi: 'Thuyết minh', en: 'Stories' },
    'nav.learning': { vi: 'Góc học tập', en: 'Learning Corner' },


    // Common
    'common.viewDetails': { vi: 'Xem chi tiết', en: 'View details' },
    'common.directions': { vi: 'Chỉ đường', en: 'Directions' },
    'common.close': { vi: 'Đóng', en: 'Close' },
    'common.askAI': { vi: 'Hỏi AI', en: 'Ask AI' },
    'common.learnMore': { vi: 'Tìm hiểu thêm', en: 'Learn more' },
    'common.suggestRoute': { vi: 'Gợi ý lộ trình', en: 'Suggest route' },
    'common.buyGuide': { vi: 'Hướng dẫn mua hàng', en: 'Buying guide' },

    // Destinations
    'destinations.title': { vi: 'Khám phá Phú Vinh', en: 'Explore Phu Vinh' },
    'destinations.subtitle': { vi: 'Những điểm đến tự nhiên và văn hóa đặc sắc tại xã Phú Vinh, thành phố Huế', en: 'Natural and cultural destinations in Phu Vinh commune, Hue city' },
    'destinations.badge': { vi: 'Địa điểm du lịch', en: 'Tourist Destinations' },
    'destinations.intro': { vi: 'Giới thiệu', en: 'Introduction' },
    'destinations.highlights': { vi: 'Điểm nổi bật', en: 'Highlights' },
    'destinations.tips': { vi: 'Mẹo du lịch', en: 'Travel tips' },
    'destinations.map': { vi: 'Bản đồ', en: 'Map' },

    // Crafts
    'crafts.title': { vi: 'Nghề truyền thống Phú Vinh', en: 'Traditional Crafts of Phu Vinh' },
    'crafts.subtitle': { vi: 'Khám phá các làng nghề truyền thống với sản phẩm đặc sản địa phương độc đáo', en: 'Discover traditional craft villages with unique local products' },
    'crafts.badge': { vi: 'Làng nghề truyền thống', en: 'Traditional Crafts' },
    'crafts.history': { vi: 'Lịch sử & Truyền thống', en: 'History & Tradition' },
    'crafts.process': { vi: 'Quy trình sản xuất', en: 'Production Process' },
    'crafts.products': { vi: 'Sản phẩm & Giá bán', en: 'Products & Prices' },
    'crafts.buyTips': { vi: 'Mẹo mua hàng', en: 'Buying Tips' },

    // Food
    'food.title': { vi: 'Ẩm thực Phú Vinh', en: 'Phu Vinh Cuisine' },
    'food.subtitle': { vi: 'Hải sản tươi sống và đặc sản địa phương', en: 'Fresh seafood and local specialties' },

    // Homepage
    'home.hero.title': { vi: 'Khám phá', en: 'Explore' },
    'home.hero.subtitle': { vi: 'Phú Vinh', en: 'Phu Vinh' },
    'home.hero.description': { vi: 'Trải nghiệm du lịch địa phương với AI hướng dẫn thông minh', en: 'Local tourism experience with smart AI guide' },
    'home.cta': { vi: 'Khám phá ngay', en: 'Explore now' },
    'home.chatCta': { vi: 'Chat với AI', en: 'Chat with AI' },

    // Chat
    'chat.placeholder': { vi: 'Hỏi về Phú Vinh...', en: 'Ask about Phu Vinh...' },
    'chat.send': { vi: 'Gửi', en: 'Send' },

    // Theme
    'theme.light': { vi: 'Sáng', en: 'Light' },
    'theme.dark': { vi: 'Tối', en: 'Dark' },
    'theme.system': { vi: 'Hệ thống', en: 'System' },

    // Branding
    'brand.name': { vi: 'Du lịch Phú Vinh', en: 'Phu Vinh Tourism' },
    'brand.tagline': { vi: 'Khám phá vẻ đẹp Phú Vinh', en: 'Discover Phu Vinh Beauty' },
};

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
    toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguageState] = useState<Language>('vi');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Load saved language from localStorage
        const saved = localStorage.getItem('phu-vinh-language') as Language;
        if (saved && (saved === 'vi' || saved === 'en')) {
            setLanguageState(saved);
        }
    }, []);

    const setLanguage = useCallback((lang: Language) => {
        setLanguageState(lang);
        localStorage.setItem('phu-vinh-language', lang);
        // Update html lang attribute
        document.documentElement.lang = lang;
    }, []);

    const toggleLanguage = useCallback(() => {
        setLanguage(language === 'vi' ? 'en' : 'vi');
    }, [language, setLanguage]);

    const t = useCallback((key: string): string => {
        const translation = translations[key];
        if (!translation) {
            console.warn(`Missing translation for key: ${key}`);
            return key;
        }
        return translation[language];
    }, [language]);

    // Prevent hydration mismatch
    if (!mounted) {
        return (
            <LanguageContext.Provider
                value={{
                    language: 'vi',
                    setLanguage: () => { },
                    t: (key) => translations[key]?.vi || key,
                    toggleLanguage: () => { },
                }}
            >
                {children}
            </LanguageContext.Provider>
        );
    }

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t, toggleLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}

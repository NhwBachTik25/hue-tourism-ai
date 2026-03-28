'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    BookOpen, Play, Pause, ChevronLeft, ChevronRight, X, MapPin, Camera,
    Map, Clock, Users, Sun, Sunset, Calendar, Sparkles, Navigation,
    Loader2, CheckCircle, Route
} from 'lucide-react';
import { useLanguage } from '@/components/providers/language-provider';
import { cn } from '@/lib/utils';

// ========== TAB LABELS ==========
const tabLabels = {
    stories: { vi: '📚 Câu chuyện', en: '📚 Stories' },
    planner: { vi: '🗺️ AI Lộ trình', en: '🗺️ AI Itinerary' },
};

// ========== STORIES CONTENT ==========
const storiesContent = {
    hero: {
        badge: { vi: 'Thuyết minh địa phương', en: 'Local Audio Guide' },
        title1: { vi: 'Câu chuyện ', en: 'Stories of ' },
        title2: { vi: 'Phú Vinh', en: 'Phu Vinh' },
        subtitle: { vi: 'Khám phá văn hóa và con người địa phương qua những câu chuyện thú vị', en: 'Discover local culture and people through fascinating stories' }
    },
    sections: {
        about: { vi: '📚 Về tính năng Thuyết minh', en: '📚 About Audio Guide Feature' },
        aboutDesc: { vi: 'Đây là tính năng thuyết minh số hóa, giúp du khách tìm hiểu về văn hóa và con người xã Phú Vinh một cách trực quan và sinh động.', en: 'This is a digital audio guide feature that helps visitors learn about the culture and people of Phu Vinh commune.' },
        badge: { vi: 'Câu chuyện văn hóa', en: 'Cultural Stories' },
        tagline: { vi: 'Ứng dụng công nghệ số trong quảng bá du lịch địa phương', en: 'Digital technology for local tourism promotion' },
        slides: { vi: 'trang', en: 'slides' },
        imageNote: { vi: 'Hình minh họa sẽ được cập nhật', en: 'Images will be updated' }
    }
};

const storiesData = [
    {
        id: 'bien-vinh-thanh',
        title: { vi: 'Biển Vinh Thanh', en: 'Vinh Thanh Beach' },
        description: { vi: 'Khám phá vẻ đẹp hoang sơ của bãi biển Vinh Thanh', en: 'Discover the pristine beauty of Vinh Thanh Beach' },
        location: { vi: 'Thôn Vinh Thanh', en: 'Vinh Thanh Village' },
        image: '/images/destinations/bien-vinh-thanh-1.jpg',
        slides: [
            { title: { vi: 'Biển Vinh Thanh - Vẻ đẹp hoang sơ', en: 'Vinh Thanh Beach - Pristine Beauty' }, content: { vi: 'Biển Vinh Thanh là một trong những bãi biển đẹp và yên bình thuộc xã Phú Vinh. Với bãi cát trắng mịn và nước biển trong xanh, đây là điểm đến lý tưởng cho những ai muốn trải nghiệm sự thanh bình của làng chài.', en: 'Vinh Thanh Beach is one of the most beautiful and peaceful beaches in Phu Vinh commune.' }, image: '/images/destinations/bien-vinh-thanh-1.jpg', fact: { vi: 'Biển Vinh Thanh nổi tiếng với bình minh tuyệt đẹp', en: 'Famous for its beautiful sunrise' } },
            { title: { vi: 'Cuộc sống làng chài', en: 'Fishing Village Life' }, content: { vi: 'Mỗi ngày, ngư dân nơi đây thức dậy từ sớm để ra khơi đánh bắt hải sản. Thuyền đánh cá truyền thống mang về tôm, cá, mực tươi ngon.', en: 'Every day, fishermen wake up early to go fishing. Traditional boats bring back fresh shrimp, fish, and squid.' }, image: '/images/destinations/bien-vinh-thanh-2.jpg', fact: { vi: 'Hải sản tươi sống bán ngay tại bến cá mỗi sáng', en: 'Fresh seafood sold at the fish market every morning' } },
            { title: { vi: 'Trải nghiệm du lịch', en: 'Tourism Experience' }, content: { vi: 'Du khách có thể tắm biển, ngắm bình minh, hoặc cùng ngư dân ra khơi để hiểu thêm về cuộc sống biển cả.', en: 'Visitors can swim, watch sunrise, or join fishermen to learn about sea life.' }, image: '/images/destinations/bien-vinh-thanh-4.jpg' },
        ]
    },
    {
        id: 'lang-an-bang',
        title: { vi: 'Làng An Bằng - Thành phố lăng mộ', en: 'An Bang - City of Tombs' },
        description: { vi: 'Tìm hiểu kiến trúc lăng mộ độc đáo của làng An Bằng', en: 'Learn about the unique tomb architecture' },
        location: { vi: 'Làng An Bằng', en: 'An Bang Village' },
        image: '/images/heritage/lang-mo-an-bang-1.jpg',
        slides: [
            { title: { vi: 'Thành phố của những lăng mộ', en: 'City of Tombs' }, content: { vi: 'Làng An Bằng được mệnh danh là "thành phố lăng mộ" với hàng nghìn ngôi mộ được xây dựng công phu.', en: 'An Bang Village is dubbed the "city of tombs" with thousands of elaborately built tombs.' }, image: '/images/heritage/lang-mo-an-bang-1.jpg', fact: { vi: 'Một số lăng mộ có giá trị hàng tỷ đồng', en: 'Some tombs are worth billions of VND' } },
            { title: { vi: 'Tín ngưỡng thờ cúng tổ tiên', en: 'Ancestor Worship' }, content: { vi: 'Người dân An Bằng có truyền thống xây lăng mộ đẹp để thể hiện lòng hiếu thảo với người đã khuất.', en: 'An Bang people have a tradition of building beautiful tombs to show filial piety.' }, image: '/images/heritage/lang-mo-an-bang-2.jpg' },
            { title: { vi: 'Điểm đến văn hóa', en: 'Cultural Destination' }, content: { vi: 'Ngày nay, làng An Bằng thu hút nhiều du khách trong và ngoài nước đến tham quan.', en: 'Today, An Bang Village attracts many visitors to explore this unique architecture.' }, image: '/images/heritage/lang-mo-an-bang-3.jpg', fact: { vi: 'Đã được nhiều báo chí quốc tế đưa tin', en: 'Featured by international media' } },
        ]
    },
    {
        id: 'nuoc-ot-vinh-xuan',
        title: { vi: 'Làng nghề nước ớt Vinh Xuân', en: 'Vinh Xuan Chili Sauce Craft' },
        description: { vi: 'Khám phá bí quyết làm nước ớt truyền thống', en: 'Discover secrets of traditional chili sauce making' },
        location: { vi: 'Thôn Vinh Xuân', en: 'Vinh Xuan Village' },
        image: '/images/destinations/bien-phu-dien-3.jpg',
        slides: [
            { title: { vi: 'Nghề làm nước ớt truyền thống', en: 'Traditional Chili Sauce Making' }, content: { vi: 'Làng Vinh Xuân nổi tiếng với nghề làm nước ớt truyền thống, chọn lọc kỹ và chế biến theo công thức gia truyền.', en: 'Vinh Xuan Village is famous for traditional chili sauce, carefully selected and processed.' }, image: '/images/destinations/bien-phu-dien-3.jpg', fact: { vi: 'Nước ớt Vinh Xuân có hương vị cay nồng đặc trưng', en: 'Distinctive spicy flavor' } },
            { title: { vi: 'Quy trình sản xuất', en: 'Production Process' }, content: { vi: 'Ớt tươi được rửa sạch, phơi khô và xay nhuyễn. Gia vị được thêm vào theo tỷ lệ bí truyền.', en: 'Fresh chilies are washed, dried and ground. Spices added according to secret ratio.' }, image: '/images/destinations/bien-phu-dien-4.jpg' },
            { title: { vi: 'Giá trị văn hóa và kinh tế', en: 'Cultural and Economic Value' }, content: { vi: 'Nghề làm nước ớt không chỉ là sinh kế mà còn là niềm tự hào của người dân Vinh Xuân.', en: 'Chili sauce making is not only a livelihood but also a pride of Vinh Xuan people.' }, image: '/images/destinations/bien-phu-dien-5.jpg', fact: { vi: 'Mỗi gia đình có công thức bí truyền riêng', en: 'Each family has their own secret recipe' } },
        ]
    },
    {
        id: 'mam-phu-dien',
        title: { vi: 'Làng nghề làm mắm Phú Diên', en: 'Phu Dien Fish Sauce Craft' },
        description: { vi: 'Tìm hiểu nghề làm mắm truyền thống của làng chài', en: 'Learn about traditional fish sauce making' },
        location: { vi: 'Thôn Phú Diên', en: 'Phu Dien Village' },
        image: '/images/destinations/bien-phu-dien-1.jpg',
        slides: [
            { title: { vi: 'Làng chài và nghề làm mắm', en: 'Fishing Village and Fish Sauce' }, content: { vi: 'Làng Phú Diên gắn liền với biển và nghề đánh cá, phát triển nghề làm mắm từ nhiều đời nay.', en: 'Phu Dien Village is tied to the sea, developing fish sauce making for generations.' }, image: '/images/destinations/bien-phu-dien-1.jpg', fact: { vi: 'Mắm là gia vị không thể thiếu trong bữa ăn địa phương', en: 'Fish sauce is essential in local meals' } },
            { title: { vi: 'Các loại mắm đặc sản', en: 'Specialty Fish Sauce Types' }, content: { vi: 'Phú Diên nổi tiếng với mắm ruốc, mắm tôm, mắm cá, mắm nêm.', en: 'Famous for shrimp paste, fermented shrimp sauce, fish sauce, and anchovy sauce.' }, image: '/images/destinations/bien-phu-dien-2.jpg' },
            { title: { vi: 'Bí quyết ủ mắm', en: 'Fermentation Secrets' }, content: { vi: 'Nghệ thuật làm mắm nằm ở khâu chọn nguyên liệu, tỷ lệ muối và thời gian ủ.', en: 'The art lies in ingredient selection, salt ratio, and fermentation time.' }, image: '/images/destinations/bien-phu-dien-3.jpg', fact: { vi: 'Mắm ngon phải ủ đủ 6-12 tháng', en: 'Needs 6-12 months of fermentation' } },
        ]
    },
];

// ========== TRIP PLANNER CONTENT ==========
const plannerContent = {
    hero: {
        badge: { vi: 'Xây dựng lộ trình', en: 'Trip Planning' },
        title1: { vi: 'Lên kế hoạch ', en: 'Plan Your Trip to ' },
        title2: { vi: 'Phú Vinh', en: 'Phu Vinh' },
        subtitle: { vi: 'Chọn lộ trình có sẵn hoặc để AI tạo lộ trình riêng cho bạn', en: 'Choose a preset or let AI create a custom one' }
    },
    sections: {
        suggested: { vi: 'Lộ trình gợi ý', en: 'Suggested Itineraries' },
        estimatedCost: { vi: 'Chi phí ước tính:', en: 'Estimated cost:' },
        detail: { vi: 'Chi tiết', en: 'Details' },
        aiTitle: { vi: 'AI Tạo lộ trình riêng', en: 'AI Custom Itinerary' },
        aiSubtitle: { vi: 'Mô tả yêu cầu, AI sẽ tạo lộ trình phù hợp', en: 'Describe requirements, AI will create a suitable itinerary' },
        aiPlaceholder: { vi: 'Ví dụ: Tôi muốn đi 1 ngày với vợ, thích biển và hải sản...', en: 'Example: I want a 1-day trip with my wife, love beaches and seafood...' },
        generating: { vi: 'Đang tạo lộ trình...', en: 'Generating itinerary...' },
        generateBtn: { vi: 'Tạo lộ trình bằng AI', en: 'Generate with AI' },
        yourItinerary: { vi: '📋 Lộ trình của bạn', en: '📋 Your Itinerary' },
        tips: { vi: '💡 Mẹo du lịch Phú Vinh', en: '💡 Phu Vinh Travel Tips' }
    },
    tips: {
        transport: { vi: 'Di chuyển bằng xe máy thuê tiện lợi nhất (~100-150k/ngày)', en: 'Renting a motorbike is most convenient (~100-150k VND/day)' },
        cash: { vi: 'Mang theo tiền mặt - nhiều nơi không có ATM', en: 'Bring cash - many places have no ATM' },
        sun: { vi: 'Đem kem chống nắng, mũ nón - biển nắng gắt', en: 'Bring sunscreen & hat - beach is very sunny' },
        season: { vi: 'Thời gian tốt nhất: tháng 3-8, tránh mùa mưa bão', en: 'Best time: March-August, avoid rainy season' }
    }
};

const itineraryContent = {
    'half-day-morning': {
        title: { vi: 'Nửa ngày buổi sáng', en: 'Half Day Morning' },
        description: { vi: 'Ngắm bình minh, khám phá làng chài và làng nghề', en: 'Watch sunrise, explore fishing village and craft villages' },
        duration: { vi: '5h - 11h (6 tiếng)', en: '5AM - 11AM (6 hours)' },
        stops: { vi: ['Biển Vinh Thanh', 'Làng An Bằng', 'Làng nghề nước ớt'], en: ['Vinh Thanh Beach', 'An Bang Village', 'Chili Sauce Village'] },
        detailTitle: { vi: 'Lộ trình nửa ngày buổi sáng', en: 'Half Day Morning Itinerary' },
        totalCost: { vi: '300-550k/người', en: '300-550k VND/person' },
        schedule: [
            { time: '5:00 - 5:30', activity: { vi: 'Di chuyển từ Huế đến Biển Vinh Thanh', en: 'Travel from Hue to Vinh Thanh Beach' }, icon: '🚗', tip: { vi: 'Thuê xe máy hoặc Grab', en: 'Rent motorbike or use Grab' } },
            { time: '5:30 - 7:00', activity: { vi: 'Ngắm bình minh + Xem thuyền cá về bến', en: 'Watch sunrise + See fishing boats return' }, icon: '🌅', tip: { vi: 'Mang theo máy ảnh', en: 'Bring a camera' } },
            { time: '7:00 - 8:00', activity: { vi: 'Ăn sáng tại quán ven biển', en: 'Breakfast at beachside restaurant' }, icon: '🍜', tip: { vi: 'Bánh canh cá, bún hải sản', en: 'Try fish noodle soup' } },
            { time: '8:00 - 9:30', activity: { vi: 'Tham quan Làng An Bằng', en: 'Visit An Bang Village' }, icon: '🏛️', tip: { vi: 'Thuê người dẫn ~50k', en: 'Hire guide ~50k VND' } },
            { time: '9:30 - 10:30', activity: { vi: 'Làng nghề nước ớt Vinh Xuân', en: 'Vinh Xuan Chili Sauce Village' }, icon: '🌶️', tip: { vi: 'Mua sản phẩm làm quà', en: 'Buy as souvenirs' } },
            { time: '10:30 - 11:00', activity: { vi: 'Về Huế', en: 'Return to Hue' }, icon: '🏠', tip: { vi: '', en: '' } },
        ]
    },
    'half-day-afternoon': {
        title: { vi: 'Nửa ngày buổi chiều', en: 'Half Day Afternoon' },
        description: { vi: 'Tắm biển, ngắm hoàng hôn và thưởng thức hải sản', en: 'Swim, watch sunset and enjoy seafood' },
        duration: { vi: '14h - 20h (6 tiếng)', en: '2PM - 8PM (6 hours)' },
        stops: { vi: ['Biển Phú Diên', 'Làng nghề mắm', 'Biển Vinh Thanh'], en: ['Phu Dien Beach', 'Fish Sauce Village', 'Vinh Thanh Beach'] },
        detailTitle: { vi: 'Lộ trình nửa ngày buổi chiều', en: 'Half Day Afternoon Itinerary' },
        totalCost: { vi: '350-600k/người', en: '350-600k VND/person' },
        schedule: [
            { time: '14:00 - 14:30', activity: { vi: 'Di chuyển từ Huế đến Biển Phú Diên', en: 'Travel from Hue to Phu Dien Beach' }, icon: '🚗', tip: { vi: '', en: '' } },
            { time: '14:30 - 15:30', activity: { vi: 'Tham quan làng chài + Làng nghề mắm', en: 'Visit fishing village + Fish sauce craft' }, icon: '🐟', tip: { vi: 'Xem quy trình làm mắm', en: 'See sauce making process' } },
            { time: '15:30 - 16:30', activity: { vi: 'Tham quan Làng An Bằng', en: 'Visit An Bang Village' }, icon: '🏛️', tip: { vi: '', en: '' } },
            { time: '16:30 - 17:30', activity: { vi: 'Biển Vinh Thanh - Tắm biển', en: 'Vinh Thanh Beach - Swimming' }, icon: '🏖️', tip: { vi: 'Mang theo đồ bơi', en: 'Bring swimwear' } },
            { time: '17:30 - 18:30', activity: { vi: 'Ngắm hoàng hôn', en: 'Watch sunset' }, icon: '🌅', tip: { vi: 'Vị trí đẹp: bến thuyền', en: 'Best spot: boat pier' } },
            { time: '18:30 - 19:30', activity: { vi: 'Ăn tối hải sản', en: 'Seafood dinner' }, icon: '🍽️', tip: { vi: 'Cá nướng, mực, tôm', en: 'Grilled fish, squid, shrimp' } },
            { time: '19:30 - 20:00', activity: { vi: 'Về Huế', en: 'Return to Hue' }, icon: '🏠', tip: { vi: '', en: '' } },
        ]
    },
    'full-day': {
        title: { vi: '1 ngày đầy đủ', en: 'Full Day Experience' },
        description: { vi: 'Trải nghiệm trọn vẹn Phú Vinh từ bình minh đến hoàng hôn', en: 'Complete experience from sunrise to sunset' },
        duration: { vi: '5h - 20h (15 tiếng)', en: '5AM - 8PM (15 hours)' },
        stops: { vi: ['Bình minh', 'Làng An Bằng', 'Làng nghề', 'Tắm biển', 'Hải sản', 'Hoàng hôn'], en: ['Sunrise', 'An Bang', 'Crafts', 'Beach', 'Seafood', 'Sunset'] },
        detailTitle: { vi: 'Lộ trình 1 ngày đầy đủ', en: 'Full Day Itinerary' },
        totalCost: { vi: '500k-1 triệu/người', en: '500k-1M VND/person' },
        schedule: [
            { time: '5:00 - 5:30', activity: { vi: 'Di chuyển từ Huế', en: 'Travel from Hue' }, icon: '🚗', tip: { vi: '', en: '' } },
            { time: '5:30 - 7:30', activity: { vi: 'Biển Vinh Thanh - Bình minh', en: 'Vinh Thanh Beach - Sunrise' }, icon: '🌅', tip: { vi: 'Không nên bỏ lỡ!', en: "Don't miss!" } },
            { time: '7:30 - 8:30', activity: { vi: 'Ăn sáng tại làng chài', en: 'Breakfast at fishing village' }, icon: '🍜', tip: { vi: 'Bánh canh, bún', en: 'Noodle soup' } },
            { time: '8:30 - 10:00', activity: { vi: 'Làng An Bằng', en: 'An Bang Village' }, icon: '🏛️', tip: { vi: 'Điểm nhấn chuyến đi', en: 'Trip highlight' } },
            { time: '10:00 - 11:30', activity: { vi: 'Làng nghề nước ớt', en: 'Chili Sauce Village' }, icon: '🌶️', tip: { vi: 'Mua sản phẩm', en: 'Buy products' } },
            { time: '11:30 - 14:00', activity: { vi: 'Tắm biển + Ăn trưa', en: 'Beach + Lunch' }, icon: '🏖️', tip: { vi: 'Nghỉ trưa tại quán', en: 'Rest at restaurant' } },
            { time: '14:00 - 15:30', activity: { vi: 'Biển Phú Diên + Làng nghề mắm', en: 'Phu Dien + Fish sauce craft' }, icon: '🐟', tip: { vi: '', en: '' } },
            { time: '15:30 - 17:00', activity: { vi: 'Nghỉ ngơi, tắm biển', en: 'Rest and swim' }, icon: '🌊', tip: { vi: '', en: '' } },
            { time: '17:00 - 18:00', activity: { vi: 'Ngắm hoàng hôn', en: 'Watch sunset' }, icon: '🌅', tip: { vi: '', en: '' } },
            { time: '18:00 - 19:30', activity: { vi: 'Ăn tối hải sản', en: 'Seafood dinner' }, icon: '🍽️', tip: { vi: 'Gọi nhiều món!', en: 'Order many dishes!' } },
            { time: '19:30 - 20:00', activity: { vi: 'Về Huế', en: 'Return to Hue' }, icon: '🏠', tip: { vi: '', en: '' } },
        ]
    },
    'family': {
        title: { vi: 'Dành cho gia đình', en: 'Family Friendly' },
        description: { vi: 'Lịch trình phù hợp với trẻ em, nhẹ nhàng và vui vẻ', en: 'Kid-friendly, relaxed and fun' },
        duration: { vi: '8h - 17h (9 tiếng)', en: '8AM - 5PM (9 hours)' },
        stops: { vi: ['Biển Phú Diên', 'Làng An Bằng', 'Tắm biển Vinh Thanh'], en: ['Phu Dien Beach', 'An Bang Village', 'Vinh Thanh Beach'] },
        detailTitle: { vi: 'Lộ trình cho gia đình', en: 'Family Itinerary' },
        totalCost: { vi: '400-700k/người lớn', en: '400-700k VND/adult' },
        schedule: [
            { time: '8:00 - 8:30', activity: { vi: 'Xuất phát từ Huế', en: 'Depart from Hue' }, icon: '🚗', tip: { vi: 'Không cần dậy sớm', en: 'No early wake-up' } },
            { time: '9:00 - 10:30', activity: { vi: 'Biển Phú Diên - Xem thuyền, chơi cát', en: 'Phu Dien - Boats, play in sand' }, icon: '🏖️', tip: { vi: 'Trẻ em thích xem thuyền', en: 'Kids love boats' } },
            { time: '10:30 - 11:30', activity: { vi: 'Làng An Bằng', en: 'An Bang Village' }, icon: '🏛️', tip: { vi: 'Giải thích cho trẻ', en: 'Explain to children' } },
            { time: '11:30 - 13:30', activity: { vi: 'Ăn trưa + Nghỉ ngơi', en: 'Lunch + Rest' }, icon: '🍽️', tip: { vi: 'Chọn quán có bóng mát', en: 'Choose shaded restaurant' } },
            { time: '13:30 - 16:00', activity: { vi: 'Biển Vinh Thanh - Tắm biển', en: 'Vinh Thanh - Swimming' }, icon: '🌊', tip: { vi: 'Mang phao cho trẻ', en: 'Bring floats for kids' } },
            { time: '16:00 - 17:00', activity: { vi: 'Ăn nhẹ + Về Huế', en: 'Snack + Return' }, icon: '🏠', tip: { vi: '', en: '' } },
        ]
    },
};

// ========== MAIN COMPONENT ==========
export default function StoriesPage() {
    const [mounted, setMounted] = useState(false);
    const [activeTab, setActiveTab] = useState<'stories' | 'planner'>('stories');
    // Stories state
    const [selectedStory, setSelectedStory] = useState<typeof storiesData[0] | null>(null);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);
    // Planner state
    const [selectedItinerary, setSelectedItinerary] = useState<string | null>(null);
    const [aiPrompt, setAiPrompt] = useState('');
    const [aiResult, setAiResult] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { language } = useLanguage();
    const lang = language as 'vi' | 'en';

    useEffect(() => { setMounted(true); }, []);

    // Stories auto-play
    useEffect(() => {
        if (!selectedStory || !isPlaying) return;
        const timer = setInterval(() => {
            setCurrentSlide((prev) => {
                if (prev >= selectedStory.slides.length - 1) { setIsPlaying(false); return prev; }
                return prev + 1;
            });
        }, 6000);
        return () => clearInterval(timer);
    }, [selectedStory, isPlaying]);

    const openStory = (story: typeof storiesData[0]) => { setSelectedStory(story); setCurrentSlide(0); setIsPlaying(true); };
    const closeStory = () => { setSelectedStory(null); setCurrentSlide(0); setIsPlaying(false); };
    const nextSlide = () => { if (selectedStory && currentSlide < selectedStory.slides.length - 1) setCurrentSlide(currentSlide + 1); };
    const prevSlide = () => { if (currentSlide > 0) setCurrentSlide(currentSlide - 1); };

    // AI planner
    const generateCustomItinerary = async () => {
        if (!aiPrompt.trim()) return;
        setIsLoading(true);
        try {
            const promptText = lang === 'vi'
                ? `Hãy tạo lộ trình tham quan xã Phú Vinh với yêu cầu: ${aiPrompt}. Bao gồm: thời gian cụ thể, địa điểm, gợi ý ăn uống, chi phí ước tính, mẹo hữu ích.`
                : `Create a Phu Vinh travel itinerary: ${aiPrompt}. Include: times, locations, food, costs, tips.`;
            const response = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: promptText }) });
            const data = await response.json();
            setAiResult(data.response || data.message);
        } catch {
            setAiResult(lang === 'vi' ? 'Có lỗi xảy ra. Vui lòng thử lại.' : 'An error occurred. Please try again.');
        }
        setIsLoading(false);
    };

    const detail = selectedItinerary ? itineraryContent[selectedItinerary as keyof typeof itineraryContent] : null;
    const presetItineraries = [
        { id: 'half-day-morning', icon: <Sun className="w-5 h-5" />, color: 'from-orange-500/20 to-yellow-500/20' },
        { id: 'half-day-afternoon', icon: <Sunset className="w-5 h-5" />, color: 'from-purple-500/20 to-pink-500/20' },
        { id: 'full-day', icon: <Calendar className="w-5 h-5" />, color: 'from-blue-500/20 to-cyan-500/20' },
        { id: 'family', icon: <Users className="w-5 h-5" />, color: 'from-green-500/20 to-emerald-500/20' },
    ];

    if (!mounted) return <div className="min-h-screen pt-16 flex items-center justify-center"><div className="w-8 h-8 border-2 border-[#2d5a57] border-t-transparent rounded-full animate-spin" /></div>;

    return (
        <div className="min-h-screen">
            {/* Hero with tabs */}
            <section className="relative py-12 px-4 bg-gradient-to-b from-[#2d5a57]/10 to-transparent dark:from-[#2d5a57]/20">
                <div className="max-w-6xl mx-auto text-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <Badge className="mb-4 bg-[#2d5a57]/20 text-[#2d5a57] dark:text-emerald-400">
                            <BookOpen className="w-3 h-3 mr-1" />
                            {activeTab === 'stories' ? storiesContent.hero.badge[lang] : plannerContent.hero.badge[lang]}
                        </Badge>
                        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-[#2d5a57] dark:text-emerald-400">
                            {activeTab === 'stories'
                                ? <>{storiesContent.hero.title1[lang]}<span className="text-[#5a8a87] dark:text-emerald-300">{storiesContent.hero.title2[lang]}</span></>
                                : <>{plannerContent.hero.title1[lang]}<span className="text-[#5a8a87] dark:text-emerald-300">{plannerContent.hero.title2[lang]}</span></>
                            }
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto mb-8">
                            {activeTab === 'stories' ? storiesContent.hero.subtitle[lang] : plannerContent.hero.subtitle[lang]}
                        </p>

                        {/* Tab switcher */}
                        <div className="inline-flex bg-white dark:bg-gray-800 rounded-full p-1 shadow-sm border border-gray-200 dark:border-gray-700">
                            {(['stories', 'planner'] as const).map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={cn(
                                        "px-5 py-2.5 rounded-full text-sm font-medium transition-all",
                                        activeTab === tab
                                            ? "bg-[#2d5a57] text-white shadow-md"
                                            : "text-gray-500 dark:text-gray-400 hover:text-[#2d5a57] dark:hover:text-emerald-400"
                                    )}
                                >
                                    {tabLabels[tab][lang]}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ===== TAB: STORIES ===== */}
            {activeTab === 'stories' && (
                <>
                    <section className="py-8 px-4">
                        <div className="max-w-6xl mx-auto">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {storiesData.map((story, index) => (
                                    <motion.div key={story.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} onClick={() => openStory(story)} className="cursor-pointer group">
                                        <div className="relative aspect-[9/16] rounded-2xl overflow-hidden bg-gradient-to-br from-[#2d5a57]/30 to-[#5a8a87]/30 border border-gray-200 dark:border-gray-700 group-hover:border-[#2d5a57]/50 transition-all">
                                            {story.image ? <img src={story.image} alt={story.title[lang]} className="absolute inset-0 w-full h-full object-cover" /> : <div className="absolute inset-0 flex items-center justify-center"><Camera className="w-12 h-12 text-gray-300" /></div>}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                            <div className="absolute bottom-0 left-0 right-0 p-4">
                                                <h3 className="font-bold text-sm mb-1 line-clamp-2 text-white">{story.title[lang]}</h3>
                                                <div className="flex items-center gap-1 text-xs text-gray-300"><MapPin className="w-3 h-3" />{story.location[lang]}</div>
                                                <p className="text-xs text-gray-400 mt-1">{story.slides.length} {storiesContent.sections.slides[lang]}</p>
                                            </div>
                                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur flex items-center justify-center"><Play className="w-6 h-6 text-white fill-white" /></div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Info */}
                    <section className="py-8 px-4">
                        <div className="max-w-3xl mx-auto">
                            <div className="p-6 rounded-2xl bg-[#2d5a57]/10 dark:bg-[#2d5a57]/20 border border-[#2d5a57]/20">
                                <h3 className="font-bold text-lg mb-2 text-[#2d5a57] dark:text-emerald-400">{storiesContent.sections.about[lang]}</h3>
                                <p className="text-gray-600 dark:text-gray-300 text-sm">{storiesContent.sections.aboutDesc[lang]}</p>
                                <div className="mt-4 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                    <Badge variant="secondary">{storiesContent.sections.badge[lang]}</Badge>
                                    <span>{storiesContent.sections.tagline[lang]}</span>
                                </div>
                            </div>
                        </div>
                    </section>
                </>
            )}

            {/* ===== TAB: AI PLANNER ===== */}
            {activeTab === 'planner' && (
                <>
                    <section className="py-8 px-4">
                        <div className="max-w-6xl mx-auto">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-[#2d5a57] dark:text-emerald-400">
                                <Clock className="w-5 h-5" />
                                {plannerContent.sections.suggested[lang]}
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                                {presetItineraries.map((itinerary, index) => {
                                    const c = itineraryContent[itinerary.id as keyof typeof itineraryContent];
                                    return (
                                        <motion.div key={itinerary.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                                            <Card className={cn("cursor-pointer transition-all bg-white dark:bg-gray-800",
                                                selectedItinerary === itinerary.id ? 'border-[#2d5a57] ring-2 ring-[#2d5a57]/20' : 'border-gray-200 dark:border-gray-700 hover:border-[#2d5a57]/50'
                                            )} onClick={() => setSelectedItinerary(selectedItinerary === itinerary.id ? null : itinerary.id)}>
                                                <CardContent className={`p-6 bg-gradient-to-br ${itinerary.color}`}>
                                                    <div className="flex items-start justify-between mb-3">
                                                        <div className="w-10 h-10 rounded-xl bg-white/50 dark:bg-gray-900/50 flex items-center justify-center">{itinerary.icon}</div>
                                                        {selectedItinerary === itinerary.id && <CheckCircle className="w-5 h-5 text-[#2d5a57] dark:text-emerald-400" />}
                                                    </div>
                                                    <h3 className="font-bold text-lg mb-1 text-gray-900 dark:text-white">{c.title[lang]}</h3>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{c.description[lang]}</p>
                                                    <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mb-3"><Clock className="w-3 h-3" />{c.duration[lang]}</div>
                                                    <div className="flex flex-wrap gap-1">{c.stops[lang].map((stop, i) => <Badge key={i} variant="secondary" className="text-xs">{stop}</Badge>)}</div>
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    );
                                })}
                            </div>

                            {/* Detail */}
                            <AnimatePresence>
                                {detail && (
                                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mb-8">
                                        <Card className="border-[#2d5a57]/30 bg-[#2d5a57]/5 dark:bg-[#2d5a57]/10">
                                            <CardContent className="p-6">
                                                <div className="flex items-center justify-between mb-6">
                                                    <div>
                                                        <h3 className="font-bold text-xl text-[#2d5a57] dark:text-emerald-400">{detail.detailTitle[lang]}</h3>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">{plannerContent.sections.estimatedCost[lang]} <span className="text-[#2d5a57] dark:text-emerald-400 font-medium">{detail.totalCost[lang]}</span></p>
                                                    </div>
                                                    <Badge className="bg-[#2d5a57]">{plannerContent.sections.detail[lang]}</Badge>
                                                </div>
                                                <div className="space-y-4">
                                                    {detail.schedule.map((item, index) => (
                                                        <div key={index} className="flex items-start gap-4">
                                                            <div className="flex-shrink-0 w-20 text-sm font-medium text-[#2d5a57] dark:text-emerald-400">{item.time.split(' - ')[0]}</div>
                                                            <div className="flex-shrink-0 text-2xl">{item.icon}</div>
                                                            <div className="flex-1">
                                                                <p className="font-medium text-gray-900 dark:text-white">{item.activity[lang]}</p>
                                                                {item.tip[lang] && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">💡 {item.tip[lang]}</p>}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </section>

                    {/* AI Custom */}
                    <section className="py-8 px-4">
                        <div className="max-w-3xl mx-auto">
                            <Card className="border-[#2d5a57]/30 bg-gradient-to-br from-[#2d5a57]/10 to-[#5a8a87]/10 dark:from-[#2d5a57]/20 dark:to-[#5a8a87]/20">
                                <CardContent className="p-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 rounded-xl bg-[#2d5a57]/20 flex items-center justify-center"><Sparkles className="w-5 h-5 text-[#2d5a57] dark:text-emerald-400" /></div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 dark:text-white">{plannerContent.sections.aiTitle[lang]}</h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{plannerContent.sections.aiSubtitle[lang]}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <textarea
                                            className="w-full h-24 p-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-[#2d5a57]/50 text-gray-900 dark:text-white"
                                            placeholder={plannerContent.sections.aiPlaceholder[lang]}
                                            value={aiPrompt}
                                            onChange={(e) => setAiPrompt(e.target.value)}
                                        />
                                        <Button className="w-full bg-[#2d5a57] hover:bg-[#1e3f3d] text-white" onClick={generateCustomItinerary} disabled={isLoading || !aiPrompt.trim()}>
                                            {isLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />{plannerContent.sections.generating[lang]}</> : <><Sparkles className="w-4 h-4 mr-2" />{plannerContent.sections.generateBtn[lang]}</>}
                                        </Button>
                                        {aiResult && (
                                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                                                <h4 className="font-semibold mb-2 text-[#2d5a57] dark:text-emerald-400">{plannerContent.sections.yourItinerary[lang]}</h4>
                                                <div className="text-sm whitespace-pre-wrap text-gray-700 dark:text-gray-300">{aiResult}</div>
                                            </motion.div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </section>

                    {/* Tips */}
                    <section className="py-8 px-4">
                        <div className="max-w-3xl mx-auto">
                            <Card className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-700/30">
                                <CardContent className="p-6">
                                    <h3 className="font-bold mb-4 text-amber-700 dark:text-amber-400">{plannerContent.sections.tips[lang]}</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700 dark:text-gray-300">
                                        <div className="flex items-start gap-2"><MapPin className="w-4 h-4 text-amber-500 mt-0.5" /><p>{plannerContent.tips.transport[lang]}</p></div>
                                        <div className="flex items-start gap-2"><Navigation className="w-4 h-4 text-amber-500 mt-0.5" /><p>{plannerContent.tips.cash[lang]}</p></div>
                                        <div className="flex items-start gap-2"><Sun className="w-4 h-4 text-amber-500 mt-0.5" /><p>{plannerContent.tips.sun[lang]}</p></div>
                                        <div className="flex items-start gap-2"><Clock className="w-4 h-4 text-amber-500 mt-0.5" /><p>{plannerContent.tips.season[lang]}</p></div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </section>
                </>
            )}

            {/* ===== STORY VIEWER FULLSCREEN ===== */}
            <AnimatePresence>
                {selectedStory && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black">
                        {/* Progress */}
                        <div className="absolute top-4 left-4 right-4 flex gap-1 z-20">
                            {selectedStory.slides.map((_, index) => (
                                <div key={index} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
                                    <motion.div className="h-full bg-white" initial={{ width: index < currentSlide ? '100%' : '0%' }} animate={{ width: index < currentSlide ? '100%' : index === currentSlide && isPlaying ? '100%' : '0%' }} transition={{ duration: index === currentSlide && isPlaying ? 6 : 0 }} />
                                </div>
                            ))}
                        </div>

                        <Button variant="ghost" size="sm" className="absolute top-12 right-4 z-20 text-white hover:bg-white/20" onClick={closeStory}><X className="w-6 h-6" /></Button>

                        <div className="absolute inset-0 flex items-center justify-center p-8">
                            <motion.div key={currentSlide} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="max-w-2xl text-center">
                                {selectedStory.slides[currentSlide].image ? (
                                    <div className="mb-6 rounded-xl overflow-hidden aspect-video max-w-lg mx-auto"><img src={selectedStory.slides[currentSlide].image} alt="" className="w-full h-full object-cover" /></div>
                                ) : (
                                    <div className="mb-6 p-4 rounded-xl bg-gradient-to-br from-[#2d5a57]/20 to-[#5a8a87]/20"><Camera className="w-20 h-20 mx-auto text-gray-500" /><p className="text-xs text-gray-400 mt-2">{storiesContent.sections.imageNote[lang]}</p></div>
                                )}
                                <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">{selectedStory.slides[currentSlide].title[lang]}</h2>
                                <p className="text-lg text-gray-300 leading-relaxed mb-6">{selectedStory.slides[currentSlide].content[lang]}</p>
                                {selectedStory.slides[currentSlide].fact && (
                                    <div className="inline-block px-4 py-2 rounded-full bg-[#2d5a57]/40 text-emerald-300 text-sm">💡 {selectedStory.slides[currentSlide].fact[lang]}</div>
                                )}
                            </motion.div>
                        </div>

                        <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-4 z-20">
                            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20" onClick={prevSlide} disabled={currentSlide === 0}><ChevronLeft className="w-6 h-6" /></Button>
                            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20" onClick={() => setIsPlaying(!isPlaying)}>{isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}</Button>
                            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20" onClick={nextSlide} disabled={currentSlide === selectedStory.slides.length - 1}><ChevronRight className="w-6 h-6" /></Button>
                        </div>

                        <div className="absolute inset-y-0 left-0 w-1/3 cursor-pointer" onClick={prevSlide} />
                        <div className="absolute inset-y-0 right-0 w-1/3 cursor-pointer" onClick={nextSlide} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// Bilingual data for all pages
// This file contains both Vietnamese and English content

export type Language = 'vi' | 'en';

interface BilingualText {
    vi: string;
    en: string;
}

interface BilingualArray {
    vi: string[];
    en: string[];
}

// ============================================
// DESTINATIONS DATA
// ============================================

export interface DestinationData {
    id: string;
    title: BilingualText;
    description: BilingualText;
    images: string[];
    location: BilingualText;
    hours: BilingualText;
    category: BilingualText;
    coordinates: { lat: number; lng: number };
    highlights: BilingualArray;
    tips: BilingualArray;
    cost: BilingualText;
}

export const destinations: DestinationData[] = [
    {
        id: 'dinh-ha-thanh',
        title: {
            vi: 'Đình Làng Hà Thanh',
            en: 'Ha Thanh Communal House'
        },
        description: {
            vi: 'Đình làng Hà Thanh là di tích lịch sử cấp tỉnh, được xây dựng từ thế kỷ XVI, mang kiến trúc đình làng truyền thống của miền Trung Việt Nam. Đình là nơi thờ phụng Thành hoàng làng và các vị khai canh, đồng thời là không gian sinh hoạt cộng đồng, gắn kết người dân qua các lễ hội truyền thống Thu tế, Xuân tế.',
            en: 'Ha Thanh Communal House is a provincial-level historical site built in the 16th century, featuring traditional Central Vietnamese communal architecture. It worships the village guardian deity and founding ancestors, serving as a community space connecting people through traditional festivals.'
        },
        images: [
            '/images/destinations/dinh-ha-thanh-1.jpg',
            '/images/destinations/dinh-ha-thanh-2.jpg',
            '/images/destinations/dinh-ha-thanh-3.jpg',
            '/images/destinations/dinh-ha-thanh-4.jpg',
            '/images/destinations/dinh-ha-thanh-5.jpg',
        ],
        location: {
            vi: 'Thôn Hà Thanh, Xã Phú Vinh, TP Huế',
            en: 'Ha Thanh Village, Phu Vinh Commune, Hue City'
        },
        hours: {
            vi: 'Cả ngày (liên hệ trưởng thôn để tham quan bên trong)',
            en: 'All day (contact village head for inside visits)'
        },
        category: {
            vi: 'Di tích',
            en: 'Heritage'
        },
        coordinates: { lat: 16.4335918, lng: 107.7796597 },
        highlights: {
            vi: ['🏛️ Di tích cấp tỉnh', '📜 Xây từ thế kỷ XVI', '🎎 Thờ Thành hoàng làng', '🎭 Lễ hội Thu tế, Xuân tế'],
            en: ['🏛️ Provincial Heritage', '📜 Built in 16th century', '🎎 Village guardian worship', '🎭 Traditional festivals']
        },
        tips: {
            vi: [
                'Liên hệ trưởng thôn để được mở cửa tham quan bên trong',
                'Trang phục lịch sự khi vào đình',
                'Tìm hiểu về lịch sử khai canh lập làng',
            ],
            en: [
                'Contact village head for inside access',
                'Dress respectfully when visiting',
                'Learn about the village founding history',
            ]
        },
        cost: {
            vi: 'Miễn phí',
            en: 'Free'
        },
    },
    {
        id: 'thap-cham-phu-dien',
        title: {
            vi: 'Tháp Chăm Phú Diên',
            en: 'Phu Dien Cham Tower'
        },
        description: {
            vi: 'Tháp Chăm Phú Diên là công trình Champa cổ nhất còn tồn tại dọc miền Trung Việt Nam, có niên đại thế kỷ VIII. Được phát hiện năm 2001 trong lòng cồn cát ven biển, vùi sâu 5-7m dưới cát, chỉ cách mép nước biển 120m. Đây là ngôi tháp nằm gần bờ biển nhất hiện còn tồn tại.',
            en: 'Phu Dien Cham Tower is the oldest surviving Champa structure along Central Vietnam, dating back to the 8th century. Discovered in 2001 buried in coastal sand dunes, 5-7m below sand level, only 120m from the shoreline - the tower closest to the beach still in existence.'
        },
        images: [
            '/images/heritage/thap-cham-1.jpg',
            '/images/heritage/thap-cham-2.jpg',
            '/images/heritage/thap-cham-3.jpg',
            '/images/heritage/thap-cham-4.jpg',
        ],
        location: {
            vi: 'Thôn Phú Diên, Xã Phú Vinh, TP Huế',
            en: 'Phu Dien Village, Phu Vinh Commune, Hue City'
        },
        hours: {
            vi: '7:00 - 17:00 hàng ngày',
            en: '7:00 AM - 5:00 PM daily'
        },
        category: {
            vi: 'Di tích',
            en: 'Heritage'
        },
        coordinates: { lat: 16.4957912, lng: 107.7460799 },
        highlights: {
            vi: ['🛕 Tháp Champa cổ nhất miền Trung', '📅 Niên đại thế kỷ VIII', '🏖️ Cách bờ biển 120m', '🔬 Phát hiện năm 2001'],
            en: ['🛕 Oldest Champa tower in Central VN', '📅 8th century dating', '🏖️ 120m from shoreline', '🔬 Discovered in 2001']
        },
        tips: {
            vi: [
                'Đến buổi sáng để có ánh sáng đẹp chụp ảnh',
                'Kết hợp tham quan biển Phú Diên gần đó',
                'Tìm hiểu kiến trúc gạch Chăm cổ đại',
            ],
            en: [
                'Visit in morning for best photography light',
                'Combine with nearby Phu Dien Beach visit',
                'Learn about ancient Cham brick architecture',
            ]
        },
        cost: {
            vi: 'Miễn phí',
            en: 'Free'
        },
    },
    {
        id: 'bien-vinh-thanh',
        title: {
            vi: 'Biển Vinh Thanh',
            en: 'Vinh Thanh Beach'
        },
        description: {
            vi: 'Bãi biển hoang sơ đẹp nhất vùng ven biển Phú Vinh, nổi tiếng với cảnh bình minh tuyệt đẹp và cuộc sống làng chài nguyên bản. Đây là điểm đến lý tưởng để tắm biển, ngắm bình minh và trải nghiệm cuộc sống làng chài. Hải sản tươi sống bán ngay tại bến cá mỗi sáng.',
            en: 'The most pristine beach in Phu Vinh coastal area, famous for its stunning sunrise views and authentic fishing village life. An ideal destination for swimming, watching sunrise, and experiencing the traditional fishing lifestyle. Fresh seafood is sold at the fishing pier every morning.'
        },
        images: [
            '/images/destinations/bien-vinh-thanh-1.jpg',
            '/images/destinations/bien-vinh-thanh-2.jpg',
            '/images/destinations/bien-vinh-thanh-3.jpg',
            '/images/destinations/bien-vinh-thanh-4.jpg',
            '/images/destinations/bien-vinh-thanh-5.jpg',
        ],
        location: {
            vi: 'Thôn Vinh Thanh, Xã Phú Vinh',
            en: 'Vinh Thanh Village, Phu Vinh Commune'
        },
        hours: {
            vi: '5:00 - 18:30 (Bình minh đẹp nhất: 5:00-7:00)',
            en: '5:00 AM - 6:30 PM (Best sunrise: 5:00-7:00 AM)'
        },
        category: {
            vi: 'Biển',
            en: 'Beach'
        },
        coordinates: { lat: 16.4505427, lng: 107.8035808 },
        highlights: {
            vi: ['🌅 Bình minh tuyệt đẹp', '🏖️ Bãi biển hoang sơ', '🚤 Làng chài truyền thống', '🐟 Hải sản tươi sống'],
            en: ['🌅 Stunning sunrise', '🏖️ Pristine beach', '🚤 Traditional fishing village', '🐟 Fresh seafood']
        },
        tips: {
            vi: [
                'Đến sớm 5:00 để chụp bình minh với thuyền cá làm hậu cảnh',
                'Mua cá tại bến, nhờ quán nấu (phí 20-50k)',
                'Mang tiền mặt vì không có ATM gần',
            ],
            en: [
                'Arrive at 5:00 AM to photograph sunrise with fishing boats as backdrop',
                'Buy fish at the pier, ask restaurants to cook it (fee 20-50k VND)',
                'Bring cash as there are no nearby ATMs',
            ]
        },
        cost: {
            vi: 'Miễn phí tham quan, hải sản 50-200k/món',
            en: 'Free entry, seafood 50-200k VND per dish'
        },
    },
    {
        id: 'bien-phu-dien',
        title: {
            vi: 'Biển Phú Diên',
            en: 'Phu Dien Beach'
        },
        description: {
            vi: 'Bãi biển yên bình của làng chài truyền thống, nổi tiếng với thuyền đánh cá gỗ nhiều màu sắc và chợ cá buổi sáng nhộn nhịp. Du khách có thể trải nghiệm đi thuyền cùng ngư dân và tìm hiểu nghề biển.',
            en: 'A peaceful beach of the traditional fishing village, famous for colorful wooden fishing boats and the bustling morning fish market. Visitors can experience boat trips with local fishermen and learn about the fishing trade.'
        },
        images: [
            '/images/destinations/bien-phu-dien-1.jpg',
            '/images/destinations/bien-phu-dien-2.jpg',
            '/images/destinations/bien-phu-dien-3.jpg',
            '/images/destinations/bien-phu-dien-4.jpg',
            '/images/destinations/bien-phu-dien-5.jpg',
        ],
        location: {
            vi: 'Thôn Phú Diên, Xã Phú Vinh',
            en: 'Phu Dien Village, Phu Vinh Commune'
        },
        hours: {
            vi: 'Chợ cá: 5:30-7:30, Tham quan: cả ngày',
            en: 'Fish market: 5:30-7:30 AM, Sightseeing: all day'
        },
        category: {
            vi: 'Biển',
            en: 'Beach'
        },
        coordinates: { lat: 16.4957433, lng: 107.7470525 },
        highlights: {
            vi: ['🎨 Thuyền cá nhiều màu', '👨‍🌾 Ngư dân thân thiện', '🛒 Chợ cá buổi sáng', '🍶 Làng nghề làm mắm'],
            en: ['🎨 Colorful fishing boats', '👨‍🌾 Friendly fishermen', '🛒 Morning fish market', '🍶 Fish sauce craft village']
        },
        tips: {
            vi: [
                'Đến 6:00 sáng để xem thuyền về bến',
                'Có thể đi thuyền với ngư dân (~100-200k)',
                'Chụp ảnh hoạt động phơi lưới rất đẹp',
            ],
            en: [
                'Arrive at 6:00 AM to watch boats return to shore',
                'You can go fishing with locals (~100-200k VND)',
                'Great photos of net-drying activities',
            ]
        },
        cost: {
            vi: 'Miễn phí, đi thuyền 100-200k (thương lượng)',
            en: 'Free entry, boat trip 100-200k VND (negotiable)'
        },
    },
    // Đã ẩn: Đầm phá Tam Giang - Cầu Hai
    // {
    //     id: 'dam-pha-tam-giang',
    //     ...
    // },
    {
        id: 'lang-an-bang',
        title: {
            vi: 'Khu lăng mộ làng An Bằng',
            en: 'An Bang Tomb City'
        },
        description: {
            vi: 'Làng An Bằng nổi tiếng thế giới với kiến trúc lăng mộ độc đáo, được mệnh danh là "Thành phố của người chết". Các lăng mộ được xây dựng như cung điện, có giá hàng tỷ đồng, thể hiện tín ngưỡng thờ cúng tổ tiên sâu sắc của người dân địa phương. Đã được BBC, CNN, National Geographic đưa tin.',
            en: 'An Bang Village is world-famous for its unique tomb architecture, known as the "City of the Dead". The tombs are built like palaces, costing billions of VND, reflecting the deep ancestor worship beliefs of the local people. Featured by BBC, CNN, and National Geographic.'
        },
        images: [
            '/images/destinations/an-bang-1.jpg',
            '/images/destinations/an-bang-2.jpg',
            '/images/destinations/an-bang-3.jpg',
            '/images/destinations/an-bang-4.jpg',
            '/images/destinations/an-bang-5.jpg',
        ],
        location: {
            vi: 'Làng An Bằng, Xã Vinh An',
            en: 'An Bang Village, Vinh An Commune'
        },
        hours: {
            vi: 'Tốt nhất: 7:00-11:00, 14:00-17:00',
            en: 'Best time: 7:00-11:00 AM, 2:00-5:00 PM'
        },
        category: {
            vi: 'Văn hóa',
            en: 'Culture'
        },
        coordinates: { lat: 16.4207477, lng: 107.8243632 },
        highlights: {
            vi: ['🏛️ Kiến trúc lăng mộ như cung điện', '🌍 Nổi tiếng quốc tế', '📚 Giá trị văn hóa cao', '🎓 Ý nghĩa giáo dục'],
            en: ['🏛️ Palace-like tomb architecture', '🌍 Internationally famous', '📚 High cultural value', '🎓 Educational significance']
        },
        tips: {
            vi: [
                'Thuê người dân làm hướng dẫn viên (50-100k)',
                'Trang phục lịch sự, không ồn ào',
                'Xin phép trước khi chụp ảnh gần các lăng mộ',
            ],
            en: [
                'Hire a local guide (50-100k VND)',
                'Dress respectfully, keep quiet',
                'Ask permission before photographing near tombs',
            ]
        },
        cost: {
            vi: 'Miễn phí tham quan',
            en: 'Free entry'
        },
    },
    // Đã ẩn: Đầm phá Tam Giang - Cầu Hai
    // {
    //     id: 'dam-pha-tam-giang',
    //     ...
    // },
    {
        id: 'le-hoi-dua-ghe-nan',
        title: {
            vi: 'Lễ hội Đua Ghe Nan Làng Phương Diên',
            en: 'Phuong Dien Village Bamboo Boat Racing Festival'
        },
        description: {
            vi: 'Đua ghe nan làng Phương Diên là lễ hội truyền thống tiêu biểu của cư dân vùng biển Phú Vinh. Lễ hội có từ thế kỷ XVII, gắn với quá trình khai canh, lập làng của cha ông. Qua đó, người dân gửi gắm ước mong mưa thuận gió hòa, ra khơi bình an, đánh bắt thuận lợi.',
            en: 'Phuong Dien bamboo boat racing is a signature traditional festival of the Phu Vinh coastal community. Dating from the 17th century, it is linked to the ancestors\' process of land cultivation and village establishment. Through the festival, local people express their wishes for favorable weather, safe voyages, and bountiful catches.'
        },
        images: [
            '/images/destinations/le-hoi-cau-ngu-1.jpg',
            '/images/destinations/le-hoi-cau-ngu-2.jpg',
            '/images/destinations/le-hoi-cau-ngu-3.jpg',
        ],
        location: {
            vi: 'Làng Phương Diên, Xã Phú Vinh',
            en: 'Phuong Dien Village, Phu Vinh Commune'
        },
        hours: {
            vi: 'Tháng 2-3 âm lịch hàng năm',
            en: 'February-March lunar calendar annually'
        },
        category: {
            vi: 'Lễ hội',
            en: 'Festival'
        },
        coordinates: { lat: 16.4925034, lng: 107.7495569 },
        highlights: {
            vi: ['📜 Lịch sử từ 1645', '🚣 Đua thuyền truyền thống', '🐋 Tục thờ Cá Ông', '🎭 Văn hóa ngư dân biển'],
            en: ['📜 History since 1645', '🚣 Traditional boat racing', '🐋 Whale worship ritual', '🎭 Maritime fishing culture']
        },
        tips: {
            vi: [
                'Tham gia vào tháng 2-3 âm lịch',
                'Đến sớm để có vị trí tốt xem đua thuyền',
                'Tìm hiểu tục thờ Cá Ông độc đáo',
            ],
            en: [
                'Visit in February-March lunar calendar',
                'Arrive early for good viewing spots',
                'Learn about unique whale worship traditions',
            ]
        },
        cost: {
            vi: 'Miễn phí tham quan',
            en: 'Free to attend'
        },
    },
];


// ============================================
// CRAFTS DATA
// ============================================

export interface CraftData {
    id: string;
    title: BilingualText;
    description: BilingualText;
    images: string[];
    location: BilingualText;
    category: BilingualText;
    coordinates: { lat: number; lng: number };
    history: BilingualText;
    process: { vi: string; en: string }[];
    products: { name: BilingualText; price: string }[];
    tips: BilingualArray;
    video?: string;
}

export const crafts: CraftData[] = [
    {
        id: 'nuoc-ot-vinh-xuan',
        title: {
            vi: 'Nước ớt Vinh Xuân',
            en: 'Vinh Xuan Chili Sauce'
        },
        description: {
            vi: 'Nước ớt truyền thống nổi tiếng được làm từ ớt tươi trồng tại địa phương. Hương vị cay nồng đặc trưng, thơm ngon, được ưa chuộng khắp vùng và là quà tặng ý nghĩa.',
            en: 'Famous traditional chili sauce made from locally grown fresh chilies. Known for its distinctive spicy flavor and aroma, popular throughout the region and a meaningful gift.'
        },
        images: [
            '/images/crafts/nuoc-ot-vinh-xuan-1.jpg',
            '/images/crafts/nuoc-ot-vinh-xuan-2.jpg',
            '/images/crafts/nuoc-ot-vinh-xuan-3.jpg',
            '/images/crafts/nuoc-ot-vinh-xuan-4.jpg',
            '/images/crafts/nuoc-ot-vinh-xuan-5.jpg',
        ],
        location: {
            vi: 'Làng Vinh Xuân, Xã Phú Vinh',
            en: 'Vinh Xuan Village, Phu Vinh Commune'
        },
        category: {
            vi: 'Gia vị',
            en: 'Spices'
        },
        coordinates: { lat: 16.4800, lng: 107.7100 },
        history: {
            vi: 'Nghề làm nước ớt ở Vinh Xuân có từ hàng trăm năm, được truyền qua nhiều thế hệ. Ớt được trồng trên đất phù sa màu mỡ, cho ra vị cay đặc biệt không nơi nào có được.',
            en: 'The chili sauce craft in Vinh Xuan has existed for hundreds of years, passed down through generations. Chilies are grown in fertile alluvial soil, producing a unique spiciness found nowhere else.'
        },
        process: [
            { vi: '1. Thu hoạch ớt tươi khi chín đỏ', en: '1. Harvest fresh chilies when fully red' },
            { vi: '2. Rửa sạch và phơi khô 1-2 ngày', en: '2. Wash and sun-dry for 1-2 days' },
            { vi: '3. Xay nhuyễn với tỏi và muối', en: '3. Grind with garlic and salt' },
            { vi: '4. Ủ trong hũ sành 2-3 tuần', en: '4. Ferment in clay jars for 2-3 weeks' },
            { vi: '5. Nấu sôi để khử trùng', en: '5. Boil to sterilize' },
            { vi: '6. Đóng chai và dán nhãn', en: '6. Bottle and label' },
        ],
        products: [
            { name: { vi: 'Nước ớt chai 250ml', en: 'Chili sauce 250ml bottle' }, price: '30,000₫' },
            { name: { vi: 'Nước ớt chai 500ml', en: 'Chili sauce 500ml bottle' }, price: '50,000₫' },
            { name: { vi: 'Ớt bột nguyên chất', en: 'Pure chili powder' }, price: '40,000₫/100g' },
            { name: { vi: 'Set quà tặng (3 chai)', en: 'Gift set (3 bottles)' }, price: '120,000₫' },
        ],
        tips: {
            vi: [
                'Mua trực tiếp từ hộ gia đình để có giá tốt',
                'Nên mua loại ủ lâu ngày, vị đậm hơn',
                'Kiểm tra hạn sử dụng và cách bảo quản',
            ],
            en: [
                'Buy directly from households for better prices',
                'Choose longer-fermented types for richer flavor',
                'Check expiry date and storage instructions',
            ]
        },
    },
    {
        id: 'mam-phu-dien',
        title: {
            vi: 'Mắm Phú Diên',
            en: 'Phu Dien Fish Sauce'
        },
        description: {
            vi: 'Các loại mắm truyền thống của làng chài Phú Diên như mắm ruốc, mắm tôm, mắm cá. Đây là gia vị không thể thiếu trong bữa ăn của người dân địa phương và là đặc sản nổi tiếng.',
            en: 'Traditional fermented condiments from Phu Dien fishing village including shrimp paste, shrimp sauce, and fish sauce. Essential seasonings for local meals and famous specialty products.'
        },
        images: [
            '/images/crafts/mam-phu-dien-1.jpg',
            '/images/crafts/mam-phu-dien-2.jpg',
            '/images/crafts/mam-phu-dien-3.jpg',
            '/images/crafts/mam-phu-dien-4.jpg',
            '/images/crafts/mam-phu-dien-5.jpg',
        ],
        video: 'https://drive.google.com/file/d/1DvS5Qq3smtOA6Eb11XCo-QXP80rkdc9k/preview',
        location: {
            vi: 'Làng Phú Diên, Xã Phú Vinh',
            en: 'Phu Dien Village, Phu Vinh Commune'
        },
        category: {
            vi: 'Mắm',
            en: 'Fermented Sauce'
        },
        coordinates: { lat: 16.4950, lng: 107.7050 },
        history: {
            vi: 'Nghề làm mắm ở Phú Diên gắn liền với nghề đánh cá truyền thống. Người dân sử dụng cá tươi đánh bắt được để ủ mắm, tạo nên hương vị đặc trưng không thể nhầm lẫn.',
            en: 'The fish sauce craft in Phu Dien is linked to traditional fishing. Locals use freshly caught fish for fermentation, creating a distinctive unmistakable flavor.'
        },
        process: [
            { vi: '1. Chọn cá/tôm tươi mới đánh bắt', en: '1. Select freshly caught fish/shrimp' },
            { vi: '2. Trộn đều với muối biển', en: '2. Mix thoroughly with sea salt' },
            { vi: '3. Ủ trong chum sành 6-12 tháng', en: '3. Ferment in clay urns for 6-12 months' },
            { vi: '4. Khuấy đảo định kỳ', en: '4. Stir periodically' },
            { vi: '5. Lọc lấy nước mắm', en: '5. Filter to extract sauce' },
            { vi: '6. Phơi nắng để tăng hương', en: '6. Sun-dry to enhance aroma' },
        ],
        products: [
            { name: { vi: 'Mắm ruốc 500g', en: 'Shrimp paste 500g' }, price: '80,000₫' },
            { name: { vi: 'Mắm tôm 500ml', en: 'Shrimp sauce 500ml' }, price: '60,000₫' },
            { name: { vi: 'Nước mắm nhỉ 500ml', en: 'Premium fish sauce 500ml' }, price: '70,000₫' },
            { name: { vi: 'Set mắm đặc biệt', en: 'Special sauce set' }, price: '200,000₫' },
        ],
        tips: {
            vi: [
                'Chọn mắm ủ từ 6 tháng trở lên',
                'Ngửi mùi để kiểm tra chất lượng',
                'Bảo quản nơi khô ráo, thoáng mát',
            ],
            en: [
                'Choose sauce fermented for at least 6 months',
                'Smell to check quality',
                'Store in a dry, cool place',
            ]
        },
    },
    {
        id: 'mam-ca-ho-an-bang',
        title: {
            vi: 'Mắm Cá Hố An Bằng',
            en: 'An Bang Hairtail Fish Sauce'
        },
        description: {
            vi: 'Mắm cá hố đu đủ là đặc sản độc đáo của làng An Bằng, kết hợp cá hố tươi với đu đủ xanh phơi khô, tạo nên hương vị mặn mòi đặc trưng của biển.',
            en: 'Hairtail fish sauce with papaya is a unique specialty of An Bang village, combining fresh hairtail fish with dried green papaya, creating a distinctive salty ocean flavor.'
        },
        images: [
            '/images/crafts/mam-ca-ho-1.jpg',
            '/images/crafts/mam-ca-ho-2.jpg',
            '/images/crafts/mam-ca-ho-3.jpg',
        ],
        location: {
            vi: 'Làng An Bằng, Xã Phú Vinh',
            en: 'An Bang Village, Phu Vinh Commune'
        },
        category: {
            vi: 'Mắm',
            en: 'Fermented Sauce'
        },
        coordinates: { lat: 16.4750, lng: 107.7200 },
        history: {
            vi: 'Vào mùa cá hố cũng là vào mùa mắm. Cá hố được chặt khúc, trộn với riềng, muối, ớt bột và thính gạo rồi ủ trong lu. Kết hợp với đu đủ xanh phơi khô tạo nên món mắm độc đáo.',
            en: 'During hairtail season is also sauce-making season. Hairtail fish is cut into pieces, mixed with galangal, salt, chili powder and rice bran, then fermented in clay jars. Combined with dried green papaya to create a unique sauce.'
        },
        process: [
            { vi: '1. Cá hố rửa sạch, chặt khúc 1cm', en: '1. Clean and cut hairtail into 1cm pieces' },
            { vi: '2. Trộn với riềng, muối, ớt, thính gạo', en: '2. Mix with galangal, salt, chili, rice bran' },
            { vi: '3. Ủ trong lu 20 ngày - 1 tháng', en: '3. Ferment in jar for 20 days - 1 month' },
            { vi: '4. Phơi đu đủ xanh đến khi héo', en: '4. Sun-dry green papaya until wilted' },
            { vi: '5. Trộn mắm với đu đủ và ớt dầm', en: '5. Mix sauce with papaya and pickled chili' },
        ],
        products: [
            { name: { vi: 'Mắm cá hố đu đủ 500g', en: 'Hairtail papaya sauce 500g' }, price: '100,000₫' },
            { name: { vi: 'Mắm cá hố nguyên chất', en: 'Pure hairtail sauce' }, price: '80,000₫' },
        ],
        tips: {
            vi: [
                'Chọn mắm có màu đỏ đẹp, không chua',
                'Đu đủ phải khô vừa, không quá rang',
                'Bảo quản trong tủ lạnh sau khi mở',
            ],
            en: [
                'Choose sauce with beautiful red color, not sour',
                'Papaya should be moderately dry, not over-dried',
                'Store in refrigerator after opening',
            ]
        },
    },
    {
        id: 'banh-ep-an-bang',
        title: {
            vi: 'Bánh Ép An Bằng',
            en: 'An Bang Pressed Cake'
        },
        description: {
            vi: 'Bánh ép là món quà vặt dân dã gắn với ký ức tuổi thơ của người dân làng biển. Bánh mỏng, dai nhẹ, rìa giòn, ăn nóng với rau sống và nước mắm ớt.',
            en: 'Pressed cake is a rustic snack tied to childhood memories of coastal villagers. The thin, slightly chewy cake with crispy edges is best served hot with fresh vegetables and chili fish sauce.'
        },
        images: [
            '/images/crafts/banh-ep-1.jpg',
            '/images/crafts/banh-ep-2.jpg',
            '/images/crafts/banh-ep-3.jpg',
        ],
        location: {
            vi: 'Làng An Bằng, Xã Phú Vinh',
            en: 'An Bang Village, Phu Vinh Commune'
        },
        category: {
            vi: 'Bánh',
            en: 'Cake'
        },
        coordinates: { lat: 16.4750, lng: 107.7200 },
        history: {
            vi: 'Từ món quà vặt trước cổng trường, bánh ép đã trở thành nét văn hóa ẩm thực đặc trưng của An Bằng. Nghề làm bánh ép được xem là di sản văn hóa phi vật thể của địa phương.',
            en: 'From a snack sold at school gates, pressed cake has become a distinctive culinary culture of An Bang. The craft is considered an intangible cultural heritage of the locality.'
        },
        process: [
            { vi: '1. Pha bột năng loãng', en: '1. Mix tapioca starch thinly' },
            { vi: '2. Đổ vào khuôn gang nóng', en: '2. Pour into hot iron mold' },
            { vi: '3. Thêm trứng, thịt, hành lá', en: '3. Add egg, meat, green onion' },
            { vi: '4. Ép mỏng trên bếp than', en: '4. Press thin over charcoal stove' },
            { vi: '5. Lật và ép đến khi giòn viền', en: '5. Flip and press until edges crispy' },
        ],
        products: [
            { name: { vi: 'Bánh ép trứng', en: 'Pressed cake with egg' }, price: '10,000₫' },
            { name: { vi: 'Bánh ép thịt', en: 'Pressed cake with meat' }, price: '15,000₫' },
            { name: { vi: 'Bánh ép đặc biệt', en: 'Special pressed cake' }, price: '20,000₫' },
        ],
        tips: {
            vi: [
                'Ăn nóng ngay khi mới làm xong',
                'Cuốn với rau sống và dưa chua',
                'Chấm nước mắm ớt cay nồng',
            ],
            en: [
                'Best eaten hot right after making',
                'Roll with fresh vegetables and pickles',
                'Dip in spicy chili fish sauce',
            ]
        },
    },
];


// ============================================
// FOOD DATA
// ============================================

export interface FoodData {
    id: string;
    title: BilingualText;
    description: BilingualText;
    location: BilingualText;
    category: BilingualText;
    coordinates: { lat: number; lng: number };
    dishes: BilingualArray;
    tips: BilingualText;
    images: string[];
}

export const foods: FoodData[] = [
    {
        id: 'hai-san-vinh-thanh',
        title: {
            vi: 'Hải sản tươi sống Vinh Thanh',
            en: 'Fresh Seafood at Vinh Thanh'
        },
        description: {
            vi: 'Hải sản được đánh bắt trực tiếp từ biển Vinh Thanh, đảm bảo tươi ngon và giá cả phải chăng. Du khách có thể mua hải sản tại bến cá hoặc thưởng thức tại các quán ăn ven biển.',
            en: 'Seafood caught directly from Vinh Thanh sea, ensuring freshness and affordable prices. Visitors can buy seafood at the fishing pier or enjoy it at beachside restaurants.'
        },
        location: {
            vi: 'Bến cá Vinh Thanh, Xã Phú Vinh',
            en: 'Vinh Thanh Fishing Pier, Phu Vinh Commune'
        },
        category: {
            vi: 'Hải sản',
            en: 'Seafood'
        },
        coordinates: { lat: 16.4850, lng: 107.7150 },
        dishes: {
            vi: ['Tôm hùm', 'Cua', 'Cá biển', 'Mực', 'Ghẹ'],
            en: ['Lobster', 'Crab', 'Sea fish', 'Squid', 'Swimming crab']
        },
        tips: {
            vi: 'Nên đến sớm vào buổi sáng khi thuyền cá về bến để mua được hải sản tươi nhất.',
            en: 'Arrive early in the morning when fishing boats return to get the freshest seafood.'
        },
        images: [
            '/images/food/hai-san-vinh-thanh-1.jpg',
            '/images/food/hai-san-vinh-thanh-2.jpg',
            '/images/food/hai-san-vinh-thanh-3.jpg',
            '/images/food/hai-san-vinh-thanh-4.jpg',
            '/images/food/hai-san-vinh-thanh-5.jpg',
        ]
    },
    {
        id: 'mam-phu-dien',
        title: {
            vi: 'Đặc sản mắm Phú Diên',
            en: 'Phu Dien Fermented Fish Specialties'
        },
        description: {
            vi: 'Các loại mắm truyền thống của làng chài Phú Diên như mắm ruốc, mắm tôm, mắm cá. Đây là gia vị không thể thiếu trong bữa ăn của người dân địa phương.',
            en: 'Traditional fermented products from Phu Dien fishing village including shrimp paste and fish sauce. These are essential seasonings in local cuisine.'
        },
        location: {
            vi: 'Chợ Phú Diên, Xã Phú Vinh',
            en: 'Phu Dien Market, Phu Vinh Commune'
        },
        category: {
            vi: 'Đặc sản',
            en: 'Specialty'
        },
        coordinates: { lat: 16.4950, lng: 107.7050 },
        dishes: {
            vi: ['Mắm ruốc', 'Mắm tôm', 'Mắm nêm', 'Mắm cá'],
            en: ['Shrimp paste', 'Shrimp sauce', 'Fermented fish dip', 'Fish sauce']
        },
        tips: {
            vi: 'Mắm Phú Diên có thể mua làm quà, được đóng gói cẩn thận để mang về.',
            en: 'Phu Dien fish sauce makes a great gift, carefully packaged for travel.'
        },
        images: [
            '/images/food/mam-phu-dien-1.jpg',
            '/images/food/mam-phu-dien-2.jpg',
            '/images/food/mam-phu-dien-3.jpg',
            '/images/food/mam-phu-dien-4.jpg',
            '/images/food/mam-phu-dien-5.jpg',
        ]
    },
    {
        id: 'nuoc-ot-vinh-xuan',
        title: {
            vi: 'Nước ớt Vinh Xuân',
            en: 'Vinh Xuan Chili Sauce'
        },
        description: {
            vi: 'Nước ớt truyền thống nổi tiếng của làng Vinh Xuân, được làm từ ớt tươi trồng tại địa phương. Vị cay nồng đặc trưng, thơm ngon.',
            en: 'Famous traditional chili sauce from Vinh Xuan village, made from locally grown fresh chilies. Known for its distinctive spicy and aromatic flavor.'
        },
        location: {
            vi: 'Làng Vinh Xuân, Xã Phú Vinh',
            en: 'Vinh Xuan Village, Phu Vinh Commune'
        },
        category: {
            vi: 'Gia vị',
            en: 'Condiment'
        },
        coordinates: { lat: 16.4800, lng: 107.7100 },
        dishes: {
            vi: ['Nước ớt tươi', 'Ớt bột', 'Tương ớt'],
            en: ['Fresh chili sauce', 'Chili powder', 'Chili paste']
        },
        tips: {
            vi: 'Nên hỏi mua trực tiếp từ các hộ gia đình làm nghề để có sản phẩm chất lượng nhất.',
            en: 'Buy directly from local households for the highest quality products.'
        },
        images: [
            '/images/food/nuoc-ot-vinh-xuan-1.jpg',
            '/images/food/nuoc-ot-vinh-xuan-2.jpg',
            '/images/food/nuoc-ot-vinh-xuan-3.jpg',
            '/images/food/nuoc-ot-vinh-xuan-4.jpg',
            '/images/food/nuoc-ot-vinh-xuan-5.jpg',
        ]
    },
    {
        id: 'quan-an-lang-chai',
        title: {
            vi: 'Quán ăn làng chài',
            en: 'Fishing Village Restaurants'
        },
        description: {
            vi: 'Các quán ăn nhỏ ven biển phục vụ món ăn địa phương với giá bình dân. Hải sản tươi được chế biến đơn giản nhưng giữ nguyên hương vị biển.',
            en: 'Small beachside eateries serving local dishes at affordable prices. Fresh seafood is prepared simply to preserve the ocean flavor.'
        },
        location: {
            vi: 'Ven biển Vinh Thanh, Phú Diên',
            en: 'Vinh Thanh & Phu Dien Beachfront'
        },
        category: {
            vi: 'Quán ăn',
            en: 'Restaurant'
        },
        coordinates: { lat: 16.4900, lng: 107.7100 },
        dishes: {
            vi: ['Cá nướng', 'Nghêu hấp', 'Canh chua cá', 'Gỏi cá'],
            en: ['Grilled fish', 'Steamed clams', 'Sour fish soup', 'Fish salad']
        },
        tips: {
            vi: 'Món ăn thường được chế biến theo yêu cầu, du khách có thể chọn hải sản tươi và dặn cách nấu.',
            en: 'Dishes are often prepared to order. Visitors can choose fresh seafood and specify cooking methods.'
        },
        images: [
            '/images/food/quan-an-lang-chai-1.jpg',
            '/images/food/quan-an-lang-chai-2.jpg',
            '/images/food/quan-an-lang-chai-3.jpg',
            '/images/food/quan-an-lang-chai-4.jpg',
            '/images/food/quan-an-lang-chai-5.jpg',
        ]
    },
];

// ============================================
// COMMON TRANSLATIONS
// ============================================

export const commonTranslations = {
    // Page sections
    'section.intro': { vi: 'Giới thiệu', en: 'Introduction' },
    'section.highlights': { vi: 'Điểm nổi bật', en: 'Highlights' },
    'section.tips': { vi: 'Mẹo du lịch', en: 'Travel Tips' },
    'section.map': { vi: 'Bản đồ', en: 'Map' },
    'section.history': { vi: 'Lịch sử & Truyền thống', en: 'History & Tradition' },
    'section.process': { vi: 'Quy trình sản xuất', en: 'Production Process' },
    'section.products': { vi: 'Sản phẩm & Giá', en: 'Products & Prices' },
    'section.buyTips': { vi: 'Mẹo mua hàng', en: 'Buying Tips' },
    'section.dishes': { vi: 'Món ăn / Sản phẩm', en: 'Dishes / Products' },
    'section.location': { vi: 'Vị trí', en: 'Location' },

    // Buttons
    'button.directions': { vi: 'Chỉ đường', en: 'Directions' },
    'button.details': { vi: 'Chi tiết', en: 'Details' },
    'button.askAI': { vi: 'Hỏi AI', en: 'Ask AI' },
    'button.close': { vi: 'Đóng', en: 'Close' },
    'button.getDirections': { vi: 'Chỉ đường đến đây', en: 'Get Directions' },

    // Labels
    'label.cost': { vi: 'Chi phí', en: 'Cost' },
    'label.hours': { vi: 'Giờ mở cửa', en: 'Opening Hours' },
    'label.viewDetails': { vi: 'Xem chi tiết', en: 'View Details' },
    'label.updating': { vi: 'Ảnh đang cập nhật', en: 'Image updating' },
};

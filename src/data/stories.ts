// Story content for each location - Vietnamese heritage narratives
// Used by AI Story Mode with TTS

export interface StoryContent {
    locationId: string;
    title: { vi: string; en: string };
    story: { vi: string; en: string };
    duration: number; // Estimated reading time in seconds
}

export const stories: StoryContent[] = [
    {
        locationId: 'thap-cham',
        title: {
            vi: 'Tháp Chăm Phú Diên - Di sản ngàn năm',
            en: 'Phu Dien Cham Tower - A Thousand-Year Heritage',
        },
        story: {
            vi: `Tháp Chăm Phú Diên là một kỳ quan kiến trúc có niên đại từ thế kỷ thứ VIII. Đây là công trình Champa cổ nhất còn tồn tại dọc miền Trung Việt Nam.

Được phát hiện vào năm 2001, tháp nằm vùi sâu từ 5 đến 7 mét dưới cồn cát ven biển. Điều đặc biệt là tháp chỉ cách mép nước biển 120 mét, trở thành ngôi tháp cổ gần biển nhất trên thế giới.

Người xưa đã xây dựng tháp bằng gạch nung với kỹ thuật tinh xảo. Các viên gạch được gắn kết mà không cần vữa, một bí ẩn khiến các nhà khoa học đến nay vẫn chưa giải đáp được.

Tháp Chăm Phú Diên không chỉ là di tích lịch sử mà còn là chứng nhân cho nền văn minh Champa rực rỡ một thời tại vùng đất này.`,
            en: `Phu Dien Cham Tower is an architectural wonder dating back to the 8th century. It is the oldest surviving Champa structure along Central Vietnam.

Discovered in 2001, the tower was buried 5 to 7 meters deep under coastal sand dunes. Remarkably, it stands only 120 meters from the shoreline, making it the ancient tower closest to the sea in the world.

The ancients built the tower using fired bricks with exquisite technique. The bricks are joined without mortar, a mystery that scientists still cannot explain today.

Phu Dien Cham Tower is not just a historical site but also a witness to the once-glorious Champa civilization in this land.`,
        },
        duration: 60,
    },
    {
        locationId: 'bien-vinh-thanh',
        title: {
            vi: 'Biển Vinh Thanh - Bình minh tuyệt đẹp',
            en: 'Vinh Thanh Beach - Beautiful Sunrise',
        },
        story: {
            vi: `Biển Vinh Thanh là một trong những bãi biển hoang sơ và đẹp nhất của xã Phú Vinh. Nơi đây nổi tiếng với bình minh tuyệt đẹp và làng chài truyền thống.

Mỗi sáng sớm, khi mặt trời vừa ló dạng, những chiếc thuyền cá nhỏ của ngư dân bắt đầu trở về sau một đêm đánh bắt. Cảnh tượng này đã trở thành biểu tượng của vùng biển Vinh Thanh.

Bãi cát trải dài, nước biển trong xanh là điểm đến lý tưởng cho những ai yêu thích sự yên bình. Du khách có thể tham gia cùng ngư dân ra khơi, tìm hiểu về nghề đánh cá truyền thống.

Đặc biệt, hải sản tươi sống được bán ngay tại bến, với giá cả phải chăng và chất lượng tuyệt vời.`,
            en: `Vinh Thanh Beach is one of the most pristine and beautiful beaches in Phu Vinh commune. It is famous for its stunning sunrise and traditional fishing village.

Every early morning, as the sun begins to rise, small fishing boats of the fishermen start returning after a night of fishing. This scene has become a symbol of the Vinh Thanh sea area.

The long sandy beach and crystal-clear water make it an ideal destination for those who love tranquility. Visitors can join fishermen to go out to sea and learn about traditional fishing.

Especially, fresh seafood is sold right at the dock, with affordable prices and excellent quality.`,
        },
        duration: 50,
    },
    {
        locationId: 'bien-phu-dien',
        title: {
            vi: 'Biển Phú Diên - Làng chài truyền thống',
            en: 'Phu Dien Beach - Traditional Fishing Village',
        },
        story: {
            vi: `Biển Phú Diên gắn liền với làng chài có lịch sử hàng trăm năm. Những chiếc thuyền đánh cá gỗ đầy màu sắc là nét đặc trưng không thể nhầm lẫn của vùng đất này.

Ngư dân Phú Diên vẫn giữ nguyên những kỹ thuật đánh bắt truyền thống được truyền từ đời này sang đời khác. Họ thức dậy từ 3 giờ sáng, ra khơi với những chiếc thuyền nhỏ, và trở về khi bình minh lên.

Bên cạnh nghề đánh cá, người dân nơi đây còn nổi tiếng với nghề làm mắm truyền thống. Mắm Phú Diên được ủ theo công thức gia truyền, có hương vị đậm đà không nơi nào sánh được.

Đến Phú Diên, bạn sẽ cảm nhận được nhịp sống chậm rãi, thanh bình của một làng chài miền Trung đích thực.`,
            en: `Phu Dien Beach is closely tied to a fishing village with hundreds of years of history. Colorful wooden fishing boats are an unmistakable characteristic of this land.

Phu Dien fishermen still maintain traditional fishing techniques passed down from generation to generation. They wake up at 3 AM, go to sea with small boats, and return at sunrise.

Besides fishing, the people here are also famous for traditional fish sauce making. Phu Dien fish sauce is fermented according to family recipes, with a rich flavor unmatched anywhere else.

Coming to Phu Dien, you will feel the slow, peaceful rhythm of an authentic Central Vietnam fishing village.`,
        },
        duration: 55,
    },
    {
        locationId: 'dam-tam-giang',
        title: {
            vi: 'Đầm Tam Giang - Đầm phá lớn nhất Đông Nam Á',
            en: 'Tam Giang Lagoon - Largest Lagoon in Southeast Asia',
        },
        story: {
            vi: `Đầm Tam Giang là đầm phá nước lợ lớn nhất Đông Nam Á, trải dài qua nhiều xã của tỉnh Thừa Thiên Huế. Một phần của đầm thuộc về xã Phú Vinh mới thành lập.

Hoàng hôn trên đầm Tam Giang được mệnh danh là một trong những cảnh đẹp nhất Việt Nam. Khi mặt trời lặn, ánh sáng vàng rực phản chiếu trên mặt nước tĩnh lặng tạo nên bức tranh tuyệt mỹ.

Đầm là nơi sinh sống của hàng nghìn loài thủy sản. Người dân sống trên những ngôi nhà nổi, mưu sinh bằng nghề đánh bắt và nuôi trồng thủy sản.

Du khách có thể thuê thuyền dạo quanh đầm, thưởng thức hải sản tươi ngon được chế biến ngay trên thuyền, và chiêm ngưỡng vẻ đẹp hoang sơ của vùng đất này.`,
            en: `Tam Giang Lagoon is the largest brackish water lagoon in Southeast Asia, stretching across many communes of Thua Thien Hue province. Part of the lagoon belongs to the newly established Phu Vinh commune.

The sunset over Tam Giang Lagoon is considered one of the most beautiful scenes in Vietnam. When the sun sets, golden light reflects on the calm water surface creating a magnificent picture.

The lagoon is home to thousands of aquatic species. People live in floating houses, making a living by fishing and aquaculture.

Visitors can rent boats to cruise around the lagoon, enjoy fresh seafood prepared right on the boat, and admire the pristine beauty of this land.`,
        },
        duration: 55,
    },
    {
        locationId: 'lang-an-bang',
        title: {
            vi: 'Làng An Bằng - Thành phố của người đã khuất',
            en: 'An Bang Village - City of the Departed',
        },
        story: {
            vi: `Làng An Bằng nổi tiếng quốc tế với khu lăng mộ độc đáo được mệnh danh là "Thành phố lăng" hay "Thành phố ma". Hàng nghìn ngôi mộ được xây dựng công phu như những cung điện thu nhỏ.

Theo quan niệm của người dân An Bằng, xây nhà cho người đã khuất còn quan trọng hơn nhà cho người sống. Họ tin rằng tổ tiên sẽ phù hộ cho con cháu nếu được an nghỉ trong những ngôi mộ đẹp đẽ.

Nhiều lăng mộ có giá trị lên đến hàng tỷ đồng, với kiến trúc pha trộn giữa Gothic, Roman và phong cách Á Đông. Một số lăng còn lắp đặt điều hòa, đèn chùm và nội thất sang trọng.

Năm 1645, Lễ hội Cầu Ngư đua thuyền truyền thống lần đầu tiên được tổ chức tại đây, và vẫn được duy trì đến ngày nay.`,
            en: `An Bang Village is internationally famous for its unique tomb complex known as the "City of Tombs" or "Ghost City". Thousands of tombs are elaborately built like miniature palaces.

According to An Bang people's beliefs, building houses for the departed is more important than houses for the living. They believe that ancestors will bless their descendants if they rest in beautiful tombs.

Many tombs are worth billions of dong, with architecture blending Gothic, Roman and Asian styles. Some tombs even have air conditioning, chandeliers and luxurious furniture.

In 1645, the traditional Cau Ngu boat racing festival was first held here, and is still maintained to this day.`,
        },
        duration: 60,
    },
    {
        locationId: 'dinh-ha-thanh',
        title: {
            vi: 'Đình Hà Thanh - Di tích lịch sử cấp tỉnh',
            en: 'Ha Thanh Communal House - Provincial Historical Site',
        },
        story: {
            vi: `Đình Hà Thanh là ngôi đình cổ có giá trị lịch sử và văn hóa quan trọng của xã Phú Vinh. Năm 2024, đình được UBND tỉnh Thừa Thiên Huế xếp hạng di tích lịch sử cấp tỉnh.

Kiến trúc đình mang đậm dấu ấn truyền thống Việt Nam với mái ngói cổ kính, những cột gỗ lim vững chãi và họa tiết chạm khắc tinh xảo. Đình được xây dựng để thờ các vị thần bảo hộ làng xã.

Hàng năm, người dân Hà Thanh tổ chức lễ hội tại đình để tưởng nhớ công ơn tổ tiên và cầu mong mùa màng bội thu, làng xóm bình an.

Đình Hà Thanh không chỉ là nơi sinh hoạt tâm linh mà còn là trung tâm văn hóa, nơi lưu giữ những giá trị truyền thống của làng quê Việt Nam.`,
            en: `Ha Thanh Communal House is an ancient temple with important historical and cultural value in Phu Vinh commune. In 2024, it was classified as a provincial-level historical site by Thua Thien Hue Provincial People's Committee.

The temple architecture bears the traditional Vietnamese style with ancient tile roofs, sturdy ironwood pillars and exquisite carvings. The temple was built to worship the guardian deities of the village.

Every year, Ha Thanh villagers hold festivals at the temple to commemorate their ancestors and pray for bountiful harvests and peaceful villages.

Ha Thanh Communal House is not only a place for spiritual activities but also a cultural center, preserving the traditional values of Vietnamese villages.`,
        },
        duration: 50,
    },
    {
        locationId: 'nuoc-ot-vinh-xuan',
        title: {
            vi: 'Làng Vinh Xuân - Nước ớt truyền thống',
            en: 'Vinh Xuan Village - Traditional Chili Sauce',
        },
        story: {
            vi: `Làng Vinh Xuân nổi tiếng khắp cả nước với nghề làm nước ớt truyền thống đã có từ hàng trăm năm. Đây là gia vị không thể thiếu trong bữa ăn của người Huế.

Nước ớt Vinh Xuân được làm từ những quả ớt tươi được tuyển chọn kỹ lưỡng, kết hợp với tỏi, đường và muối theo công thức bí truyền. Quá trình ủ lên men tự nhiên tạo nên hương vị đậm đà đặc trưng.

Mỗi gia đình trong làng đều có bí quyết riêng được truyền từ đời này sang đời khác. Chính sự khác biệt này tạo nên sự đa dạng trong hương vị nước ớt Vinh Xuân.

Du khách đến đây có thể tham quan quy trình sản xuất, nếm thử các loại nước ớt khác nhau và mua về làm quà. Nước ớt Vinh Xuân đã trở thành đặc sản nổi tiếng của vùng đất Huế.`,
            en: `Vinh Xuan Village is famous throughout the country for its traditional chili sauce making craft that has existed for hundreds of years. This is an essential condiment in the meals of Hue people.

Vinh Xuan chili sauce is made from carefully selected fresh chili peppers, combined with garlic, sugar and salt according to secret recipes. The natural fermentation process creates a distinctive rich flavor.

Each family in the village has their own secret passed down from generation to generation. This difference creates diversity in the flavor of Vinh Xuan chili sauce.

Visitors can tour the production process, taste different types of chili sauce and buy them as gifts. Vinh Xuan chili sauce has become a famous specialty of the Hue region.`,
        },
        duration: 50,
    },
];

// Get story by location ID
export function getStoryByLocationId(locationId: string): StoryContent | undefined {
    return stories.find((s) => s.locationId === locationId);
}

// Get all location IDs that have stories
export function getLocationsWithStories(): string[] {
    return stories.map((s) => s.locationId);
}

'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Map, BookOpen, Compass, Palmtree, Castle, Anchor, HelpCircle, Save, PenTool, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/components/providers/language-provider';

// Dữ liệu nội dung các chặng
const JOURNEY_STAGES = [
  {
    id: 'stage1',
    title: 'Di sản lịch sử - văn hóa',
    icon: Castle,
    locations: [
      {
        name: 'Tháp Chăm Phú Diên (Tháp Mỹ Khánh)',
        content: 'Là công trình kiến trúc Champa cổ có niên đại thế kỷ VIII, cổ nhất dải miền Trung. Phát hiện tình cờ năm 2001 khi bị vùi sâu dưới cồn cát 5-7m. Tháp nằm thấp hơn mực nước biển 3-4m, cách mép nước 120m (gần biển nhất). Kiến trúc hình chữ nhật (8,2m x 7,1m), đặc trưng tháp Lùn. Tháng 6/2022, được xác lập Kỷ lục Việt Nam và Thế giới: "Tháp Champa cổ bằng gạch chìm sâu dưới cồn cát ven biển được khai quật và bảo tồn đầu tiên".',
        discovery: [
          'Vì sao Tháp Chăm Phú Diên được xem là di sản đặc biệt?',
          'Em ấn tượng nhất với chi tiết nào của ngôi tháp?'
        ],
        image: '/img-notebook/thap-cham-phu-dien-1.jpg'
      },
      {
        name: 'Đình làng Hà Thanh',
        content: 'Thuộc thôn 3, xã Phú Vinh. Xây dựng từ thời chúa Nguyễn (cuối thế kỷ XVI), gắn với công cuộc mở cõi xứ Đàng Trong. Xây dựng khang trang năm Gia Long thứ 2 (1803). Mang đậm kiến trúc đình làng xứ Huế, là chứng tích lịch sử của vùng quê làm muối và đánh bắt thủy sản. Ngày 21/03/2024, được xếp hạng Di tích lịch sử cấp tỉnh.',
        discovery: [
          'Đình làng có vai trò gì trong đời sống cộng đồng?',
          'Theo em, vì sao cần bảo tồn Đình Hà Thanh?'
        ],
        image: '/img-notebook/dinh-ha-thanh-1.jpg'
      }
    ]
  },
  {
    id: 'stage2',
    title: 'Biển đẹp và cảnh quan địa phương',
    icon: Palmtree,
    locations: [
      {
        name: 'Bãi biển Vinh Thanh',
        content: 'Cát trắng mịn, nước trong xanh, vẻ đẹp hoang sơ, bình yên. Gắn bó mật thiết với đời sống sinh hoạt và nghề biển của ngư dân.',
        discovery: [
          'Em thích điều gì nhất ở bãi biển Vinh Thanh?',
          'Cần làm gì để bảo vệ môi trường biển?'
        ],
        image: '/img-notebook/bien-vinh-thanh-1.jpg'
      },
      {
        name: 'Biển Phú Diên',
        content: 'Cách trung tâm TP. Huế 30km. Vẻ đẹp tự nhiên, thoáng đãng. Điểm thú vị là có thể kết hợp tắm biển và tham quan Tháp Chăm Phú Diên.',
        discovery: [
          'Nếu giới thiệu biển Phú Diên cho bạn bè, em sẽ nói điều gì đầu tiên?',
          'Vì sao biển Phú Diên có tiềm năng du lịch?'
        ],
        image: '/img-notebook/bien-phu-dien-2.jpg'
      },
      {
        name: 'Khu lăng mộ làng An Bằng',
        content: 'Cách trung tâm TP 35km. Nghĩa trang nổi tiếng với hàng nghìn lăng mộ xa hoa, tráng lệ bậc nhất Việt Nam. Rộng 40ha dọc bờ biển. Giá trị nổi bật ở kiến trúc, nghệ thuật khảm sành sứ và lòng hiếu kính tổ tiên.',
        discovery: [
          'Điều gì làm khu lăng mộ An Bằng khác với các điểm du lịch thông thường?',
          'Em cảm nhận gì về ý nghĩa văn hóa của nơi này?'
        ],
        image: '/img-notebook/lang-an-bang-1.png'
      }
    ]
  },
  {
    id: 'stage3',
    title: 'Lễ hội truyền thống',
    icon: Anchor,
    locations: [
      {
        name: 'Lễ hội Cầu Ngư',
        content: 'Nét văn hóa gắn với tín ngưỡng thờ Cá Ông, ước mong mưa thuận gió hòa. Gồm nghi thức cúng tế trang nghiêm và đua thuyền trên biển. Riêng tại làng An Bằng, tục này có gần 500 năm lịch sử và từng được triều Nguyễn sắc phong.',
        discovery: [
          'Lễ hội Cầu Ngư có ý nghĩa gì? Em thích nhất hoạt động nào?'
        ],
        image: '/img-notebook/le-hoi-cau-ngu-1.jpg'
      },
      {
        name: 'Đua ghe nan làng Phương Diên',
        content: 'Nguồn gốc thế kỷ XVII, tổ chức "tam niên đáo lệ" (3 năm 1 lần), 5 độ đua, luật "3 vòng 6 tráo". Năm 2020, VietKings xác lập Kỷ lục lễ hội đua ghe nan truyền thống biển duy trì lâu đời nhất.',
        discovery: [
          'Em cảm nhận gì về tinh thần người dân qua hội đua?'
        ],
        image: '/img-notebook/le-hoi-cau-ngu-3.jpg'
      }
    ]
  },
  {
    id: 'stage4',
    title: 'Làng nghề và hương vị',
    icon: Compass,
    locations: [
      {
        name: 'Hương Vị Quê Hương',
        content: 'Tạo sinh kế và lưu giữ văn hóa ẩm thực vùng biển. Tiêu biểu: Nước mắm Phú Diên, Nước ớt Vinh Xuân, Mắm cá hố An Bằng. Trở thành món quà đậm vị biển được du khách yêu thích.',
        discovery: [
          'Bạn ấn tượng với sản phẩm đặc sản nào nhất tại Phú Vinh?'
        ],
        image: '/img-notebook/dam-tam-giang-1.jpeg'
      }
    ]
  }
];

export default function InteractiveNotebook() {
  const [activeStage, setActiveStage] = useState(JOURNEY_STAGES[0].id);
  const [formData, setFormData] = useState({ q1: '', q2: '', q3: '', q4: '' });
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const currentStageData = JOURNEY_STAGES.find(s => s.id === activeStage);

  return (
    <div className="w-full bg-[#f8fcfd] dark:bg-gray-900 min-h-screen text-gray-800 dark:text-gray-200 overflow-hidden rounded-2xl shadow-xl border border-blue-100 dark:border-blue-900/30">
      
      {/* HEADER OVERLAY */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-500 to-teal-500 text-white p-8 md:p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 opacity-10">
          <Map className="w-96 h-96" />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto">
          <Badge className="bg-amber-400 text-amber-950 font-bold mb-4 px-3 py-1 text-sm border-0 uppercase tracking-widest shadow-md">
            Sổ Tay Du Lịch - Học Tập
          </Badge>
          <h1 className="text-3xl md:text-5xl font-black mb-4 leading-tight drop-shadow-md">
            KHÁM PHÁ DI SẢN <br className="hidden md:block"/> VĂN HÓA XÃ PHÚ VINH
          </h1>
          <p className="text-xl md:text-2xl font-light italic text-blue-100 mb-8 border-l-4 border-amber-400 pl-4 py-1">
            "Học để hiểu – Đi để yêu – Cùng gìn giữ di sản quê hương"
          </p>
          
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 shadow-lg">
            <p className="leading-relaxed text-blue-50">
              Xã Phú Vinh nằm ở phía Đông Nam TP. Huế, kẹp giữa Biển Đông và hệ đầm phá Tam Giang - Cầu Hai. Từ ngày 01/7/2025, xã được thành lập trên cơ sở hợp nhất: Phú Diên, Vinh Xuân, Vinh Thanh và Vinh An. Nơi đây hội tụ vẻ đẹp biển, đầm phá, các di tích, lễ hội và làng nghề lâu đời. Sổ tay này giúp học sinh và du khách khám phá những nét đẹp tiêu biểu để bồi dưỡng tình yêu và ý thức giữ gìn di sản.
            </p>
          </div>
        </div>
      </div>

      {/* TIMELINE NAV */}
      <div className="bg-white dark:bg-gray-950 border-b border-blue-100 dark:border-blue-900/30 sticky top-0 z-20 shadow-sm">
        <div className="max-w-5xl mx-auto px-4">
          <div className="w-full max-w-fit mx-auto flex overflow-x-auto hide-scrollbar py-4 gap-2 px-2 snap-x snap-mandatory">
            {JOURNEY_STAGES.map((stage, idx) => {
              const Icon = stage.icon;
              const isActive = activeStage === stage.id;
              return (
                <button
                  key={stage.id}
                  onClick={() => setActiveStage(stage.id)}
                  className={`flex items-center flex-shrink-0 gap-3 px-5 py-3 rounded-full transition-all duration-300 font-semibold border-2 
                    ${isActive 
                      ? 'bg-amber-50 border-amber-400 text-amber-700 shadow-md dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-500/50' 
                      : 'bg-transparent border-transparent text-gray-500 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/20 dark:text-gray-400'}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isActive ? 'bg-amber-400 text-white' : 'bg-gray-200 dark:bg-gray-800 text-gray-400'}`}>
                    <span className="text-sm font-bold">{idx + 1}</span>
                  </div>
                  <span className="whitespace-nowrap">{stage.title}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* STAGE CONTENT */}
      <div className="max-w-5xl mx-auto px-4 lg:px-8 py-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStage}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-12"
          >
            {currentStageData?.locations.map((loc, idx) => (
              <div key={idx} className="flex flex-col lg:flex-row gap-8 items-stretch group">
                
                {/* Image Component Left/Right alternate */}
                <div className={`w-full lg:w-5/12 rounded-3xl overflow-hidden shadow-xl transition-transform duration-500 group-hover:scale-[1.02] ${idx % 2 !== 0 ? 'lg:order-2' : ''}`}>
                  <img src={loc.image} alt={loc.name} className="w-full h-full object-cover min-h-[300px]" />
                </div>

                {/* Text Content */}
                <div className={`w-full lg:w-7/12 flex flex-col justify-center ${idx % 2 !== 0 ? 'lg:order-1' : ''}`}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-lg">
                      <currentStageData.icon className="w-6 h-6" />
                    </div>
                    <h2 className="text-2xl font-bold text-blue-900 dark:text-blue-300">
                      {loc.name}
                    </h2>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg mb-6">
                    {loc.content}
                  </p>

                  {/* Góc Khám Phá Box */}
                  <div className="mt-auto bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 rounded-2xl p-6 border border-amber-200 dark:border-amber-800/50 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                      <HelpCircle className="w-16 h-16 text-amber-600" />
                    </div>
                    <div className="flex items-center gap-2 mb-3 text-amber-800 dark:text-amber-400 font-bold uppercase tracking-wide text-sm">
                      <LightbulbIcon className="w-5 h-5" />
                      Góc Khám Phá
                    </div>
                    <ul className="space-y-3 relative z-10">
                      {loc.discovery.map((q, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <span className="w-6 h-6 rounded-full bg-amber-200 dark:bg-amber-800/60 text-amber-700 dark:text-amber-300 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 shadow-sm">
                            ?
                          </span>
                          <span className="text-gray-700 dark:text-gray-300 font-medium">
                            {q}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* GÓC GHI CHÉP CỦA EM (FORM) */}
      <section className="bg-blue-50/50 dark:bg-blue-950/20 py-16 border-t border-blue-100 dark:border-blue-900/30 mt-12 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-blue-900 dark:text-blue-300 mb-3 flex items-center justify-center gap-3">
              <PenTool className="w-8 h-8 text-amber-500" />
              Góc Ghi Chép Của Em
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              Hãy lưu lại những cảm nhận và suy nghĩ của mình sau hành trình khám phá di sản Phú Vinh nhé!
            </p>
          </div>

          <Card className="shadow-2xl border-0 overflow-hidden bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl">
            {/* Lò xo sổ tay (Trang trí UI) */}
            <div className="h-4 bg-gray-200 dark:bg-gray-800 w-full flex justify-space-evenly overflow-hidden border-b border-gray-300 dark:border-gray-700 opacity-50">
               {Array.from({length: 20}).map((_, i) => (
                 <div key={i} className="w-2 h-6 bg-gray-400 rounded-full mx-2 -mt-1 shadow-sm" />
               ))}
            </div>
            
            <CardContent className="p-6 md:p-10 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-blue-800 dark:text-blue-400 uppercase tracking-wide">
                  1. Địa điểm để lại cho em nhiều ấn tượng nhất
                </label>
                <input 
                  type="text" 
                  value={formData.q1}
                  onChange={(e) => setFormData({...formData, q1: e.target.value})}
                  className="w-full border-b-2 border-dashed border-gray-300 dark:border-gray-700 bg-transparent focus:border-amber-400 outline-none py-2 text-lg font-medium text-gray-800 dark:text-gray-100 transition-colors"
                  placeholder="Nhập tên địa điểm..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-blue-800 dark:text-blue-400 uppercase tracking-wide">
                  2. Những điều em cảm nhận được sau hành trình khám phá
                </label>
                <textarea 
                  rows={3}
                  value={formData.q2}
                  onChange={(e) => setFormData({...formData, q2: e.target.value})}
                  className="w-full border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800/50 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 outline-none p-4 text-gray-800 dark:text-gray-100 transition-all resize-none leading-loose"
                  placeholder="Tôi cảm thấy..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-blue-800 dark:text-blue-400 uppercase tracking-wide">
                  3. Giá trị văn hóa của Phú Vinh mà em tâm đắc nhất
                </label>
                <textarea 
                  rows={3}
                  value={formData.q3}
                  onChange={(e) => setFormData({...formData, q3: e.target.value})}
                  className="w-full border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800/50 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 outline-none p-4 text-gray-800 dark:text-gray-100 transition-all resize-none leading-loose"
                  placeholder="Đó là giá trị về..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-blue-800 dark:text-blue-400 uppercase tracking-wide">
                  4. Cam kết của em trong việc giữ gìn di sản
                </label>
                <textarea 
                  rows={3}
                  value={formData.q4}
                  onChange={(e) => setFormData({...formData, q4: e.target.value})}
                  className="w-full border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800/50 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 outline-none p-4 text-gray-800 dark:text-gray-100 transition-all resize-none leading-loose"
                  placeholder="Tôi xin cam kết..."
                />
              </div>

              <div className="pt-6 flex justify-end">
                <Button 
                  onClick={handleSave}
                  className={`px-8 py-6 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all ${isSaved ? 'bg-green-500 hover:bg-green-600 text-white' : 'bg-amber-500 hover:bg-amber-600 text-white'}`}
                >
                  {isSaved ? (
                    <span className="flex items-center gap-2">✓ Đã Lưu Thành Công</span>
                  ) : (
                    <span className="flex items-center gap-2"><Save className="w-5 h-5" /> Lưu Vào Sổ Tay</span>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-blue-900 text-blue-100 py-12 px-6 text-center">
        <div className="max-w-2xl mx-auto space-y-4">
          <BookOpen className="w-10 h-10 mx-auto text-amber-400 mb-6 opacity-80" />
          <p className="text-lg md:text-xl font-medium leading-relaxed italic text-blue-50">
            "Phú Vinh không chỉ đẹp bởi biển xanh, đầm phá, di tích cổ... mà còn đẹp bởi tình người. Mỗi học sinh hôm nay hãy là một người khám phá, một người kể chuyện và một người cùng chung tay bảo vệ di sản quê hương."
          </p>
          <div className="pt-8 mt-8 border-t border-blue-800/50 text-sm text-blue-300/80">
            <p className="font-bold">Nhóm tác giả: Trần Lê Tâm Chi lớp 6/3 và Lê Thị Ngọc Tuyết lớp 9/1</p>
            <p>Trường THCS An Bằng - Vinh An</p>
            <p className="mt-2">Giáo viên hướng dẫn: Cao Thị Lan, Đỗ Thị Hiền</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Icon helper
function LightbulbIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.9 1.2 1.5 1.5 2.5" />
      <path d="M9 18h6" />
      <path d="M10 22h4" />
    </svg>
  );
}
// Fix for TS Badge error in case it's not imported correctly 
// Re-import Badge if needed, but we already have Badge locally? Wait, I didn't import Badge!

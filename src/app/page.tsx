'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Landmark, MapPin, BookOpen, Video,
  Map, HelpCircle, FileText, Image as ImageIcon,
  MessageSquare, Users, Cpu, Play
} from 'lucide-react';
import { useLanguage } from '@/components/providers/language-provider';
import { EditableResource } from '@/components/cms/EditableResource';

// Bilingual content
const content = {
  hero: {
    badge: { vi: 'Dự án học liệu địa phương', en: 'Local Learning Project' },
    title: {
      vi: 'Xây dựng bộ học liệu di sản văn hóa xã Phú Vinh phục vụ dạy học tích hợp ở trường THCS và góp phần quảng bá du lịch địa phương',
      en: 'Building Phu Vinh Cultural Heritage Learning Materials for Integrated Teaching and Tourism Promotion'
    },
    subtitle: {
      vi: 'Khám phá vẻ đẹp văn hóa quê hương qua học liệu số, sổ tay du lịch – học tập, hình ảnh tư liệu, hoạt động trải nghiệm và sản phẩm sáng tạo của học sinh.',
      en: 'Explore the beauty of homeland culture through digital learning materials, travel-study notebooks, documentary images, experiential activities and creative student products.'
    },
    btn1: { vi: 'Khám phá di sản', en: 'Explore Heritage' },
    btn2: { vi: 'Mở sổ tay', en: 'Open Notebook' },
  },
  intro: {
    title: { vi: 'Giới thiệu ngắn', en: 'Brief Introduction' },
    desc: {
      vi: 'Website được xây dựng nhằm hỗ trợ giáo viên và học sinh tìm hiểu, khai thác, trải nghiệm và vận dụng các giá trị di sản văn hóa Phú Vinh trong dạy học tích hợp. Nội dung được thiết kế gọn, trực quan, hiện đại và dễ sử dụng trong cả học trên lớp lẫn hoạt động trải nghiệm.',
      en: 'This website is built to support teachers and students in exploring, utilizing, experiencing and applying Phu Vinh cultural heritage values in integrated teaching. Content is designed to be concise, visual, modern and easy to use in both classroom and experiential activities.'
    },
    audience: { vi: 'Đối tượng sử dụng', en: 'Target Users' },
    audienceDesc: {
      vi: 'Học sinh, giáo viên, phụ huynh và người quan tâm đến di sản địa phương.',
      en: 'Students, teachers, parents and those interested in local heritage.'
    },
    goal: { vi: 'Mục tiêu', en: 'Objectives' },
    goalDesc: {
      vi: 'Góp phần giáo dục tình yêu quê hương, ý thức gìn giữ và lan tỏa giá trị di sản văn hóa.',
      en: 'Contributing to educating love of homeland, awareness of preserving and spreading cultural heritage values.'
    },
  },
  featured: {
    title: { vi: 'Chuyên mục nổi bật', en: 'Featured Categories' },
    desc: {
      vi: 'Bố cục được sắp xếp theo nhóm nội dung chính để người xem dễ theo dõi, không bị rối và thuận tiện khi trình bày sản phẩm dự thi.',
      en: 'Layout organized by main content groups for easy viewing and convenient presentation of competition products.'
    },
  },
  heritage: {
    title: { vi: 'Những giá trị di sản tiêu biểu', en: 'Outstanding Heritage Values' },
    desc: {
      vi: 'Các điểm đến mang đậm dấu ấn lịch sử, văn hóa và tín ngưỡng của vùng đất Phú Vang, Thừa Thiên Huế.',
      en: 'Destinations bearing deep marks of history, culture and beliefs of Phu Vang land, Thua Thien Hue.'
    },
  },
  learning: {
    title: { vi: 'Học liệu tương tác', en: 'Interactive Learning Materials' },
    desc: {
      vi: 'Phần này thể hiện rõ tính sáng tạo của đề tài: học sinh có thể xem, đọc, chơi, tải và tham gia tương tác ngay trên website.',
      en: 'This section clearly demonstrates creativity: students can view, read, play, download and interact directly on the website.'
    },
  },
  video: {
    title: { vi: 'Video giới thiệu xã Phú Vinh', en: 'Phu Vinh Introduction Video' },
    subtitle: { vi: 'Khám phá vẻ đẹp thiên nhiên và văn hóa địa phương', en: 'Discover the natural beauty and local culture' },
  },
  notebook: {
    badge: { vi: 'SỔ TAY DU LỊCH – HỌC TẬP', en: 'TRAVEL-STUDY NOTEBOOK' },
    title: { vi: 'Em khám phá di sản văn hóa Phú Vinh', en: 'Exploring Phu Vinh Cultural Heritage' },
    noteDesc: {
      vi: 'Phiên bản sổ tay đồng hành, có thể in hoặc mở trên điện thoại để học sinh sử dụng khi học tập và trải nghiệm thực tế.',
      en: 'Companion notebook version, printable or viewable on phone for students during learning and real-world experiences.'
    },
    openTitle: { vi: 'Mở sổ tay và bắt đầu hành trình khám phá', en: 'Open the notebook and start exploring' },
    openDesc: {
      vi: 'Sổ tay được thiết kế theo hướng ngắn gọn, trực quan và dễ sử dụng. Mỗi phần đều gắn với nội dung học tập, nhiệm vụ trải nghiệm và câu hỏi gợi mở.',
      en: 'The notebook is designed to be concise, visual and easy to use. Each section is linked to learning content, experiential tasks and open-ended questions.'
    },
    viewBtn: { vi: 'Xem sổ tay', en: 'View Notebook' },
    downloadBtn: { vi: 'Tải PDF', en: 'Download PDF' },
  },
  students: {
    title: { vi: 'Góc sản phẩm học sinh', en: 'Student Products Corner' },
    desc: {
      vi: 'Nơi trưng bày tranh vẽ, poster, video, bài cảm nhận và kết quả học tập sau khi học sinh sử dụng bộ học liệu.',
      en: 'Display area for drawings, posters, videos, reflections and learning results after students use the learning materials.'
    },
    quote: {
      vi: 'Di sản quê hương không chỉ để ngắm nhìn',
      en: 'Homeland heritage is not just for admiring'
    },
    quoteDesc: {
      vi: 'Di sản còn là nguồn học liệu sống động để học sinh được học, được trải nghiệm, được tự hào và cùng chung tay gìn giữ những giá trị văn hóa của quê hương Phú Vinh.',
      en: 'Heritage is also a vivid learning resource for students to learn, experience, feel proud and join hands in preserving the cultural values of Phu Vinh homeland.'
    },
  },
  viewMore: { vi: 'Xem thêm →', en: 'Learn more →' },
  viewDetail: { vi: 'Xem chi tiết', en: 'View details' },
};

const fadeIn = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
  transition: { duration: 0.6 }
};

export default function HomePage() {
  const { language } = useLanguage();
  const lang = language as 'vi' | 'en';

  const featuredItems = [
    { icon: Landmark, title: { vi: 'Di sản tiêu biểu', en: 'Outstanding Heritage' }, desc: { vi: 'Khám phá những giá trị văn hóa, địa danh, câu chuyện và dấu ấn riêng của Phú Vinh.', en: 'Explore cultural values, landmarks, stories and unique marks of Phu Vinh.' }, href: '/heritage' },
    { icon: MapPin, title: { vi: 'Hành trình khám phá', en: 'Discovery Journey' }, desc: { vi: 'Theo dõi bản đồ học tập, tuyến trải nghiệm và các điểm dừng gắn với nhiệm vụ cụ thể.', en: 'Follow learning maps, experience routes and stops linked to specific tasks.' }, href: '/destinations' },
    { icon: BookOpen, title: { vi: 'Học liệu tương tác', en: 'Interactive Materials' }, desc: { vi: 'Tập hợp video, câu hỏi trực tuyến, phiếu học tập, mã QR và nội dung số dễ sử dụng.', en: 'Collection of videos, online quizzes, worksheets, QR codes and easy-to-use digital content.' }, href: '/learning' },
    { icon: FileText, title: { vi: 'Sổ tay du lịch – học tập', en: 'Travel-Study Notebook' }, desc: { vi: 'Sổ tay đồng hành cùng học sinh trong quá trình học tập, trải nghiệm và ghi chép cảm nhận.', en: 'Companion notebook for students during learning, experiences and reflection writing.' }, href: '/learning' },
  ];

  const heritageItems = [
    {
      img: '/images/heritage/dinh-ha-thanh.jpg',
      badge: { vi: 'Di sản', en: 'Heritage' },
      badgeColor: 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400',
      title: { vi: 'Đình Hà Thanh', en: 'Ha Thanh Communal House' },
      desc: { vi: 'Ngôi đình cổ kính tọa lạc tại xã Vinh Thanh, huyện Phú Vang. Đây là nơi lưu giữ những giá trị kiến trúc nghệ thuật đặc sắc và là trung tâm sinh hoạt tín ngưỡng, văn hóa truyền thống của cộng đồng dân cư địa phương.', en: 'An ancient communal house located in Vinh Thanh commune. It preserves remarkable architectural art values and serves as the center of religious and traditional cultural activities of the local community.' },
      tags: { vi: ['Kiến trúc cổ', 'Tín ngưỡng làng xã', 'Khám phá thực địa'], en: ['Ancient architecture', 'Village beliefs', 'Field exploration'] },
      href: '/heritage',
      video: 'https://drive.google.com/file/d/1UjqMzbM_g3wGlptzIS_xfyM7XZBMYoCq/preview',
    },
    {
      img: '/images/heritage/thap-cham-phu-dien.jpg',
      badge: { vi: 'Di tích Quốc gia', en: 'National Monument' },
      badgeColor: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
      title: { vi: 'Tháp Chăm Phú Diên', en: 'Phu Dien Cham Tower' },
      desc: { vi: 'Ngôi tháp Chăm độc đáo từng bị vùi sâu dưới cồn cát tại xã Phú Diên. Công trình này là minh chứng sống động cho sự giao thoa văn hóa lịch sử, cũng như nghệ thuật xây dựng bằng gạch nung tài tình của người Chăm xưa trên vùng đất Phú Vang.', en: 'A unique Cham tower once buried deep under sand dunes in Phu Dien commune. This structure is a vivid testament to cultural-historical interaction and the skillful brick construction art of ancient Cham people.' },
      tags: { vi: ['Di tích Champa', 'Khảo cổ học', 'Lịch sử địa phương'], en: ['Champa monument', 'Archaeology', 'Local history'] },
      href: '/heritage',
      video: 'https://drive.google.com/file/d/10ND6A1rlfpaPCORyCr_txFeZcbvpApLa/preview',
    },
    {
      img: '/images/destinations/le-hoi-cau-ngu-1.jpg',
      badge: { vi: 'Lễ hội Truyền thống', en: 'Traditional Festival' },
      badgeColor: 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
      title: { vi: 'Lễ hội đua ghe nan làng Phương Diên', en: 'Phuong Dien Boat Racing Festival' },
      desc: { vi: 'Nét đẹp văn hóa đặc trưng của cư dân vùng biển, thể hiện tinh thần đoàn kết, sức mạnh tập thể và khát vọng chinh phục biển cả. Lễ hội không chỉ là sân chơi thể thao mà còn mang ý nghĩa cầu mưa thuận gió hòa, mùa màng bội thu.', en: 'A distinctive cultural beauty of coastal people, expressing solidarity, collective strength and the aspiration to conquer the sea. The festival is not just a sports arena but also carries meaning of praying for favorable weather and bountiful harvests.' },
      tags: { vi: ['Văn hóa miền biển', 'Lễ hội dân gian', 'Thể thao truyền thống'], en: ['Coastal culture', 'Folk festival', 'Traditional sports'] },
      href: '/festivals',
      video: 'https://drive.google.com/file/d/15zNLb34ykxZbOqktx8f1fo5ciI0lv1CG/preview',
    },
  ];

  const learningItems = [
    { icon: Video, title: { vi: 'Video tư liệu', en: 'Documentary Videos' }, desc: { vi: 'Video ngắn giới thiệu địa danh, câu chuyện văn hóa, hoạt động trải nghiệm và sản phẩm học sinh.', en: 'Short videos introducing landmarks, cultural stories, experiential activities and student products.' }, btn: { vi: 'Xem video', en: 'Watch Videos' }, href: '/heritage' },
    { icon: Map, title: { vi: 'Bản đồ khám phá', en: 'Discovery Map' }, desc: { vi: 'Liên kết các điểm đến, tuyến học tập và nhiệm vụ tìm hiểu theo từng chủ đề di sản.', en: 'Connect destinations, learning routes and research tasks by heritage themes.' }, btn: { vi: 'Xem bản đồ', en: 'View Map' }, href: '/destinations' },
    { icon: HelpCircle, title: { vi: 'Câu hỏi tương tác', en: 'Interactive Quiz' }, desc: { vi: 'Hệ thống câu hỏi nhanh, ô chữ, đoán hình, ghép cặp và thử thách nhỏ sau mỗi nội dung.', en: 'Quick questions, crosswords, image guessing, matching and small challenges after each content.' }, btn: { vi: 'Chơi ngay', en: 'Play Now' }, href: '/learning' },
    { icon: FileText, title: { vi: 'Phiếu học tập', en: 'Worksheets' }, desc: { vi: 'Cho phép tải về hoặc mở trực tiếp các nhiệm vụ học tập, ghi chép và sản phẩm trải nghiệm.', en: 'Download or directly open learning tasks, notes and experiential products.' }, btn: { vi: 'Tải xuống', en: 'Download' }, href: '/learning' },
  ];

  const studentItems = [
    { icon: ImageIcon, title: { vi: 'Poster di sản', en: 'Heritage Posters' }, desc: { vi: 'Sản phẩm truyền thông về giá trị văn hóa địa phương.', en: 'Communication products about local cultural values.' } },
    { icon: MessageSquare, title: { vi: 'Bài cảm nhận', en: 'Reflections' }, desc: { vi: 'Những suy nghĩ của học sinh sau hành trình tìm hiểu di sản.', en: "Students' thoughts after heritage exploration journeys." } },
    { icon: Users, title: { vi: 'Hoạt động nhóm', en: 'Group Activities' }, desc: { vi: 'Quá trình làm việc nhóm, phỏng vấn, ghi chép và trải nghiệm thực tế.', en: 'Group work process, interviews, notes and real-world experiences.' } },
    { icon: Cpu, title: { vi: 'Sản phẩm số', en: 'Digital Products' }, desc: { vi: 'Infographic, video và bài trình bày do học sinh thiết kế.', en: 'Infographics, videos and presentations designed by students.' } },
  ];

  const notebookTopics = lang === 'vi'
    ? ['Giới thiệu chung về Phú Vinh', 'Các điểm di sản tiêu biểu', 'Câu chuyện văn hóa địa phương', 'Bản đồ hành trình khám phá', 'Nhiệm vụ học tập – trải nghiệm', 'Trang ghi chép và cảm nhận']
    : ['General Introduction to Phu Vinh', 'Outstanding Heritage Sites', 'Local Cultural Stories', 'Discovery Journey Map', 'Learning Tasks – Experiences', 'Notes & Reflections Pages'];

  return (
    <div className="min-h-screen">

      {/* ===== HERO SECTION ===== */}
      <section className="relative min-h-[520px] flex items-center justify-center overflow-hidden mx-4 sm:mx-8 mt-4 rounded-2xl">
        <div className="absolute inset-0 z-0">
          <EditableResource
            id="home.hero.background"
            type="image"
            defaultContent="/images/destinations/dam-tam-giang-1.jpg"
            className="w-full h-full object-cover"
            containerClassName="w-full h-full"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-black/20" />
        </div>

        <div className="relative z-10 max-w-3xl px-6 py-16 text-left">
          <motion.div {...fadeIn}>
            <span className="inline-block px-4 py-1.5 bg-[#2d5a57] text-white text-xs font-medium rounded-full mb-6">
              {content.hero.badge[lang]}
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
              {content.hero.title[lang]}
            </h1>
            <p className="text-white/80 text-base sm:text-lg mb-8 max-w-xl leading-relaxed">
              {content.hero.subtitle[lang]}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/heritage" className="px-6 py-3 bg-[#2d5a57] hover:bg-[#1e3f3d] text-white font-medium rounded-full transition-colors">
                {content.hero.btn1[lang]}
              </Link>
              <Link href="/learning" className="px-6 py-3 bg-white/20 hover:bg-white/30 text-white font-medium rounded-full border border-white/30 backdrop-blur-sm transition-colors">
                {content.hero.btn2[lang]}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== VIDEO INTRODUCTION ===== */}
      <section className="max-w-5xl mx-auto px-4 py-12">
        <motion.div {...fadeIn}>
          <div className="text-center mb-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#2d5a57]/10 dark:bg-emerald-500/20 text-[#2d5a57] dark:text-emerald-400 text-sm rounded-full mb-2">
              <Play className="w-3.5 h-3.5" /> {content.video.title[lang]}
            </span>
            <p className="text-gray-500 dark:text-gray-400 text-sm">{content.video.subtitle[lang]}</p>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-lg bg-white dark:bg-gray-800">
            <div className="relative w-full aspect-video">
              <EditableResource
                id="home.intro.video"
                type="video"
                defaultContent="https://drive.google.com/file/d/1hG_CZWQTdzvkjSXtVTGWdA0iT0VTnDBg/preview"
                containerClassName="w-full h-full aspect-video"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </motion.div>
      </section>

      {/* ===== GIỚI THIỆU NGẮN ===== */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <motion.div {...fadeIn} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-[#2d5a57] dark:text-emerald-400 mb-4">{content.intro.title[lang]}</h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{content.intro.desc[lang]}</p>
          </div>
          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border-l-4 border-[#2d5a57]">
              <h3 className="font-bold text-[#2d5a57] dark:text-emerald-400 mb-2">{content.intro.audience[lang]}</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">{content.intro.audienceDesc[lang]}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border-l-4 border-[#5a8a87]">
              <h3 className="font-bold text-[#2d5a57] dark:text-emerald-400 mb-2">{content.intro.goal[lang]}</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">{content.intro.goalDesc[lang]}</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ===== CHUYÊN MỤC NỔI BẬT ===== */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <motion.div {...fadeIn}>
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#2d5a57] dark:text-emerald-400 mb-3">{content.featured.title[lang]}</h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">{content.featured.desc[lang]}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featuredItems.map((item, i) => (
              <Link key={i} href={item.href} className="group">
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all h-full group-hover:-translate-y-1">
                  <div className="w-12 h-12 rounded-xl bg-[#2d5a57]/10 dark:bg-emerald-500/20 flex items-center justify-center mb-4">
                    <item.icon className="w-6 h-6 text-[#2d5a57] dark:text-emerald-400" />
                  </div>
                  <h3 className="font-bold text-[#2d5a57] dark:text-emerald-400 mb-2">{item.title[lang]}</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-3">{item.desc[lang]}</p>
                  <span className="text-[#2d5a57] dark:text-emerald-400 text-sm font-medium">{content.viewMore[lang]}</span>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ===== NHỮNG GIÁ TRỊ DI SẢN TIÊU BIỂU ===== */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <motion.div {...fadeIn}>
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#2d5a57] dark:text-emerald-400 mb-3">{content.heritage.title[lang]}</h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">{content.heritage.desc[lang]}</p>
          </div>
          <div className="space-y-8">
            {heritageItems.map((item, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
                <div className="grid grid-cols-1 md:grid-cols-2">
                  <div className="aspect-video md:aspect-auto relative">
                    {item.video ? (
                      item.video.includes('drive.google.com') ? (
                        <iframe
                          src={item.video}
                          allowFullScreen
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <video
                          src={item.video}
                          className="w-full h-full object-cover"
                          controls
                          preload="metadata"
                          poster={item.img}
                        />
                      )
                    ) : (
                      <img src={item.img} alt={item.title[lang]} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="p-6 sm:p-8 flex flex-col justify-center">
                    <span className={`inline-block w-fit px-3 py-1 text-xs font-medium rounded-full mb-3 ${item.badgeColor}`}>
                      {item.badge[lang]}
                    </span>
                    <h3 className="text-xl font-bold text-[#2d5a57] dark:text-emerald-400 mb-3">{item.title[lang]}</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4">{item.desc[lang]}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {item.tags[lang].map(tag => (
                        <span key={tag} className="px-3 py-1 bg-[#eef4f8] dark:bg-gray-700 text-[#2d5a57] dark:text-emerald-400 text-xs rounded-full">{tag}</span>
                      ))}
                    </div>
                    <Link href={item.href} className="inline-block w-fit px-5 py-2 border border-[#2d5a57] dark:border-emerald-500 text-[#2d5a57] dark:text-emerald-400 rounded-full text-sm font-medium hover:bg-[#2d5a57] hover:text-white dark:hover:bg-emerald-600 dark:hover:text-white transition-colors">
                      {content.viewDetail[lang]}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ===== HỌC LIỆU TƯƠNG TÁC ===== */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <motion.div {...fadeIn}>
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#2d5a57] dark:text-emerald-400 mb-3">{content.learning.title[lang]}</h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">{content.learning.desc[lang]}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {learningItems.map((item, i) => (
              <Link key={i} href={item.href}>
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all h-full hover:-translate-y-1 text-center">
                  <div className="w-14 h-14 rounded-xl bg-[#2d5a57]/10 dark:bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                    <item.icon className="w-7 h-7 text-[#2d5a57] dark:text-emerald-400" />
                  </div>
                  <h3 className="font-bold text-[#2d5a57] dark:text-emerald-400 mb-2">{item.title[lang]}</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-4">{item.desc[lang]}</p>
                  <span className="inline-block px-5 py-2 border border-[#2d5a57] dark:border-emerald-500 text-[#2d5a57] dark:text-emerald-400 rounded-full text-sm font-medium hover:bg-[#2d5a57] hover:text-white dark:hover:bg-emerald-600 dark:hover:text-white transition-colors">
                    {item.btn[lang]}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ===== SỔ TAY ===== */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <motion.div {...fadeIn}>
          <div className="bg-[#dbeee8] dark:bg-emerald-900/30 rounded-2xl overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-8 sm:p-10 flex flex-col justify-center">
                <span className="text-xs font-semibold text-[#2d5a57] dark:text-emerald-400 tracking-widest uppercase mb-3">{content.notebook.badge[lang]}</span>
                <h2 className="text-2xl sm:text-3xl font-bold text-[#2d5a57] dark:text-emerald-300 mb-2">{content.notebook.title[lang]}</h2>
                <p className="text-gray-600 dark:text-gray-300 text-sm mt-2">{content.notebook.noteDesc[lang]}</p>
              </div>
              <div className="p-8 sm:p-10">
                <h3 className="text-xl font-bold text-[#2d5a57] dark:text-emerald-300 mb-3">{content.notebook.openTitle[lang]}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-6">{content.notebook.openDesc[lang]}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {notebookTopics.map(item => (
                    <div key={item} className="bg-white/60 dark:bg-gray-800/60 rounded-xl px-4 py-3 text-sm text-[#2d5a57] dark:text-emerald-400 font-medium">
                      {item}
                    </div>
                  ))}
                </div>
                <div className="flex gap-3 mt-6">
                  <Link href="/learning" className="px-5 py-2.5 bg-[#2d5a57] text-white rounded-full text-sm font-medium hover:bg-[#1e3f3d] transition-colors">
                    {content.notebook.viewBtn[lang]}
                  </Link>
                  <button className="px-5 py-2.5 border border-[#2d5a57] dark:border-emerald-500 text-[#2d5a57] dark:text-emerald-400 rounded-full text-sm font-medium hover:bg-[#2d5a57] hover:text-white dark:hover:bg-emerald-600 dark:hover:text-white transition-colors">
                    {content.notebook.downloadBtn[lang]}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ===== GÓC SẢN PHẨM HỌC SINH ===== */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <motion.div {...fadeIn}>
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#2d5a57] dark:text-emerald-400 mb-3">{content.students.title[lang]}</h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">{content.students.desc[lang]}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {studentItems.map((item, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1">
                <div className="w-12 h-12 rounded-xl bg-[#2d5a57]/10 dark:bg-emerald-500/20 flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6 text-[#2d5a57] dark:text-emerald-400" />
                </div>
                <h3 className="font-bold text-[#2d5a57] dark:text-emerald-400 mb-2">{item.title[lang]}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{item.desc[lang]}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm max-w-3xl mx-auto">
              <h3 className="text-lg font-bold text-[#2d5a57] dark:text-emerald-400 mb-3">{content.students.quote[lang]}</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{content.students.quoteDesc[lang]}</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Global footer is handled by MainLayoutWrapper */}
    </div>
  );
}

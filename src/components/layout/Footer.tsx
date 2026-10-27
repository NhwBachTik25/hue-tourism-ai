import Link from 'next/link';
import { useLanguage } from '@/components/providers/language-provider';

export function Footer() {
  const { language } = useLanguage();
  const lang = language as 'vi' | 'en';

  return (
    <footer className="bg-[#2d5a57] text-white mt-12 w-full">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-start gap-3 mb-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <span className="font-bold text-sm">PV</span>
                </div>
                <h4 className="font-bold leading-tight pt-1">
                  {lang === 'vi' 
                    ? 'Xây dựng bộ học liệu di sản văn hóa xã Phú Vinh phục vụ dạy học tích hợp ở trường THCS và góp phần quảng bá du lịch địa phương' 
                    : 'Building Phu Vinh Cultural Heritage Learning Materials for Integrated Teaching and Tourism Promotion'}
                </h4>
              </div>
              <p className="text-white/70 text-sm leading-relaxed">
                {lang === 'vi'
                  ? 'Sản phẩm phục vụ dạy học tích hợp, góp phần bảo tồn, phát huy giá trị di sản văn hóa địa phương và bồi dưỡng tình yêu quê hương cho học sinh.'
                  : 'A product for integrated teaching, contributing to preserving and promoting local cultural heritage values and nurturing students\' love for their homeland.'}
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">{lang === 'vi' ? 'Liên kết nhanh' : 'Quick Links'}</h4>
              <div className="space-y-2">
                {[
                  { label: { vi: 'Di sản văn hóa', en: 'Cultural Heritage' }, href: '/heritage' },
                  { label: { vi: 'Lễ hội', en: 'Festivals' }, href: '/festivals' },
                  { label: { vi: 'Điểm đến', en: 'Destinations' }, href: '/destinations' },
                  { label: { vi: 'Học tập', en: 'Learning' }, href: '/learning' },
                  { label: { vi: 'Câu chuyện AI', en: 'AI Stories' }, href: '/stories' },
                ].map(link => (
                  <Link key={link.href} href={link.href} className="block text-white/70 hover:text-white text-sm transition-colors">
                    {link.label[lang]}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-4">{lang === 'vi' ? 'Thông tin dự án' : 'Project Information'}</h4>
              <div className="space-y-2 text-white/70 text-sm">
                <p><strong className="text-white/90">{lang === 'vi' ? 'Giải thưởng:' : 'Award:'}</strong> {lang === 'vi' ? 'Giải thưởng Tiên phong ứng dụng AI trong giáo dục' : 'AI Pioneer in Education Award'}</p>
                <div className="pt-2">
                  <p><strong className="text-white/90">{lang === 'vi' ? 'Tác giả:' : 'Author:'}</strong> Cao Thị Lan</p>
                  <p><strong className="text-white/90">{lang === 'vi' ? 'Đơn vị:' : 'School:'}</strong> Trường THCS Phú Vinh 1</p>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-white/20 mt-8 pt-6 text-center text-white/50 text-xs">
            © 2025 {lang === 'vi' ? 'Bộ học liệu di sản văn hóa xã Phú Vinh' : 'Phu Vinh Cultural Heritage Learning'}. Designed with ❤️
          </div>
        </div>
      </footer>
  );
}

// DỮ LIỆU GAME 1 (Từ hoa.html - 3 Vòng: Ghép cặp, Đúng/Sai, Trắc nghiệm)

export interface Round1Pair {
  id: number;
  left: string;
  right: string;
}

export interface Round2TF {
  q: string;
  ans: boolean;
}

export interface Round3MCQ {
  q: string;
  options: string[];
  answer: number;
}

// DỮ LIỆU VÒNG 1 (Ghép Cặp - Đình làng)
export const hoaRound1Pairs: Round1Pair[] = [
  { id: 1, left: "Địa điểm hiện nay", right: "Thuộc địa phận xã Phú Vinh, TP Huế" },
  { id: 2, left: "Vật liệu ban đầu", right: "Xây dựng bằng tranh, tre, nứa, lá" },
  { id: 3, left: "Nơi thờ phụng", right: "Thành hoàng làng và các vị khai canh" },
  { id: 4, left: "Kiến trúc đặc trưng", right: "Mái ngói âm dương, chạm trổ rồng" },
  { id: 5, left: "Vai trò trong kháng chiến", right: "Là cơ sở cách mạng, che giấu cán bộ" },
  { id: 6, left: "Hoạt động văn hóa", right: "Tổ chức Lễ hội truyền thống Thu tế, Xuân tế" },
  { id: 7, left: "Ý nghĩa với người dân", right: "Gắn kết cộng đồng, là biểu tượng của làng quê" },
  { id: 8, left: "Thái độ khi tham quan", right: "Cần ăn mặc lịch sự, tôn trọng di tích" }
];

// DỮ LIỆU VÒNG 2 (Đúng/Sai - Tháp Chăm)
export const hoaRound2Data: Round2TF[] = [
  { q: "1. Tháp Chăm Phú Diên là tháp cổ chìm sâu dưới cồn cát ven biển đầu tiên được khai quật tại Việt Nam.", ans: true },
  { q: "2. Tháp Phú Diên được xác định có niên đại vào khoảng thế kỷ XV.", ans: false }, 
  { q: "3. Công trình kiến trúc này thuộc nền văn hóa Champa.", ans: true },
  { q: "4. Vật liệu chính được sử dụng để xây dựng Tháp Chăm Phú Diên là đá nguyên khối.", ans: false },
  { q: "5. Sự kiện phát hiện ra Tháp diễn ra vào tháng 4 năm 2001.", ans: true },
  { q: "6. Tháp Chăm Phú Diên hiện nay tọa lạc tại xã Phú Vinh, thành phố Huế.", ans: true },
  { q: "7. Đây là công trình không có giá trị nhiều về mặt khảo cổ học.", ans: false },
  { q: "8. Công trình này đã được Tổ chức Kỷ lục Việt Nam ghi nhận kỷ lục.", ans: true }
];

// DỮ LIỆU VÒNG 3 (Trắc nghiệm - Biển Phú Diên)
export const hoaRound3Data: Round3MCQ[] = [
  { q: "Câu 17: Bãi biển Phú Diên hiện nay thuộc địa phương nào?", options: ["A. Xã Phú Vinh, TP Huế", "B. Phường Thuận An, TP Huế", "C. Xã Hải Dương, TP Huế", "D. Xã Phú Hồ, TP Huế"], answer: 0 },
  { q: "Câu 18: Vẻ đẹp thiên nhiên nổi bật của biển Phú Diên là gì?", options: ["A. Nhiều vách đá nguy hiểm", "B. Bãi cát dài mịn, nước trong xanh", "C. Cát đen, sóng rất lớn", "D. Nhiều hang động ngầm"], answer: 1 },
  { q: "Câu 19: Biển cung cấp nguồn lợi kinh tế chính nào cho người dân?", options: ["A. Than đá", "B. Lúa nước", "C. Thủy hải sản phong phú", "D. Linh kiện điện tử"], answer: 2 },
  { q: "Câu 20: Học sinh và du khách đến biển thường trải nghiệm hoạt động nào?", options: ["A. Trượt tuyết", "B. Khám phá thạch nhũ", "C. Tắm biển, ngắm bình minh", "D. Thăm vườn trái cây"], answer: 2 },
  { q: "Câu 21: Yếu tố nào giúp biển Phú Diên phát triển du lịch mạnh mẽ?", options: ["A. Cảnh quan hoang sơ, không khí trong lành", "B. Khu giải trí quốc tế đắt tiền", "C. Nằm sát sân bay", "D. Có trung tâm thương mại lớn"], answer: 0 },
  { q: "Câu 22: Hành động nào dưới đây gây ảnh hưởng tồi tệ nhất đến bãi biển?", options: ["A. Nhặt rác trên bãi biển", "B. Xả rác thải nhựa, nilon bừa bãi", "C. Trồng cây chắn cát", "D. Nhắc nhở du khách giữ vệ sinh"], answer: 1 },
  { q: "Câu 23: Việc bảo vệ môi trường biển mang lại ý nghĩa to lớn nào?", options: ["A. Thu nhiều tiền giữ xe", "B. Làm nước biển đổi màu", "C. Giữ gìn hệ sinh thái, bảo vệ sức khỏe", "D. Giúp sóng biển ngừng vỗ"], answer: 2 },
  { q: "Câu 24: Là học sinh, hành động thiết thực nhất em có thể làm là gì?", options: ["A. Bắt sinh vật biển quý hiếm", "B. Vứt rác trên cát", "C. Không xả rác, lan tỏa thông điệp giảm rác nhựa", "D. Xây nhà trên bãi biển"], answer: 2 }
];


// =========================================================================
// DỮ LIỆU GAME 2 (Từ ame.html - 24 MCQs - Trắc nghiệm liên tục)

export interface AmeRoundQuestion extends Round3MCQ {
  round: string;
}

export const ameQuizData: AmeRoundQuestion[] = [
  // VÒNG 1
  { round: "VÒNG 1: GIẢI MÃ NGÔI ĐÌNH CỔ", q: "Câu 1: Đình làng Hà Thanh hiện nay tọa lạc tại địa phương nào?", options: ["A. Phường Thuận An, TP Huế", "B. Xã Phú Vinh, TP Huế", "C. Phường Hương Thủy, TP Huế", "D. Xã Phú Hồ, TP Huế"], answer: 1 },
  { round: "VÒNG 1: GIẢI MÃ NGÔI ĐÌNH CỔ", q: "Câu 2: Khi mới hình thành, đình làng Hà Thanh chủ yếu được xây bằng vật liệu gì?", options: ["A. Bê tông cốt thép", "B. Gạch nung và xi măng", "C. Tranh, tre, nứa, lá", "D. Đá nguyên khối"], answer: 2 },
  { round: "VÒNG 1: GIẢI MÃ NGÔI ĐÌNH CỔ", q: "Câu 3: Đình làng thường là nơi thờ phụng ai?", options: ["A. Các vị anh hùng thời hiện đại", "B. Thành hoàng làng và các vị khai canh", "C. Các vị vua triều Nguyễn", "D. Các danh nhân thế giới"], answer: 1 },
  { round: "VÒNG 1: GIẢI MÃ NGÔI ĐÌNH CỔ", q: "Câu 4: Đặc trưng kiến trúc nổi bật của đình làng truyền thống là gì?", options: ["A. Mái lợp tôn, vách ván gỗ", "B. Tháp nhọn vươn cao", "C. Mái ngói âm dương, chạm trổ rồng", "D. Xây theo phong cách châu Âu"], answer: 2 },
  { round: "VÒNG 1: GIẢI MÃ NGÔI ĐÌNH CỔ", q: "Câu 5: Trong kháng chiến, đình làng đóng vai trò lịch sử quan trọng nào?", options: ["A. Nơi kinh doanh buôn bán", "B. Trạm xá của lính Pháp", "C. Cơ sở cách mạng, che giấu cán bộ", "D. Nơi lưu trữ vũ khí của giặc"], answer: 2 },
  { round: "VÒNG 1: GIẢI MÃ NGÔI ĐÌNH CỔ", q: "Câu 6: Về văn hóa, đình làng là nơi tổ chức hoạt động nào?", options: ["A. Lễ hội truyền thống (Thu tế, Xuân tế)", "B. Biểu diễn ca nhạc quốc tế", "C. Giải đấu thể thao chuyên nghiệp", "D. Phiên chợ thương mại lớn"], answer: 0 },
  { round: "VÒNG 1: GIẢI MÃ NGÔI ĐÌNH CỔ", q: "Câu 7: Đối với người dân, ngôi đình làng mang ý nghĩa thiêng liêng nhất là gì?", options: ["A. Biểu tượng của sự giàu có", "B. Gắn kết cộng đồng, biểu tượng làng quê", "C. Điểm du lịch thu tiền vé", "D. Trung tâm hành chính địa phương"], answer: 1 },
  { round: "VÒNG 1: GIẢI MÃ NGÔI ĐÌNH CỔ", q: "Câu 8: Khi tham quan đình làng, chúng ta cần có thái độ như thế nào?", options: ["A. Tự do chạy nhảy, đùa giỡn", "B. Khắc tên lên cột đình", "C. Ăn mặc lịch sự, tôn trọng di tích", "D. Hái hoa, bẻ cành trong khuôn viên"], answer: 2 },
  
  // VÒNG 2
  { round: "VÒNG 2: NHÀ KHẢO CỔ TÀI BA", q: "Câu 9: Tháp Chăm Phú Diên được phát hiện tại địa điểm nào?", options: ["A. Trên đỉnh núi cao", "B. Ẩn sâu trong rừng nguyên sinh", "C. Chìm dưới cồn cát ven biển xã Phú Vinh", "D. Trung tâm thành phố Huế"], answer: 2 },
  { round: "VÒNG 2: NHÀ KHẢO CỔ TÀI BA", q: "Câu 10: Tháp Phú Diên là công trình thuộc nền văn hóa nào?", options: ["A. Văn hóa Sa Huỳnh", "B. Văn hóa Champa", "C. Văn hóa Đông Sơn", "D. Văn hóa Óc Eo"], answer: 1 },
  { round: "VÒNG 2: NHÀ KHẢO CỔ TÀI BA", q: "Câu 11: Tháp Chăm Phú Diên có niên đại vào khoảng thời gian nào?", options: ["A. Thế kỷ VIII", "B. Thế kỷ X", "C. Thế kỷ XII", "D. Thế kỷ XV"], answer: 0 },
  { round: "VÒNG 2: NHÀ KHẢO CỔ TÀI BA", q: "Câu 12: Sự kiện phát hiện ra Tháp diễn ra vào thời gian nào?", options: ["A. Năm 1990", "B. Tháng 4 năm 2001", "C. Năm 2010", "D. Năm 2020"], answer: 1 },
  { round: "VÒNG 2: NHÀ KHẢO CỔ TÀI BA", q: "Câu 13: Vật liệu chính để xây dựng Tháp Chăm Phú Diên là gì?", options: ["A. Gạch nung", "B. Đá xanh", "C. Gỗ lim", "D. Đất sét"], answer: 0 },
  { round: "VÒNG 2: NHÀ KHẢO CỔ TÀI BA", q: "Câu 14: Giá trị khảo cổ lớn nhất của Tháp Chăm Phú Diên là gì?", options: ["A. Tháp lớn nhất Việt Nam", "B. Minh chứng sự phát triển văn hóa Chăm", "C. Lưu giữ nhiều vàng bạc", "D. Pháo đài quân sự cổ đại"], answer: 1 },
  { round: "VÒNG 2: NHÀ KHẢO CỔ TÀI BA", q: "Câu 15: Điểm độc đáo nhất của Tháp Chăm Phú Diên là gì?", options: ["A. Xây dựng trên đảo hoang", "B. Kiến trúc hình tròn", "C. Bị vùi lấp dưới cồn cát hàng thế kỷ", "D. Làm bằng đá cẩm thạch"], answer: 2 },
  { round: "VÒNG 2: NHÀ KHẢO CỔ TÀI BA", q: "Câu 16: Tổ chức Kỷ lục VN đã công nhận Tháp Phú Diên với kỷ lục nào?", options: ["A. Tháp Chăm cao nhất", "B. Tháp cổ chìm sâu dưới cát đầu tiên được khai quật", "C. Có nhiều tượng phật nhất", "D. Xây dựng nhanh nhất"], answer: 1 },
  
  // VÒNG 3
  { round: "VÒNG 3: KHÁM PHÁ BIỂN XANH", q: "Câu 17: Bãi biển hiện nay thuộc địa phương nào?", options: ["A. Xã Phú Hồ, TP Huế", "B. Phường Thuận An, TP Huế", "C. Xã Phú Vinh, TP Huế", "D. Xã Hải Dương, TP Huế"], answer: 2 },
  { round: "VÒNG 3: KHÁM PHÁ BIỂN XANH", q: "Câu 18: Vẻ đẹp thiên nhiên nổi bật của bãi biển là gì?", options: ["A. Vách đá cheo leo", "B. Bãi cát dài mịn, nước trong xanh, hoang sơ", "C. Cát đen, sóng rất lớn", "D. Nhiều hang động ngầm"], answer: 1 },
  { round: "VÒNG 3: KHÁM PHÁ BIỂN XANH", q: "Câu 19: Biển có vai trò kinh tế thế nào với người dân địa phương?", options: ["A. Khai thác than đá", "B. Trồng lúa nước", "C. Cung cấp thủy hải sản phong phú", "D. Sản xuất linh kiện điện tử"], answer: 2 },
  { round: "VÒNG 3: KHÁM PHÁ BIỂN XANH", q: "Câu 20: Học sinh và du khách đến biển có thể tham gia hoạt động nào?", options: ["A. Trượt tuyết, leo núi băng", "B. Tắm biển, ngắm bình minh, ăn hải sản", "C. Khám phá thạch nhũ", "D. Tham quan vườn trái cây"], answer: 1 },
  { round: "VÒNG 3: KHÁM PHÁ BIỂN XANH", q: "Câu 21: Nhờ đâu biển quê hương có giá trị phát triển du lịch cao?", options: ["A. Khu giải trí quốc tế", "B. Không khí trong lành, cảnh đẹp, hải sản ngon", "C. Cạnh sân bay", "D. Trung tâm mua sắm"], answer: 1 },
  { round: "VÒNG 3: KHÁM PHÁ BIỂN XANH", q: "Câu 22: Hành động nào làm mất đi vẻ đẹp của biển?", options: ["A. Thu gom rác thải", "B. Trồng cây chắn gió", "C. Xả rác thải nhựa, túi nilon bừa bãi", "D. Bỏ rác đúng nơi quy định"], answer: 2 },
  { round: "VÒNG 3: KHÁM PHÁ BIỂN XANH", q: "Câu 23: Bảo vệ môi trường biển mang lại ý nghĩa gì?", options: ["A. Thu nhiều tiền vé hơn", "B. Giữ gìn hệ sinh thái, bảo vệ sức khỏe con người", "C. Làm nước biển đổi màu", "D. Sóng biển ngừng vỗ"], answer: 1 },
  { round: "VÒNG 3: KHÁM PHÁ BIỂN XANH", q: "Câu 24: Là học sinh, các em cần làm gì để cảnh quan biển luôn sạch đẹp?", options: ["A. Vứt rác trên cát", "B. Chỉ nhặt rác khi chụp ảnh", "C. Không xả rác, lan tỏa thông điệp giảm rác nhựa", "D. Bắt sinh vật biển về nuôi"], answer: 2 }
];

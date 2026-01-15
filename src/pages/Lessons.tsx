import { useState, useMemo, useEffect } from "react";
import {
  PlayCircle,
  BookOpen,
  CheckCircle,
  Search,
  Video,
  FileText,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

/* ==================================================================================
   KHU VỰC ĐỊNH NGHĨA KIỂU DỮ LIỆU
   ================================================================================== */
interface Lesson {
  id: string;
  title: string;
  topicCount: number;
  quizCount: number;
  completed?: boolean;
}

interface Topic {
  id: string;
  lessonId: string;
  semester: 1 | 2;
  title: string;
  videoUrl: string;
  description: string;
  completed?: boolean;
}

/* ==================================================================================
   KHU VỰC DỮ LIỆU (CÁC BẠN SỬA Ở ĐÂY)
   ================================================================================== */

// 1. DANH SÁCH LỚP HỌC (LESSONS)
const lessonsData: Lesson[] = [
  { id: "L1", title: "Toán Lớp 1", topicCount: 5, quizCount: 3 },
  { id: "L2", title: "Toán Lớp 2", topicCount: 10, quizCount: 5 },
  { id: "L3", title: "Toán Lớp 3", topicCount: 12, quizCount: 4 },
  { id: "L4", title: "Toán Lớp 4", topicCount: 15, quizCount: 6 },
  { id: "L5", title: "Toán Lớp 5", topicCount: 20, quizCount: 8 },
];

// 2. DANH SÁCH BÀI GIẢNG / VIDEO (TOPICS)
const topicsData: Topic[] = [
  /* --- LỚP 1 --- */
  {
    id: "L1-1",
    lessonId: "L1",
    semester: 1,
    title: "Các số từ 1 đến 10",
    videoUrl: "https://www.youtube.com/embed/EX8DR1YMlRE",
    description: "Học đếm số cơ bản.",
    completed: true,
  },
  {
    id: "L1-2",
    lessonId: "L1",
    semester: 1,
    title: "Các số 4, 5",
    videoUrl: "https://www.youtube.com/embed/tLoZ3HB3n7c",
    description: "Tiếp tục làm quen với các số từ 4, 5",
  },
  {
    id: "L1-3",
    lessonId: "L1",
    semester: 1,
    title: "Các số 6, 7, 8, 9",
    videoUrl: "https://www.youtube.com/embed/6mEtEcxAOnQ",
    description: "Khám phá các số từ 6 đến 9",
  },
  {
    id: "L1-4",
    lessonId: "L1",
    semester: 1,
    title: "Số 10 và ôn tập",
    videoUrl: "https://www.youtube.com/embed/lRXAnk0wiGI",
    description: "Học số 10 và ôn tập tất cả các số đã học",
    completed: false,
  },
  {
    id: "L1-5",
    lessonId: "L1",
    semester: 1,
    title: "Số 0",
    videoUrl: "https://www.youtube.com/embed/aMJgvwRAL_k",
    description: "Học Làm quen với số 0",
    completed: false,
  },
  {
    id: "L1-6",
    lessonId: "L1",
    semester: 1,
    title: "So Sánh Các Dấu Cho Bé Mới Bắt Đầu",
    videoUrl: "https://www.youtube.com/embed/nz5PWLtaokw",
    description: "Cách dùng các dấu trong phép so sánh",
    completed: false,
  },
  {
    id: "L1-7",
    lessonId: "L1",
    semester: 1,
    title: "Học Cách So Sánh Nhiều Hơn, Ít Hơn, Bằng Nhau",
    videoUrl: "https://www.youtube.com/embed/Z8P-pmHMxDU",
    description:
      "Học cách nhận biết và so sánh số lượng: nhiều – ít – bằng nhau",
    completed: false,
  },
  {
    id: "L1-8",
    lessonId: "L1",
    semester: 1,
    title: "Vẽ Đoạn Thẳng Có Độ Dài Cho Trước Như Thế Nào?",
    videoUrl: "https://www.youtube.com/embed/F3yktQ99TYw",
    description: "Học cách kẻ vẽ đoạn thẳng có độ dài chính xác.",
    completed: false,
  },
  {
    id: "L1-9",
    lessonId: "L1",
    semester: 1,
    title: "Học Cách Cộng Trong Phạm Vi 4, 5, 6 Đơn Giản",
    videoUrl: "https://www.youtube.com/embed/Ei0_VugQejo",
    description: "Làm quen với phép cộng trong phạm vi 4, 5 và 6",
    completed: false,
  },
  {
    id: "L1-10",
    lessonId: "L1",
    semester: 1,
    title: "Hiểu Nhanh Số 0 Trong Phép Cộng",
    videoUrl: "https://www.youtube.com/embed/9zOo65_BiuQ",
    description: "tìm hiểu Ý nghĩa của số 0 trong phép cộng",
    completed: false,
  },
  {
    id: "L1-11",
    lessonId: "L1",
    semester: 1,
    title: "Học Cách Cộng Trong Phạm Vi 6, 7, 8 Đơn Giản",
    videoUrl: "https://www.youtube.com/embed/Qq8r7-feu6s",
    description: "Làm quen với phép cộng trong phạm vi 6, 7 và 8",
    completed: false,
  },
  {
    id: "L1-12",
    lessonId: "L1",
    semester: 1,
    title: "Học Cách Cộng Trong Phạm Vi 9, 10 Đơn Giản",
    videoUrl: "https://www.youtube.com/embed/s-goxNdmJPE",
    description: "Làm quen với phép cộng trong phạm vi 9 và 10",
    completed: false,
  },
  {
    id: "L1-13",
    lessonId: "L1",
    semester: 1,
    title: "Học Cách Cộng Các Số Tròn Chục",
    videoUrl: "https://www.youtube.com/embed/yd5JHf4Blh0",
    description: "Biết cách cộng các số tròn chục.",
    completed: false,
  },
  {
    id: "L1-14",
    lessonId: "L1",
    semester: 1,
    title: "Học Cách Trừ Trong Phạm Vi 3, 4, 5 Đơn Giản",
    videoUrl: "https://www.youtube.com/embed/55l906_zUyE",
    description: "Làm quen với phép trừ trong phạm vi 3, 4 và 5",
    completed: false,
  },
  {
    id: "L1-15",
    lessonId: "L1",
    semester: 1,
    title: "Hiểu Nhanh Số 0 Trong Phép Trừ",
    videoUrl: "https://www.youtube.com/embed/CyeG3y7lKeg",
    description: "tìm hiểu Ý nghĩa của số 0 trong phép trừ",
    completed: false,
  },
  {
    id: "L1-16",
    lessonId: "L1",
    semester: 1,
    title: "Phân Biệt Điểm Ở Trong Hay Ở Ngoài Một Hình",
    videoUrl: "https://www.youtube.com/embed/-Cnwmbv69Aw",
    description: " Nhận biết điểm nằm trong hoặc ngoài một hình phẳng",
    completed: false,
  },
  {
    id: "L1-17",
    lessonId: "L1",
    semester: 1,
    title: "Nhận Biết Vị Trí: Trên – Dưới, Trái – Phải, Trước – Sau, Ở Giữa",
    videoUrl: "https://www.youtube.com/embed/ZD5O7uPbWhw",
    description: "Nhận biết các vị trí cơ bản.",
    completed: false,
  },
  {
    id: "L1-18",
    lessonId: "L1",
    semester: 1,
    title: "Học Cách So Sánh Nhiều Hơn, Ít Hơn, Bằng Nhau",
    videoUrl: "https://www.youtube.com/embed/Z8P-pmHMxDU",
    description:
      "Học cách nhận biết và so sánh số lượng: nhiều – ít – bằng nhau. ",
    completed: false,
  },
  {
    id: "L1-19",
    lessonId: "L1",
    semester: 1,
    title: "Nhận Biết Vị Trí: Trên – Dưới, Trái – Phải, Trước – Sau, Ở Giữa",
    videoUrl: "https://www.youtube.com/embed/ZD5O7uPbWhw",
    description: "Nhận biết các vị trí cơ bản.",
    completed: false,
  },
  /** Lớp 1 - kỳ 2 */
  {
    id: "L1-20",
    lessonId: "L1",
    semester: 2,
    title: "Làm Quen Với Đồng Hồ Và Thời Gian",
    videoUrl: "https://www.youtube.com/embed/mIPRUr0rrOc",
    description: "Làm quen và nhận biết đồng hồ và thời gian.",
    completed: false,
  },
  {
    id: "L1-21",
    lessonId: "L1",
    semester: 2,
    title: "Xăng-ti-mét (cm)",
    videoUrl: "https://www.youtube.com/embed/RJFSVVGgiTw",
    description: "Làm quen và nhận biết đồng hồ và thời gian.",
    completed: false,
  },
  {
    id: "L1-22",
    lessonId: "L1",
    semester: 2,
    title: "Nhận Biết Các Hình Học Cơ Bản: Vuông, Tròn, Tam Giác, Chữ Nhật",
    videoUrl: "https://www.youtube.com/embed/W3UzjLDA6M4",
    description: "Nhận biết các hình học cơ bản",
    completed: false,
  },
  {
    id: "L1-23",
    lessonId: "L1",
    semester: 2,
    title: "Khối Lập Phương – Khối Hộp Chữ Nhật Là Gì?",
    videoUrl: "https://www.youtube.com/embed/udOvVRBYfxo",
    description: "Nhận biết hình khối cơ bản.",
    completed: false,
  },
  {
    id: "L1-24",
    lessonId: "L1",
    semester: 2,
    title: "Học Cách Đo Độ Dài Chính Xác",
    videoUrl: "https://www.youtube.com/embed/_Z6BNEvcZHI",
    description: "Hiểu khái niệm đo độ dài là gì.",
    completed: false,
  },
  {
    id: "L1-25",
    lessonId: "L1",
    semester: 2,
    title: " Làm Quen Với Các Số Từ 11 Đến 16 Dễ Hiểu",
    videoUrl: "https://www.youtube.com/embed/xj6xmgfPTYA",
    description: "Làm quen với các số từ 11 đến 16",
    completed: false,
  },
  {
    id: "L1-26",
    lessonId: "L1",
    semester: 2,
    title: "Làm Quen Với Các Số Từ 17 Đến 20 Dễ Hiểu",
    videoUrl: "https://www.youtube.com/embed/cj_H-yURTkk",
    description: " Làm quen với các số từ 17 đến 20.",
    completed: false,
  },
  {
    id: "L1-27",
    lessonId: "L1",
    semester: 2,
    title: "Làm Quen Với Các Số Từ 21 Đến 40",
    videoUrl: "https://www.youtube.com/embed/kbd23ca3BTs",
    description: "Làm quen với các số từ 21 đến 40.",
    completed: false,
  },
  {
    id: "L1-28",
    lessonId: "L1",
    semester: 2,
    title: "Làm Quen Với Các Số Từ 71 Đến 99",
    videoUrl: "https://www.youtube.com/embed/vRSD68RnrHg",
    description: "Làm quen với các số từ 71 đến 99.",
    completed: false,
  },
  {
    id: "L1-29",
    lessonId: "L1",
    semester: 2,
    title: "Phép Trừ Dạng 27 - 4 Và 63 - 40 Dễ Hiểu Dễ Nhớ",
    videoUrl: "https://www.youtube.com/embed/_VJBjfIPXUw",
    description: "Làm quen với phép trừ dạng 27 - 4 và 63 - 40",
    completed: false,
  },
  {
    id: "L1-30",
    lessonId: "L1",
    semester: 2,
    title: "Học Cách So Sánh Độ Dài: Dài Hơn Hay Ngắn Hơn?",
    videoUrl: "https://www.youtube.com/embed/dl-mzVa01N0",
    description: "Quan sát và so sánh độ dài",
    completed: false,
  },
  {
    id: "L1-31",
    lessonId: "L1",
    semester: 2,
    title: "Làm Quen Với Các Số Từ 41 Đến 70",
    videoUrl: "https://www.youtube.com/embed/WOcDMWIiBFY",
    description: "Làm quen với các số từ 41 đến 70",
    completed: false,
  },
  /* --- LỚP 3 --- */
  /* --- LỚP 3 - HỌC KÌ 1 --- */
  {
    id: "L3-1",
    lessonId: "L3",
    semester: 1,
    title: "Số có 4 chữ số",
    videoUrl: "https://www.youtube.com/embed/Ydqfpq0iisw?si=BzhPS_5QAANaEvmh",
    description: "Làm quen với số có 4 chữ số",
    completed: true,
  },
  {
    id: "L3-2",
    lessonId: "L3",
    semester: 1,
    title: "Hệ thống số la mã",
    videoUrl: "https://www.youtube.com/embed/QW_SF3hO7rU?si=W5Xq1DSATJ-qpR5c",
    description: " Làm Quen Với Hệ Thống Số La Mã",
  },
  {
    id: "L3-3",
    lessonId: "L3",
    semester: 1,
    title: "Số có 5 chữ số",
    videoUrl: "https://www.youtube.com/embed/GOVlVSwXot0?si=yGjfxU5rk_pyQ2hX",
    description: "Làm Quen Với Số Có 5 Chữ Số",
  },
  {
    id: "L3-4",
    lessonId: "L3",
    semester: 1,
    title: "Xem đồng hồ",
    videoUrl: "https://www.youtube.com/embed/46qb_FhcsRE?si=PeKBqtmco8mJfaIT",
    description: "Học cách xem đồng hồ",
    completed: false,
  },
  {
    id: "L3-5",
    lessonId: "L3",
    semester: 1,
    title: "Đồng hồ và số la mã",
    videoUrl: "https://www.youtube.com/embed/6VnQ8wXMyy0?si=1VAKSSYneNt7zMqi",
    description: "Học về đồng hồ và số la mã",
    completed: false,
  },

  /* --- LỚP 5 --- */
  /* --- LỚP 5 - HỌC KÌ 1 --- */
  {
    id: "L5-1",
    lessonId: "L5",
    semester: 1,
    title: "Chia Một Số Tự Nhiên Cho Một Số Thập Phân",
    videoUrl: "https://www.youtube.com/embed/8Akzlx2xODc",
    description: "Chia Một Số Tự Nhiên Cho Một Số Thập Phân",
  },
  {
    id: "L5-2",
    lessonId: "L5",
    semester: 1,
    title: "Khái Niệm Hỗn Số",
    videoUrl: "https://www.youtube.com/embed/PFP0F64bxfI",
    description: "Khái Niệm Hỗn Số",
  },
  {
    id: "L5-3",
    lessonId: "L5",
    semester: 1,
    title: "Chuyển Đổi Hỗn Số Thành Phân Số",
    videoUrl: "https://www.youtube.com/embed/M5aZBfU4A7Y",
    description: "Chuyển Đổi Hỗn Số Thành Phân Số",
  },
  {
    id: "L5-4",
    lessonId: "L5",
    semester: 1,
    title: "Đọc, Viết Số Thập Phân",
    videoUrl: "https://www.youtube.com/embed/jKuVl8lSUSE",
    description: "Đọc, Viết Số Thập Phân",
  },
  {
    id: "L5-5",
    lessonId: "L5",
    semester: 1,
    title: "So Sánh 2 Số Thập Phân",
    videoUrl: "https://www.youtube.com/embed/NSUiNNCdTDE",
    description: "So Sánh 2 Số Thập Phân",
  },
  {
    id: "L5-6",
    lessonId: "L5",
    semester: 1,
    title: "Viết Số Đo Độ Dài Dưới Dạng Số Thập Phân",
    videoUrl: "https://www.youtube.com/embed/AjyO6GMldDY",
    description: "Viết Số Đo Độ Dài Dưới Dạng Số Thập Phân",
  },
  {
    id: "L5-7",
    lessonId: "L5",
    semester: 1,
    title: "Ôn tập phép nhân",
    videoUrl: "https://www.youtube.com/embed/S19Lbyt8U_0",
    description: "Trừ Các Số Thập Phân",
  },
  {
    id: "L5-8",
    lessonId: "L5",
    semester: 1,
    title: "Nhân Một Số Thập Phân Với Một Số Thập Phân",
    videoUrl: "https://www.youtube.com/embed/KhsxxdEo2QQ",
    description: "Nhân Một Số Thập Phân Với Một Số Thập Phân",
  },
  {
    id: "L5-9",
    lessonId: "L5",
    semester: 1,
    title: "Chia Một Số Thập Phân Với Một Số Thập Phân",
    videoUrl: "https://www.youtube.com/embed/aO0X57Mm91Q",
    description: "Chia Một Số Thập Phân Với Một Số Thập Phân",
  },
  {
    id: "L5-10",
    lessonId: "L5",
    semester: 1,
    title: "Làm Quen Với Tỉ Số Phần Trăm",
    videoUrl: "https://www.youtube.com/embed/_Cjo_FpPnqQ",
    description: "Làm Quen Với Tỉ Số Phần Trăm",
  },
  {
    id: "L5-11",
    lessonId: "L5",
    semester: 1,
    title: "Cách Tính Diện Tích Hình Tam Giác",
    videoUrl: "https://www.youtube.com/embed/clTUm_OZQb8",
    description: "Cách Tính Diện Tích Hình Tam Giác",
  },
  {
    id: "L5-12",
    lessonId: "L5",
    semester: 1,
    title: "Cách Tính Diện Tích Hình Thang",
    videoUrl: "https://www.youtube.com/embed/HMjoeADksbU",
    description: "Cách Tính Diện Tích Hình Thang",
  },

  {
    id: "L5-13",
    lessonId: "L5",
    semester: 1,
    title: "Cách Tính Diện Tích Hình Tròn",
    videoUrl: "https://www.youtube.com/embed/TzzJ9PTVoyA",
    description: "Cách Tính Diện Tích Hình Tròn",
  },
  {
    id: "L5-14",
    lessonId: "L5",
    semester: 1,
    title: "Cách Tính Thời Gian, Quãng Đường, Vận Tốc",
    videoUrl: "https://www.youtube.com/embed/zFjbAYD3w3w",
    description: "Cách Tính Thời Gian, Quãng Đường, Vận Tốc",
  },
  {
    id: "L5-22",
    lessonId: "L5",
    semester: 1,
    title: "Tìm Tỉ Số Phần Trăm Của 2 Số",
    videoUrl: "https://www.youtube.com/embed/kCmwalu89GM",
    description: "Tìm Tỉ Số Phần Trăm Của 2 Số",
  },
  /* --- LỚP 5 - HỌC KÌ 2 --- */
  {
    id: "L5-15",
    lessonId: "L5",
    semester: 2,
    title: "Diện Tích Xung Quanh Và Diện Tích Toàn Phần Hình Hộp Chữ Nhật",
    videoUrl: "https://www.youtube.com/embed/0YrZsFToDIk",
    description:
      "Diện Tích Xung Quanh Và Diện Tích Toàn Phần Hình Hộp Chữ Nhật",
  },
  {
    id: "L5-16",
    lessonId: "L5",
    semester: 2,
    title: "Diện Tích Xung Quanh Và Diện Tích Toàn Phần Của Hình Lập Phương",
    videoUrl: "https://www.youtube.com/embed/TNgBCGNgl4Q",
    description:
      "Diện Tích Xung Quanh Và Diện Tích Toàn Phần Của Hình Lập Phương",
  },
  {
    id: "L5-23",
    lessonId: "L5",
    semester: 2,
    title: "Giới Thiệu Về Hình Trụ, Hình Cầu",
    videoUrl: "https://www.youtube.com/embed/0NewzRWSTfc",
    description: "Giới Thiệu Về Hình Trụ, Hình Cầu",
  },
  {
    id: "L5-24",
    lessonId: "L5",
    semester: 2,
    title: "Cộng Số Đo Thời Gian",
    videoUrl: "https://www.youtube.com/embed/6iRL5OsVLbc",
    description: "Cộng Số Đo Thời Gian",
  },
  {
    id: "L5-25",
    lessonId: "L5",
    semester: 2,
    title: "Trừ Số Đo Thời Gian",
    videoUrl: "https://www.youtube.com/embed/v3l00mOpelQ",
    description: "Trừ Số Đo Thời Gian",
  },
  {
    id: "L5-26",
    lessonId: "L5",
    semester: 2,
    title: "Nhân Số Đo Thời Gian",
    videoUrl: "https://www.youtube.com/embed/Fl1n_3_Lh40",
    description: "Nhân Số Đo Thời Gian",
  },
  {
    id: "L5-27",
    lessonId: "L5",
    semester: 2,
    title: "Chia Số Đo Thời Gian",
    videoUrl: "https://www.youtube.com/embed/c8-5gshbYiI",
    description: "Chia Số Đo Thời Gian",
  },
  {
    id: "L5-17",
    lessonId: "L5",
    semester: 2,
    title: "Thể Tích Của Một Hình",
    videoUrl: "https://www.youtube.com/embed/rlGdd3rj3A4",
    description: "Thể Tích Của Một Hình",
  },
  {
    id: "L5-18",
    lessonId: "L5",
    semester: 2,
    title: "Thể Tích Hình Hộp Chữ Nhật",
    videoUrl: "https://www.youtube.com/embed/D7AO_NwtoIs",
    description: "Thể Tích Hình Hộp Chữ Nhật",
  },
  {
    id: "L5-19",
    lessonId: "L5",
    semester: 2,
    title: "Thể Tích Hình Lập Phương",
    videoUrl: "https://www.youtube.com/embed/99tkJuwuMNQ",
    description: "Thể Tích Hình Lập Phương",
  },
  {
    id: "L5-20",
    lessonId: "L5",
    semester: 2,
    title: "Tìm Số Khi Biết Giá Trị Phần Trăm",
    videoUrl: "https://www.youtube.com/embed/vqY27sQnDcM",
    description: "Tìm Số Khi Biết Giá Trị Phần Trăm",
  },
  {
    id: "L5-21",
    lessonId: "L5",
    semester: 2,
    title: "Cách Tìm Giá Trị Của 1 Số",
    videoUrl: "https://www.youtube.com/embed/coQV2_IKiac",
    description: "Cách Tìm Giá Trị Của 1 Số",
  },
];

/* ==================================================================================
   LOGIC GIAO DIỆN
   ================================================================================== */
const Lessons = () => {
  // State chọn Lớp
  const [selectedLessonId, setSelectedLessonId] = useState<string>("L5");

  // State chọn Học kì (Mặc định là 1)
  const [selectedSemester, setSelectedSemester] = useState<number>(1);

  // State tìm kiếm
  const [searchQuery, setSearchQuery] = useState("");

  // State chọn Bài giảng (Video)
  const [selectedTopicId, setSelectedTopicId] = useState<string>("");

  // LỌC DỮ LIỆU: Lớp + Học kì + Tìm kiếm
  const filteredTopics = useMemo(() => {
    return topicsData.filter(
      (t) =>
        t.lessonId === selectedLessonId &&
        t.semester === selectedSemester && // Thêm điều kiện học kì
        t.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [selectedLessonId, selectedSemester, searchQuery]);

  // Tự động chọn bài đầu tiên
  useEffect(() => {
    if (filteredTopics.length > 0) {
      if (
        !selectedTopicId ||
        !filteredTopics.find((t) => t.id === selectedTopicId)
      ) {
        setSelectedTopicId(filteredTopics[0].id);
      }
    } else {
      setSelectedTopicId("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredTopics]);

  const selectedLesson = lessonsData.find((l) => l.id === selectedLessonId);
  const selectedTopic = topicsData.find((t) => t.id === selectedTopicId);

return (
    // Dùng h-[100dvh] để cố định chiều cao trang bằng màn hình thiết bị
    <div className="flex h-[100dvh] flex-col bg-background overflow-hidden">
      
      {/* Header cố định */}
      <Header />

      {/* KHU VỰC GIỮA (Sidebar + Main): Chiếm hết khoảng trống còn lại */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* --- SIDEBAR TRÁI (320px) --- */}
        <div className="w-[320px] flex flex-col border-r bg-card shadow-sm z-10 flex-shrink-0">
          
          {/* Phần điều khiển (Không cuộn) */}
          <div className="flex-shrink-0 p-4 space-y-4 bg-card z-20">
            {/* Chọn Lớp */}
            <div>
              <label className="text-xs font-black text-muted-foreground uppercase mb-1.5 block tracking-wider">
                Lớp Học
              </label>
              <Select
                value={selectedLessonId}
                onValueChange={(val) => {
                  setSelectedLessonId(val);
                  setSearchQuery("");
                  setSelectedSemester(1);
                }}
              >
                <SelectTrigger className="w-full font-bold h-10 bg-background border-input hover:border-primary/50 transition-colors">
                  <SelectValue placeholder="Chọn lớp..." />
                </SelectTrigger>
                <SelectContent>
                  {lessonsData.map((lesson) => (
                    <SelectItem key={lesson.id} value={lesson.id}>
                      {lesson.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Chọn Học Kì */}
            <div className="bg-muted/50 p-1 rounded-lg border">
              <div className="grid grid-cols-2 gap-1">
                {[1, 2].map((sem) => (
                  <button
                    key={sem}
                    onClick={() => setSelectedSemester(sem)}
                    className={`text-xs font-bold py-1.5 rounded-md transition-all ${
                      selectedSemester === sem
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:bg-background hover:text-foreground"
                    }`}
                  >
                    Học kì {sem}
                  </button>
                ))}
              </div>
            </div>

            {/* Tìm kiếm */}
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm bài học..."
                className="pl-9 h-9 text-sm bg-background/50 focus:bg-background transition-colors"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <Separator />

          {/* Tiêu đề danh sách */}
          <div className="flex-shrink-0 p-3 bg-muted/20 border-b flex justify-between items-center">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              DANH SÁCH BÀI HỌC ({filteredTopics.length})
            </span>
          </div>

          {/* ScrollArea Sidebar */}
          <ScrollArea className="flex-1 bg-muted/5">
            <div className="p-3 space-y-2 pb-4">
              {filteredTopics.length > 0 ? (
                filteredTopics.map((topic, index) => (
                  <button
                    key={topic.id}
                    onClick={() => setSelectedTopicId(topic.id)}
                    className={`w-full text-left p-3 rounded-lg transition-all duration-200 border flex gap-3 group items-start relative ${
                      selectedTopicId === topic.id
                        ? "bg-primary/5 border-primary shadow-sm z-10"
                        : "bg-card border-transparent hover:border-border hover:shadow-sm"
                    }`}
                  >
                    {/* Đường kẻ active */}
                    {selectedTopicId === topic.id && (
                      <div className="absolute left-0 top-2 bottom-2 w-1 bg-primary rounded-r-full" />
                    )}

                    {/* Số thứ tự */}
                    <div className="flex-shrink-0 mt-0.5 ml-1">
                      {selectedTopicId === topic.id ? (
                        <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow-sm">
                          <Video className="h-3 w-3 fill-current" />
                        </div>
                      ) : (
                        <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground border border-border group-hover:border-primary/30 group-hover:text-primary transition-colors">
                          {index + 1}
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3
                        className={`text-sm font-semibold leading-snug mb-1.5 whitespace-normal ${
                          selectedTopicId === topic.id
                            ? "text-primary"
                            : "text-foreground group-hover:text-primary/80"
                        }`}
                      >
                        {topic.title}
                      </h3>
                      {topic.completed && (
                        <div className="flex items-center text-[10px] text-green-600 font-medium">
                          <CheckCircle className="h-3 w-3 mr-1" /> Đã học
                        </div>
                      )}
                    </div>
                  </button>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-muted-foreground px-4 text-center">
                  <p className="text-sm">Không tìm thấy bài học nào.</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* --- KHUNG CHÍNH (Video & Nội dung) --- */}
        <div className="flex-1 flex flex-col bg-background h-full relative overflow-hidden">
          {!selectedTopic ? (
            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8 text-center bg-muted/5">
              <BookOpen className="h-16 w-16 mb-4 opacity-20" />
              <h2 className="text-xl font-semibold mb-2">Chưa chọn bài học</h2>
              <p>Vui lòng chọn một bài học từ danh sách bên trái.</p>
            </div>
          ) : (
            // ScrollArea cho nội dung chính
            <ScrollArea className="flex-1 h-full">
              <div className="max-w-[1400px] mx-auto p-6 md:p-8 space-y-6 pb-10">
                
                {/* Breadcrumb & Title */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Badge variant="outline" className="rounded-md font-bold text-primary border-primary/20 bg-primary/5">
                      {selectedLesson?.title}
                    </Badge>
                    <span>/</span>
                    <span className="font-medium text-foreground">Học kì {selectedSemester}</span>
                  </div>
                  <h1 className="text-2xl md:text-3xl font-bold text-foreground leading-tight">
                    {selectedTopic.title}
                  </h1>
                </div>

                {/* Video Player */}
                <div className="w-full bg-black rounded-xl overflow-hidden shadow-2xl ring-1 ring-border/50">
                  <div className="aspect-video w-full relative">
                    <iframe
                      src={selectedTopic.videoUrl}
                      title={selectedTopic.title}
                      className="w-full h-full absolute inset-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>

                {/* Nội dung chi tiết */}
                <div className="grid lg:grid-cols-3 gap-8 items-start">
                  <div className="lg:col-span-2 space-y-6">
                    <div className="bg-card rounded-xl border p-6 shadow-sm">
                      <h3 className="font-bold text-lg flex items-center gap-2 mb-4 text-primary">
                        <BookOpen className="h-5 w-5" />
                        Nội dung tóm tắt
                      </h3>
                      <div className="prose prose-sm md:prose-base text-muted-foreground leading-relaxed">
                        <p>{selectedTopic.description}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 lg:sticky lg:top-4">
                    <div className="bg-card p-5 rounded-xl border shadow-sm space-y-4">
                      <Button className="w-full h-12 text-base font-semibold shadow-md" size="lg">
                        Làm bài tập ngay
                      </Button>
                      <Button variant="outline" className="w-full h-12 text-base justify-start">
                        <FileText className="h-5 w-5 mr-3 text-muted-foreground" />
                        Tải tài liệu PDF
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>
          )}
        </div>
      </div>

      {/* FOOTER NHỎ GỌN (Thay thế cho Footer lớn) */}
      <div className="border-t bg-card py-2 px-6 flex justify-between items-center text-xs text-muted-foreground z-20 shadow-[0_-5px_10px_rgba(0,0,0,0.05)]">
        <p>© 2024 VietEdu Odyssey. Học tập không giới hạn.</p>
        <div className="flex gap-4">
          <button className="hover:text-primary transition-colors">Điều khoản</button>
          <button className="hover:text-primary transition-colors">Trợ giúp</button>
        </div>
      </div>
    </div>
  );
};
export default Lessons;

import { useState, useMemo, useEffect } from "react";
import { PlayCircle, BookOpen, CheckCircle, Search, Video, FileText } from "lucide-react";
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
    completed: true
  },
  
  /* --- LỚP 5 --- */
  /* --- LỚP 5 - HỌC KÌ 1 --- */
  {
    id: "L5-1",
    lessonId: "L5",
    semester: 1,
    title: "Chia Một Số Tự Nhiên Cho Một Số Thập Phân",
    videoUrl: "https://www.youtube.com/embed/8Akzlx2xODc",
    description: "Chia Một Số Tự Nhiên Cho Một Số Thập Phân"
  },
  {
    id: "L5-2",
    lessonId: "L5",
    semester: 1,
    title: "Khái Niệm Hỗn Số",
    videoUrl: "https://www.youtube.com/embed/PFP0F64bxfI",
    description: "Khái Niệm Hỗn Số"
  },
  {
    id: "L5-3",
    lessonId: "L5",
    semester: 1,
    title: "Chuyển Đổi Hỗn Số Thành Phân Số",
    videoUrl: "https://www.youtube.com/embed/M5aZBfU4A7Y",
    description: "Chuyển Đổi Hỗn Số Thành Phân Số"
  },
  {
    id: "L5-4",
    lessonId: "L5",
    semester: 1,
    title: "Đọc, Viết Số Thập Phân",
    videoUrl: "https://www.youtube.com/embed/jKuVl8lSUSE",
    description: "Đọc, Viết Số Thập Phân"
  },
  {
    id: "L5-5",
    lessonId: "L5",
    semester: 1,
    title: "So Sánh 2 Số Thập Phân",
    videoUrl: "https://www.youtube.com/embed/NSUiNNCdTDE",
    description: "So Sánh 2 Số Thập Phân"
  },
  {
    id: "L5-6",
    lessonId: "L5",
    semester: 1,
    title: "Viết Số Đo Độ Dài Dưới Dạng Số Thập Phân",
    videoUrl: "https://www.youtube.com/embed/AjyO6GMldDY",
    description: "Viết Số Đo Độ Dài Dưới Dạng Số Thập Phân"
  },
  {
    id: "L5-7",
    lessonId: "L5",
    semester: 1,
    title: "Ôn tập phép nhân",
    videoUrl: "https://www.youtube.com/embed/S19Lbyt8U_0",
    description: "Trừ Các Số Thập Phân"
  },
  {
    id: "L5-8",
    lessonId: "L5",
    semester: 1,
    title: "Nhân Một Số Thập Phân Với Một Số Thập Phân",
    videoUrl: "https://www.youtube.com/embed/KhsxxdEo2QQ",
    description: "Nhân Một Số Thập Phân Với Một Số Thập Phân"
  },
  {
    id: "L5-9",
    lessonId: "L5",
    semester: 1,
    title: "Chia Một Số Thập Phân Với Một Số Thập Phân",
    videoUrl: "https://www.youtube.com/embed/aO0X57Mm91Q",
    description: "Chia Một Số Thập Phân Với Một Số Thập Phân"
  },
  {
    id: "L5-10",
    lessonId: "L5",
    semester: 1,
    title: "Làm Quen Với Tỉ Số Phần Trăm",
    videoUrl: "https://www.youtube.com/embed/_Cjo_FpPnqQ",
    description: "Làm Quen Với Tỉ Số Phần Trăm"
  },
  {
    id: "L5-11",
    lessonId: "L5",
    semester: 1,
    title: "Cách Tính Diện Tích Hình Tam Giác",
    videoUrl: "https://www.youtube.com/embed/clTUm_OZQb8",
    description: "Cách Tính Diện Tích Hình Tam Giác"
  },
  {
    id: "L5-12",
    lessonId: "L5",
    semester: 1,
    title: "Cách Tính Diện Tích Hình Thang",
    videoUrl: "https://www.youtube.com/embed/HMjoeADksbU",
    description: "Cách Tính Diện Tích Hình Thang"
  },

  /* --- LỚP 5 - HỌC KÌ 2 --- */
  {
    id: "L5-13",
    lessonId: "L5",
    semester: 2,
    title: "Cách Tính Diện Tích Hình Tròn",
    videoUrl: "https://www.youtube.com/embed/TzzJ9PTVoyA",
    description: "Cách Tính Diện Tích Hình Tròn"
  },
  {
    id: "L5-14",
    lessonId: "L5",
    semester: 2,
    title: "Cách Tính Thời Gian, Quãng Đường, Vận Tốc",
    videoUrl: "https://www.youtube.com/embed/zFjbAYD3w3w",
    description: "Cách Tính Thời Gian, Quãng Đường, Vận Tốc"
  },
  {
    id: "L5-15",
    lessonId: "L5",
    semester: 2,
    title: "Diện Tích Xung Quanh Và Diện Tích Toàn Phần Hình Hộp Chữ Nhật",
    videoUrl: "https://www.youtube.com/embed/0YrZsFToDIk",
    description: "Diện Tích Xung Quanh Và Diện Tích Toàn Phần Hình Hộp Chữ Nhật"
  },
  {
    id: "L5-16",
    lessonId: "L5",
    semester: 2,
    title: "Diện Tích Xung Quanh Và Diện Tích Toàn Phần Của Hình Lập Phương",
    videoUrl: "https://www.youtube.com/embed/TNgBCGNgl4Q",
    description: "Diện Tích Xung Quanh Và Diện Tích Toàn Phần Của Hình Lập Phương"
  },
  {
    id: "L5-17",
    lessonId: "L5",
    semester: 2,
    title: "Thể Tích Của Một Hình",
    videoUrl: "https://www.youtube.com/embed/rlGdd3rj3A4",
    description: "Thể Tích Của Một Hình"
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
    return topicsData.filter(t => 
      t.lessonId === selectedLessonId && 
      t.semester === selectedSemester && // Thêm điều kiện học kì
      t.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [selectedLessonId, selectedSemester, searchQuery]);

  // Tự động chọn bài đầu tiên
  useEffect(() => {
    if (filteredTopics.length > 0) {
      if (!selectedTopicId || !filteredTopics.find(t => t.id === selectedTopicId)) {
        setSelectedTopicId(filteredTopics[0].id);
      }
    } else {
        setSelectedTopicId(""); 
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredTopics]);

  const selectedLesson = lessonsData.find(l => l.id === selectedLessonId);
  const selectedTopic = topicsData.find(t => t.id === selectedTopicId);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      {/* KHU VỰC NỘI DUNG */}
      <div className="flex flex-1 overflow-hidden min-h-0 flex-shrink">
      
      {/* --- SIDEBAR TRÁI (320px) --- */}
      <div className="w-[320px] border-r flex flex-col bg-card shadow-sm z-10 flex-shrink-0">
        
        {/* Phần điều khiển trên cùng */}
        <div className="p-4 space-y-4">
          
          {/* 1. Chọn Lớp */}
          <div>
            <label className="text-sm font-black text-foreground uppercase mb-1.5 block tracking-wider">
              Lớp Học
            </label>
            <Select 
              value={selectedLessonId} 
              onValueChange={(val) => {
                setSelectedLessonId(val);
                setSearchQuery("");
                // Khi đổi lớp, có thể reset về học kì 1 hoặc giữ nguyên tuỳ ý
                setSelectedSemester(1); 
              }}
            >
              <SelectTrigger className="w-full font-bold h-11 bg-background border-2 hover:border-primary/50 transition-colors">
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

          {/* 2. Chọn Học Kì (Tabs) */}
          <div className="bg-muted/50 p-1 rounded-lg">
             <div className="grid grid-cols-2 gap-1">
                <button
                  onClick={() => setSelectedSemester(1)}
                  className={`text-sm font-black py-2 rounded-md transition-all ${
                    selectedSemester === 1 
                    ? "bg-primary text-primary-foreground shadow-lg scale-105" 
                    : "text-muted-foreground hover:bg-white/70 font-bold"
                  }`}
                >
                  Học kì 1
                </button>
                <button
                   onClick={() => setSelectedSemester(2)}
                   className={`text-sm font-black py-2 rounded-md transition-all ${
                    selectedSemester === 2
                    ? "bg-primary text-primary-foreground shadow-lg scale-105" 
                    : "text-muted-foreground hover:bg-white/70 font-bold"
                  }`}
                >
                  Học kì 2
                </button>
             </div>
          </div>

          {/* 3. Tìm kiếm */}
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Tìm bài học..." 
              className="pl-9 bg-background border-2 font-semibold h-11 focus:border-primary/50 transition-colors"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <Separator />

        {/* Danh sách chủ điểm (Topics) */}
        <div className="flex-1 overflow-hidden flex flex-col bg-muted/10">
          <div className="p-3 bg-gradient-to-r from-primary/10 to-primary/5 text-xs md:text-sm font-semibold text-foreground uppercase tracking-wider border-b border-primary/20 flex justify-between items-center">
             <span>Danh sách bài học</span>
             <Badge variant="outline" className="text-[10px] md:text-xs h-5 md:h-6 px-2 bg-background font-semibold border-primary/30">{filteredTopics.length} bài</Badge>
          </div>
          
          <ScrollArea className="flex-1">
            <div className="p-3 space-y-2">
              {filteredTopics.length > 0 ? (
                filteredTopics.map((topic, index) => (
                  <button
                    key={topic.id}
                    onClick={() => setSelectedTopicId(topic.id)}
                    className={`w-full text-left p-4 rounded-lg transition-all duration-300 border-2 flex gap-3 group items-start ${
                      selectedTopicId === topic.id
                        ? "bg-gradient-to-r from-primary/10 to-primary/5 border-primary shadow-lg scale-[1.02]"
                        : "bg-card hover:bg-muted/50 border-transparent hover:border-primary/30 shadow-md hover:shadow-lg hover:scale-[1.01]"
                    }`}
                  >
                    {/* Icon số thứ tự */}
                    <div className="flex-shrink-0 mt-0.5">
                       {selectedTopicId === topic.id ? (
                          <div className="h-7 w-7 rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow-lg ring-2 ring-primary/30">
                            <Video className="h-4 w-4 fill-current" />
                          </div>
                       ) : (
                          <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center text-xs font-black text-foreground group-hover:bg-primary/20 group-hover:text-primary group-hover:shadow-md transition-all border-2 border-muted-foreground/20 group-hover:border-primary/40">
                            {index + 1}
                          </div>
                       )}
                    </div>

                    <div className="flex-1 min-w-0">
                      {/* SỬA LỖI CẮT CHỮ: dùng whitespace-normal thay vì truncate */}
                      <h3 className={`text-sm md:text-base font-semibold leading-snug mb-1.5 whitespace-normal ${
                        selectedTopicId === topic.id ? "text-primary font-bold" : "text-foreground"
                      }`}>
                        {topic.title}
                      </h3>
                      
                      <div className="flex items-center gap-2 flex-wrap">
                        {topic.completed ? (
                          <Badge variant="secondary" className="text-[10px] md:text-xs h-5 md:h-6 px-2 bg-green-100 text-green-700 hover:bg-green-200 border border-green-300 font-medium">
                             <CheckCircle className="h-3 w-3 mr-1" /> Đã học
                          </Badge>
                        ) : (
                          <span className="text-[10px] md:text-xs text-foreground flex items-center bg-muted px-2 py-0.5 rounded-md font-medium border border-border">
                            <PlayCircle className="h-3 w-3 mr-1" /> 15p
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                ))
              ) : (
                <div className="text-center py-10 px-4 text-muted-foreground">
                  <FileText className="h-10 w-10 mx-auto mb-2 opacity-20" />
                  <p className="text-sm">Không tìm thấy bài học nào cho Học kì {selectedSemester}.</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* --- KHUNG CHÍNH (MAIN CONTENT) --- */}
      <div className="flex-1 flex flex-col bg-background h-full overflow-hidden relative">
        {!selectedTopic ? (
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8 text-center bg-muted/5">
            <BookOpen className="h-16 w-16 mb-4 opacity-20" />
            <h2 className="text-xl font-semibold mb-2">Chưa chọn bài học</h2>
            <p>Vui lòng chọn một bài học từ danh sách bên trái.</p>
          </div>
        ) : (
          <ScrollArea className="flex-1">
             {/* SỬA LỖI VIDEO BÉ: Tăng max-w từ 5xl lên 7xl hoặc full */}
             <div className="max-w-[1600px] mx-auto p-4 md:p-6 lg:p-8 space-y-6">
                
                {/* Header Bài Học */}
                <div className="flex flex-col gap-3">
                   <div className="flex items-center gap-3 text-sm md:text-base">
                      <span className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-3 py-1.5 rounded-lg text-xs md:text-sm font-bold uppercase tracking-wider shadow-md">
                        {selectedLesson?.title}
                      </span>
                      <span className="text-muted-foreground font-semibold">/</span>
                      <span className="bg-muted px-3 py-1.5 rounded-lg text-xs md:text-sm font-semibold">Học kì {selectedSemester}</span>
                   </div>
                   <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground leading-tight tracking-tight">
                      {selectedTopic.title}
                   </h1>
                </div>

                {/* Video Player*/}
                <div className="w-full bg-gradient-to-br from-black via-black to-gray-900 rounded-2xl overflow-hidden shadow-2xl ring-2 ring-primary/20 hover:ring-primary/40 transition-all duration-300">
                  {/* Aspect ratio giữ nguyên để video không bị méo, nhưng width sẽ full container */}
                  <div className="aspect-video w-full relative"> 
                    <iframe
                        src={selectedTopic.videoUrl}
                        title={selectedTopic.title}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                    {/* Overlay gradient effect */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
                  </div>
                </div>

                {/* Phần thông tin và nút bấm */}
                <div className="grid lg:grid-cols-3 gap-6 lg:gap-10">
                   {/* Cột trái: Nội dung mô tả */}
                   <div className="lg:col-span-2 space-y-6">
                      <div className="space-y-4">
                         <h3 className="font-semibold text-xl md:text-2xl flex items-center gap-3 border-b border-primary/20 pb-2 text-foreground">
                            <BookOpen className="h-6 w-6 text-primary" />
                            Nội dung bài học
                         </h3>
                         <div className="text-foreground/90 leading-relaxed text-base md:text-lg">
                            <p className="mb-3 font-semibold text-primary">{selectedTopic.description}</p>
                            <p className="mt-2">
                                Hãy xem kỹ video và ghi chép lại các công thức quan trọng. Sau khi xem xong, bạn có thể nhấn nút "Làm bài tập" bên cạnh để củng cố kiến thức.
                            </p>
                         </div>
                      </div>
                   </div>

                   {/* Cột phải: Actions Panel */}
                   <div className="space-y-4">
                      <div className="bg-gradient-to-br from-card to-card/95 p-5 rounded-xl border border-primary/10 shadow-md space-y-4 sticky top-4 backdrop-blur-sm">
                         <h4 className="font-semibold text-lg md:text-xl text-foreground mb-3 tracking-tight">Hoạt động học tập</h4>
                         
                         <Button className="w-full justify-start h-12 text-base font-semibold shadow hover:shadow-md transition-all duration-300" size="lg">
                            <div className="bg-white/20 p-1.5 rounded-lg mr-3">
                                <BookOpen className="h-6 w-6" />
                            </div>
                            Làm bài tập ngay
                         </Button>
                         
                         <Button variant="outline" className="w-full justify-start h-12 text-base font-medium border border-primary/30 hover:bg-primary/10 hover:text-primary hover:border-primary/50 transition-all duration-300">
                             <div className="bg-primary/10 p-1.5 rounded-lg mr-3 text-primary">
                                <FileText className="h-6 w-6" />
                             </div>
                             Tải tài liệu PDF
                         </Button>

                         <div className="pt-4 border-t-2 border-primary/20 mt-4">
                            <div className="text-xs font-medium text-center text-primary">
                               Hoàn thành bài học để nhận 20 XP
                            </div>
                         </div>
                      </div>
                   </div>
                </div>

             </div>
          </ScrollArea>
        )}
      </div>
      </div>
      <Footer className="mt-auto" />
    </div>
  );
};

export default Lessons;
import { useState } from "react";
import { Link } from "react-router-dom";
import { GraduationCap, Search, PlayCircle, BookOpen, CheckCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
  title: string;
  videoUrl: string;
  description: string;
  completed?: boolean;
}

const lessons: Lesson[] = [
  {
    id: "1",
    title: "Các số từ 0 đến 10",
    topicCount: 5,
    quizCount: 3,
    completed: false
  },
  {
    id: "2",
    title: "So sánh vị trí, nhiều ít, lớn bé",
    topicCount: 3,
    quizCount: 3,
    completed: false
  },
  {
    id: "3",
    title: "Hình học",
    topicCount: 2,
    quizCount: 2,
    completed: false
  },
  {
    id: "4",
    title: "Phép cộng trong phạm vi đến 10",
    topicCount: 4,
    quizCount: 3,
    completed: false
  }
];

const topics: Topic[] = [
  {
    id: "1.1",
    lessonId: "1",
    title: "1.1.1. Các số 1, 2, 3",
    videoUrl: "https://www.youtube.com/embed/EX8DR1YMlRE",
    description: "Học về các số cơ bản từ 1 đến 3 thông qua hình ảnh và hoạt động vui nhộn",
    completed: false
  },
  {
    id: "1.2",
    lessonId: "1",
    title: "1.1.2. Các số 4, 5, 6",
    videoUrl: "https://www.youtube.com/embed/EX8DR1YMlRE",
    description: "Tiếp tục làm quen với các số từ 4 đến 6",
    completed: false
  },
  {
    id: "1.3",
    lessonId: "1",
    title: "1.1.3. Các số 7, 8, 9",
    videoUrl: "https://www.youtube.com/embed/EX8DR1YMlRE",
    description: "Khám phá các số từ 7 đến 9",
    completed: false
  },
  {
    id: "1.4",
    lessonId: "1",
    title: "1.1.4. Số 10 và ôn tập",
    videoUrl: "https://www.youtube.com/embed/EX8DR1YMlRE",
    description: "Học số 10 và ôn tập tất cả các số đã học",
    completed: false
  }
];

const Lessons = () => {
  const [selectedGrade, setSelectedGrade] = useState("Lớp 1");
  const [selectedLesson, setSelectedLesson] = useState(lessons[0]);
  const [selectedTopic, setSelectedTopic] = useState(topics[0]);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredLessons = lessons.filter(lesson =>
    lesson.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentTopics = topics.filter(topic => topic.lessonId === selectedLesson.id);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2 hover-scale">
            <GraduationCap className="h-8 w-8 text-primary" />
            <span className="text-2xl font-heading font-bold text-primary">
              VietEdu Odyssey
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Button variant="outline" asChild>
              <Link to="/">Trang chủ</Link>
            </Button>
            <Button asChild>
              <Link to="/auth">Đăng nhập</Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-80 border-r bg-card h-[calc(100vh-4rem)] overflow-y-auto sticky top-16">
          <div className="p-4 space-y-4">
            {/* Title */}
            <div>
              <h2 className="text-2xl font-heading font-bold mb-2">
                Danh sách chủ điểm
              </h2>
              <div className="flex gap-2">
                <select
                  value={selectedGrade}
                  onChange={(e) => setSelectedGrade(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg border bg-background text-sm font-medium"
                >
                  <option>Lớp 1</option>
                  <option>Lớp 2</option>
                  <option>Lớp 3</option>
                  <option>Lớp 4</option>
                  <option>Lớp 5</option>
                </select>
                <select
                  className="px-3 py-2 rounded-lg border bg-background text-sm font-medium"
                >
                  <option>Toán bộ chủ đề</option>
                </select>
              </div>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm nhanh kỹ năng..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Lesson Tabs */}
            <div className="flex gap-2">
              <Button
                variant="default"
                className="flex-1 bg-primary text-primary-foreground"
              >
                Học kì 1
              </Button>
              <Button variant="ghost" className="flex-1">
                Học kì 2
              </Button>
            </div>

            {/* Lessons List */}
            <div className="space-y-2">
              {filteredLessons.map((lesson) => (
                <button
                  key={lesson.id}
                  onClick={() => {
                    setSelectedLesson(lesson);
                    const firstTopic = topics.find(t => t.lessonId === lesson.id);
                    if (firstTopic) setSelectedTopic(firstTopic);
                  }}
                  className={`w-full text-left p-4 rounded-xl transition-all ${
                    selectedLesson.id === lesson.id
                      ? "bg-primary/10 border-2 border-primary"
                      : "bg-background hover:bg-muted"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      lesson.completed 
                        ? "bg-success text-white" 
                        : selectedLesson.id === lesson.id
                        ? "bg-primary text-white"
                        : "bg-muted border-2 border-muted-foreground"
                    }`}>
                      {lesson.completed && <CheckCircle className="h-4 w-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-heading font-bold text-base mb-1 line-clamp-2">
                        {lesson.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Chủ điểm: {lesson.topicCount}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Bài kiểm tra: {lesson.quizCount}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 md:p-8">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Topic Header */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <BookOpen className="h-6 w-6 text-primary" />
                  <h1 className="text-3xl md:text-4xl font-heading font-bold">
                    {selectedLesson.title}
                  </h1>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <Badge variant="secondary" className="gap-1">
                    <PlayCircle className="h-3 w-3" />
                    0/{selectedLesson.topicCount} chủ điểm
                  </Badge>
                  <Badge variant="outline" className="gap-1">
                    0/{selectedLesson.quizCount} bài kiểm tra
                  </Badge>
                </div>
              </div>
              <div className="flex gap-2">
                <Badge variant="outline" className="text-muted-foreground">
                  Chưa thực hành
                </Badge>
                <Badge variant="outline" className="text-accent">
                  Đang thực hành
                </Badge>
                <Badge variant="outline" className="text-success">
                  Đã Hoàn Thành
                </Badge>
                <Badge variant="outline" className="text-destructive">
                  Chủ điểm còn yếu
                </Badge>
              </div>
            </div>

            {/* Video Player */}
            <div className="bg-card rounded-2xl overflow-hidden shadow-lg">
              <div className="aspect-video bg-black">
                <iframe
                  src={selectedTopic.videoUrl}
                  title={selectedTopic.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div className="p-6 space-y-4">
                <h2 className="text-2xl font-heading font-bold">
                  {selectedTopic.title}
                </h2>
                <p className="text-muted-foreground">
                  {selectedTopic.description}
                </p>
                <div className="flex gap-3">
                  <Button className="gap-2">
                    <PlayCircle className="h-4 w-4" />
                    VIDEO LÝ THUYẾT
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <BookOpen className="h-4 w-4" />
                    THỰC HÀNH
                  </Button>
                  <Button variant="outline" className="gap-2">
                    TIẾN ĐỘ
                  </Button>
                </div>
              </div>
            </div>

            {/* Topics Grid */}
            <div>
              <h3 className="text-xl font-heading font-bold mb-4">
                Các chủ điểm trong bài
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentTopics.map((topic) => (
                  <button
                    key={topic.id}
                    onClick={() => setSelectedTopic(topic)}
                    className={`bg-card rounded-xl overflow-hidden card-shadow hover-lift text-left transition-all ${
                      selectedTopic.id === topic.id ? "ring-2 ring-primary" : ""
                    }`}
                  >
                    <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 relative overflow-hidden">
                      <img
                        src="/placeholder.svg"
                        alt={topic.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <PlayCircle className="h-16 w-16 text-white opacity-80" />
                      </div>
                    </div>
                    <div className="p-4">
                      <h4 className="font-heading font-bold text-lg mb-1">
                        {topic.title}
                      </h4>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {topic.description}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Purchase Notice */}
            <div className="bg-card rounded-2xl p-8 text-center border-2 border-dashed border-primary/30">
              <p className="text-lg font-medium text-muted-foreground">
                Bạn cần mua khóa học để học chủ điểm này
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Lessons;

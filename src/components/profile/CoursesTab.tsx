import { Play, CheckCircle, Lock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface GameProgress {
  total_xp: number;
  level: number;
  current_node: number;
  completed_nodes: string[];
}

interface CoursesTabProps {
  gameProgress: GameProgress | null;
}

const COURSES = [
  {
    id: "trangquynh",
    name: "Trạng Quỳnh đi thi",
    description: "Rèn luyện tư duy logic cùng Trạng Quỳnh",
    grade: "Lớp 2",
    totalLessons: 10,
    image: "🎭",
    route: "/classroom/trangquynh",
    available: true,
  },
  {
    id: "12congiap",
    name: "Tí và cuộc đua cùng 12 con giáp",
    description: "Học toán qua truyện 12 con giáp",
    grade: "Lớp 1",
    totalLessons: 12,
    image: "🐭",
    route: null,
    available: false,
  },
  {
    id: "chuoi",
    name: "Hành trình đếm bánh chưng cùng chú Cuội",
    description: "Khám phá số đếm qua câu chuyện dân gian",
    grade: "Mầm non",
    totalLessons: 8,
    image: "🌝",
    route: null,
    available: false,
  },
  {
    id: "songhong",
    name: "Săn kho báu sông Hồng",
    description: "Phiêu lưu toán học trên dòng sông Hồng",
    grade: "Lớp 3",
    totalLessons: 15,
    image: "🏴‍☠️",
    route: null,
    available: false,
  },
];

const CoursesTab = ({ gameProgress }: CoursesTabProps) => {
  const navigate = useNavigate();
  const completedNodes = (gameProgress?.completed_nodes as string[]) || [];
  const currentNode = gameProgress?.current_node || 0;

  const getCourseProgress = (courseId: string) => {
    if (courseId === "trangquynh") {
      return {
        completed: completedNodes.length,
        total: 10,
        percentage: (completedNodes.length / 10) * 100,
      };
    }
    return { completed: 0, total: 10, percentage: 0 };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Khóa học của bạn</h2>
        <span className="text-sm text-muted-foreground">
          {COURSES.filter((c) => c.available).length} khóa học đang mở
        </span>
      </div>

      <div className="grid gap-4">
        {COURSES.map((course) => {
          const progress = getCourseProgress(course.id);
          const isStarted = progress.completed > 0;

          return (
            <Card
              key={course.id}
              className={`p-5 transition-all ${
                course.available
                  ? "hover:shadow-lg cursor-pointer"
                  : "opacity-60"
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-3xl shrink-0">
                  {course.image}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-lg truncate">{course.name}</h3>
                    <span className="px-2 py-0.5 text-xs rounded-full bg-primary/10 text-primary shrink-0">
                      {course.grade}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {course.description}
                  </p>

                  {course.available && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          {progress.completed}/{progress.total} bài học
                        </span>
                        <span className="font-medium text-primary">
                          {Math.round(progress.percentage)}%
                        </span>
                      </div>
                      <Progress value={progress.percentage} className="h-2" />
                    </div>
                  )}
                </div>

                <div className="shrink-0">
                  {course.available ? (
                    <Button
                      onClick={() => course.route && navigate(course.route)}
                      size="sm"
                      className="gap-2"
                    >
                      {isStarted ? (
                        <>
                          Tiếp tục <Play className="h-4 w-4" />
                        </>
                      ) : (
                        <>
                          Bắt đầu <Play className="h-4 w-4" />
                        </>
                      )}
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm" disabled className="gap-2">
                      <Lock className="h-4 w-4" />
                      Sắp ra mắt
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Quick Stats */}
      <Card className="p-6 bg-gradient-to-r from-primary/5 to-secondary/5">
        <h3 className="font-bold text-lg mb-4">Tổng quan học tập</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{completedNodes.length}</div>
            <div className="text-sm text-muted-foreground">Bài đã hoàn thành</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-secondary">{gameProgress?.total_xp || 0}</div>
            <div className="text-sm text-muted-foreground">XP tích lũy</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-500">{gameProgress?.level || 1}</div>
            <div className="text-sm text-muted-foreground">Cấp độ</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-500">
              {COURSES.filter((c) => c.available).length}
            </div>
            <div className="text-sm text-muted-foreground">Khóa học đang học</div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CoursesTab;

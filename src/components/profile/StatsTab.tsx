import { Award, Flame, Star, Trophy, Target, Zap } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface GameProgress {
  total_xp: number;
  total_points: number;
  level: number;
  earned_badges: string[];
}

interface StreakData {
  current_streak: number;
  longest_streak: number;
  total_learning_days: number;
}

interface Achievement {
  id: string;
  achievement_id: string;
  achievement_name: string;
  achievement_icon: string;
  achievement_description: string;
  earned_at: string;
}

interface StatsTabProps {
  gameProgress: GameProgress | null;
  streak: StreakData | null;
  achievements: Achievement[];
}

const AVAILABLE_ACHIEVEMENTS = [
  { id: "first-lesson", name: "Bài học đầu tiên", icon: "🎯", description: "Hoàn thành bài học đầu tiên" },
  { id: "streak-3", name: "Kiên trì 3 ngày", icon: "🔥", description: "Học liên tục 3 ngày" },
  { id: "streak-7", name: "Kiên trì 7 ngày", icon: "💪", description: "Học liên tục 7 ngày" },
  { id: "streak-30", name: "Bậc thầy kiên trì", icon: "👑", description: "Học liên tục 30 ngày" },
  { id: "xp-100", name: "Tích lũy XP", icon: "⭐", description: "Đạt 100 XP" },
  { id: "xp-500", name: "Ngôi sao XP", icon: "🌟", description: "Đạt 500 XP" },
  { id: "xp-1000", name: "Siêu sao XP", icon: "✨", description: "Đạt 1000 XP" },
  { id: "perfect-lesson", name: "Hoàn hảo", icon: "💯", description: "Hoàn thành bài học không sai" },
  { id: "speed-demon", name: "Thần tốc", icon: "⚡", description: "Hoàn thành trong thời gian kỷ lục" },
  { id: "math-master", name: "Bậc thầy toán học", icon: "🧮", description: "Hoàn thành 10 bài toán" },
  { id: "explorer", name: "Nhà thám hiểm", icon: "🔍", description: "Khám phá 5 chủ đề mới" },
  { id: "helper", name: "Người giúp đỡ", icon: "🤝", description: "Giúp đỡ bạn bè học tập" },
];

const StatsTab = ({ gameProgress, streak, achievements }: StatsTabProps) => {
  const earnedAchievementIds = achievements.map(a => a.achievement_id);
  const xpForNextLevel = (gameProgress?.level || 1) * 200;
  const xpProgress = ((gameProgress?.total_xp || 0) % 200) / 2;

  return (
    <div className="space-y-6">
      {/* Main Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-5 text-center bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3">
            <Zap className="h-6 w-6 text-primary" />
          </div>
          <div className="text-3xl font-bold text-primary">{gameProgress?.total_xp || 0}</div>
          <div className="text-sm text-muted-foreground">Tổng XP</div>
        </Card>
        
        <Card className="p-5 text-center bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/20">
          <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center mx-auto mb-3">
            <Star className="h-6 w-6 text-secondary" />
          </div>
          <div className="text-3xl font-bold text-secondary">{gameProgress?.total_points || 0}</div>
          <div className="text-sm text-muted-foreground">Điểm</div>
        </Card>
        
        <Card className="p-5 text-center bg-gradient-to-br from-orange-500/10 to-orange-500/5 border-orange-500/20">
          <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center mx-auto mb-3">
            <Flame className="h-6 w-6 text-orange-500" />
          </div>
          <div className="text-3xl font-bold text-orange-500">{streak?.current_streak || 0}</div>
          <div className="text-sm text-muted-foreground">Chuỗi ngày</div>
        </Card>
        
        <Card className="p-5 text-center bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/20">
          <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto mb-3">
            <Trophy className="h-6 w-6 text-purple-500" />
          </div>
          <div className="text-3xl font-bold text-purple-500">{gameProgress?.level || 1}</div>
          <div className="text-sm text-muted-foreground">Cấp độ</div>
        </Card>
      </div>

      {/* Level Progress */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-lg">Tiến độ cấp độ</h3>
          <span className="text-sm text-muted-foreground">
            {(gameProgress?.total_xp || 0) % 200} / 200 XP
          </span>
        </div>
        <Progress value={xpProgress} className="h-3" />
        <p className="text-sm text-muted-foreground mt-2">
          Còn {200 - ((gameProgress?.total_xp || 0) % 200)} XP để lên cấp {(gameProgress?.level || 1) + 1}
        </p>
      </Card>

      {/* Streak Section */}
      <Card className="p-6 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30 border-orange-200 dark:border-orange-800">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
            <Flame className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-orange-700 dark:text-orange-300">Giữ chuỗi học tập</h3>
            <p className="text-sm text-orange-600/70 dark:text-orange-400/70">Học mỗi ngày để giữ chuỗi!</p>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="text-center p-3 bg-white/60 dark:bg-black/20 rounded-xl">
            <div className="text-2xl font-bold text-orange-600">{streak?.current_streak || 0}</div>
            <div className="text-xs text-muted-foreground">Chuỗi hiện tại</div>
          </div>
          <div className="text-center p-3 bg-white/60 dark:bg-black/20 rounded-xl">
            <div className="text-2xl font-bold text-orange-600">{streak?.longest_streak || 0}</div>
            <div className="text-xs text-muted-foreground">Kỷ lục</div>
          </div>
          <div className="text-center p-3 bg-white/60 dark:bg-black/20 rounded-xl">
            <div className="text-2xl font-bold text-orange-600">{streak?.total_learning_days || 0}</div>
            <div className="text-xs text-muted-foreground">Tổng ngày học</div>
          </div>
        </div>
      </Card>

      {/* Achievements Section */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Award className="h-6 w-6 text-primary" />
          <h3 className="font-bold text-xl">Thành tựu & Huy hiệu</h3>
          <span className="ml-auto text-sm text-muted-foreground">
            {achievements.length}/{AVAILABLE_ACHIEVEMENTS.length} đã mở
          </span>
        </div>
        
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
          {AVAILABLE_ACHIEVEMENTS.map((achievement) => {
            const isEarned = earnedAchievementIds.includes(achievement.id);
            return (
              <div
                key={achievement.id}
                className={`relative flex flex-col items-center p-3 rounded-xl transition-all ${
                  isEarned 
                    ? "bg-primary/10 hover:bg-primary/20" 
                    : "bg-muted/50 opacity-50 grayscale"
                }`}
                title={achievement.description}
              >
                <span className="text-3xl mb-2">{achievement.icon}</span>
                <span className="text-xs text-center font-medium line-clamp-2">
                  {achievement.name}
                </span>
                {!isEarned && (
                  <div className="absolute inset-0 flex items-center justify-center bg-background/50 rounded-xl">
                    <span className="text-2xl">🔒</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {/* Game Badges */}
      {gameProgress?.earned_badges && gameProgress.earned_badges.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Target className="h-6 w-6 text-secondary" />
            <h3 className="font-bold text-xl">Huy hiệu trong game</h3>
          </div>
          <div className="flex flex-wrap gap-4">
            {gameProgress.earned_badges.map((badge, index) => (
              <div
                key={index}
                className="text-4xl hover:scale-110 transition-transform cursor-pointer"
                title={`Huy hiệu ${index + 1}`}
              >
                {badge}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default StatsTab;

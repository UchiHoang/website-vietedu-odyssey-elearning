import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from "recharts";
import { Calendar, TrendingUp, Clock, Target, BookOpen, Award } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface GameProgress {
  total_xp: number;
  total_points: number;
  level: number;
  completed_nodes: string[];
}

interface StreakData {
  current_streak: number;
  longest_streak: number;
  total_learning_days: number;
}

interface DailyActivity {
  activity_date: string;
  xp_earned: number;
  points_earned: number;
  lessons_completed: number;
  time_spent_minutes: number;
}

interface AnalyticsTabProps {
  gameProgress: GameProgress | null;
  streak: StreakData | null;
}

const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const AnalyticsTab = ({ gameProgress, streak }: AnalyticsTabProps) => {
  const [dailyActivity, setDailyActivity] = useState<DailyActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "all">("7d");

  useEffect(() => {
    loadDailyActivity();
  }, []);

  const loadDailyActivity = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data, error } = await supabase
        .from("daily_activity")
        .select("*")
        .eq("user_id", session.user.id)
        .order("activity_date", { ascending: true });

      if (error) throw error;
      setDailyActivity(data || []);
    } catch (error) {
      console.error("Error loading daily activity:", error);
    } finally {
      setLoading(false);
    }
  };

  // Generate mock data if no real data
  const getMockData = () => {
    const days = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 60;
    const data = [];
    const today = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      data.push({
        date: date.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" }),
        xp: Math.floor(Math.random() * 100) + 20,
        points: Math.floor(Math.random() * 50) + 10,
        lessons: Math.floor(Math.random() * 3) + 1,
        time: Math.floor(Math.random() * 45) + 15,
      });
    }
    return data;
  };

  const chartData = dailyActivity.length > 0
    ? dailyActivity.map(d => ({
        date: new Date(d.activity_date).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" }),
        xp: d.xp_earned,
        points: d.points_earned,
        lessons: d.lessons_completed,
        time: d.time_spent_minutes,
      }))
    : getMockData();

  // Calculate summary stats
  const totalXP = chartData.reduce((sum, d) => sum + d.xp, 0);
  const totalPoints = chartData.reduce((sum, d) => sum + d.points, 0);
  const totalLessons = chartData.reduce((sum, d) => sum + d.lessons, 0);
  const totalTime = chartData.reduce((sum, d) => sum + d.time, 0);
  const avgXPPerDay = Math.round(totalXP / chartData.length);
  const avgTimePerDay = Math.round(totalTime / chartData.length);

  // Subject distribution (mock data)
  const subjectData = [
    { name: "Đếm số", value: 35, color: "#22c55e" },
    { name: "Phép cộng", value: 25, color: "#3b82f6" },
    { name: "Phép trừ", value: 20, color: "#f59e0b" },
    { name: "Hình học", value: 12, color: "#8b5cf6" },
    { name: "So sánh", value: 8, color: "#ec4899" },
  ];

  // Performance by time of day (mock data)
  const performanceByTime = [
    { time: "Sáng (6-12h)", accuracy: 85, sessions: 12 },
    { time: "Chiều (12-18h)", accuracy: 78, sessions: 8 },
    { time: "Tối (18-22h)", accuracy: 82, sessions: 15 },
  ];

  return (
    <div className="space-y-6">
      {/* Header with time range selector */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Phân tích học tập</h2>
          <p className="text-muted-foreground">Theo dõi tiến độ và hiệu suất học tập</p>
        </div>
        <Tabs value={timeRange} onValueChange={(v) => setTimeRange(v as any)}>
          <TabsList>
            <TabsTrigger value="7d">7 ngày</TabsTrigger>
            <TabsTrigger value="30d">30 ngày</TabsTrigger>
            <TabsTrigger value="all">Tất cả</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-green-200 dark:border-green-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tổng XP</p>
              <p className="text-2xl font-bold text-green-600">{gameProgress?.total_xp || totalXP}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Bài đã học</p>
              <p className="text-2xl font-bold text-blue-600">{gameProgress?.completed_nodes?.length || totalLessons}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 border-orange-200 dark:border-orange-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
              <Clock className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Thời gian học</p>
              <p className="text-2xl font-bold text-orange-600">{totalTime} phút</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/30 dark:to-violet-950/30 border-purple-200 dark:border-purple-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <Target className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Chuỗi ngày</p>
              <p className="text-2xl font-bold text-purple-600">{streak?.current_streak || 0}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* XP Progress Chart */}
        <Card className="p-6">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Tiến độ XP theo ngày
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorXp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="date" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }} 
              />
              <Area 
                type="monotone" 
                dataKey="xp" 
                stroke="#22c55e" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorXp)" 
                name="XP"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Time Spent Chart */}
        <Card className="p-6">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-500" />
            Thời gian học (phút)
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="date" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }} 
              />
              <Bar dataKey="time" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Phút" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Subject Distribution */}
        <Card className="p-6">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-purple-500" />
            Phân bổ chủ đề học
          </h3>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width="50%" height={200}>
              <PieChart>
                <Pie
                  data={subjectData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {subjectData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2">
              {subjectData.map((subject) => (
                <div key={subject.name} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: subject.color }}
                  />
                  <span className="text-sm">{subject.name}</span>
                  <span className="text-sm text-muted-foreground ml-auto">{subject.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Performance by Time */}
        <Card className="p-6">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <Award className="h-5 w-5 text-orange-500" />
            Hiệu suất theo thời gian trong ngày
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={performanceByTime} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis type="number" domain={[0, 100]} className="text-xs" />
              <YAxis dataKey="time" type="category" width={100} className="text-xs" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }} 
              />
              <Bar dataKey="accuracy" fill="#f59e0b" radius={[0, 4, 4, 0]} name="Độ chính xác %" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Weekly Comparison */}
      <Card className="p-6">
        <h3 className="font-bold text-lg mb-4">So sánh tuần này với tuần trước</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-muted/50 rounded-xl">
            <p className="text-sm text-muted-foreground mb-1">XP/ngày</p>
            <p className="text-2xl font-bold">{avgXPPerDay}</p>
            <p className="text-xs text-green-500">+12% so với tuần trước</p>
          </div>
          <div className="text-center p-4 bg-muted/50 rounded-xl">
            <p className="text-sm text-muted-foreground mb-1">Thời gian/ngày</p>
            <p className="text-2xl font-bold">{avgTimePerDay} phút</p>
            <p className="text-xs text-green-500">+8% so với tuần trước</p>
          </div>
          <div className="text-center p-4 bg-muted/50 rounded-xl">
            <p className="text-sm text-muted-foreground mb-1">Độ chính xác</p>
            <p className="text-2xl font-bold">82%</p>
            <p className="text-xs text-green-500">+5% so với tuần trước</p>
          </div>
          <div className="text-center p-4 bg-muted/50 rounded-xl">
            <p className="text-sm text-muted-foreground mb-1">Bài hoàn thành</p>
            <p className="text-2xl font-bold">{totalLessons}</p>
            <p className="text-xs text-red-500">-3% so với tuần trước</p>
          </div>
        </div>
      </Card>

      {/* Parent Tips */}
      <Card className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 border-indigo-200 dark:border-indigo-800">
        <h3 className="font-bold text-lg text-indigo-700 dark:text-indigo-300 mb-3">
          📊 Gợi ý cho phụ huynh
        </h3>
        <ul className="space-y-2 text-sm text-indigo-600/80 dark:text-indigo-400/80">
          <li>• Con bạn học tốt nhất vào <strong>buổi tối (18-22h)</strong> với độ chính xác cao nhất</li>
          <li>• Chuỗi học tập hiện tại: <strong>{streak?.current_streak || 0} ngày</strong> - Hãy khuyến khích con duy trì!</li>
          <li>• Chủ đề cần cải thiện: <strong>So sánh số</strong> (chỉ chiếm 8% thời gian học)</li>
          <li>• Gợi ý: Tăng thời gian học lên <strong>30 phút/ngày</strong> để đạt tiến độ tốt hơn</li>
        </ul>
      </Card>
    </div>
  );
};

export default AnalyticsTab;

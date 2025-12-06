import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, Users, Award, Clock } from "lucide-react";

const ReportsTab = () => {
  const [totalStudents, setTotalStudents] = useState(0);
  const [averageXP, setAverageXP] = useState(0);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    // Get total students
    const { count } = await supabase
      .from("user_roles")
      .select("*", { count: "exact", head: true })
      .eq("role", "student");

    setTotalStudents(count || 0);

    // Get average XP
    const { data: progressData } = await supabase
      .from("game_progress")
      .select("total_xp");

    if (progressData && progressData.length > 0) {
      const avg = progressData.reduce((sum, p) => sum + (p.total_xp || 0), 0) / progressData.length;
      setAverageXP(Math.round(avg));
    }
  };

  // Mock data for charts
  const weeklyData = [
    { name: "T2", students: 45, xp: 1200 },
    { name: "T3", students: 52, xp: 1800 },
    { name: "T4", students: 48, xp: 1500 },
    { name: "T5", students: 60, xp: 2200 },
    { name: "T6", students: 55, xp: 1900 },
    { name: "T7", students: 40, xp: 1100 },
    { name: "CN", students: 35, xp: 900 },
  ];

  const subjectData = [
    { name: "Phép cộng", value: 35, color: "#22c55e" },
    { name: "Phép trừ", value: 25, color: "#3b82f6" },
    { name: "Phép nhân", value: 20, color: "#f59e0b" },
    { name: "Hình học", value: 20, color: "#ef4444" },
  ];

  const monthlyProgress = [
    { month: "T1", completed: 120 },
    { month: "T2", completed: 150 },
    { month: "T3", completed: 180 },
    { month: "T4", completed: 220 },
    { month: "T5", completed: 250 },
    { month: "T6", completed: 280 },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Báo cáo & Thống kê</h2>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/20 rounded-xl">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tổng học sinh</p>
                <p className="text-2xl font-bold">{totalStudents}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-500/20 rounded-xl">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">XP trung bình</p>
                <p className="text-2xl font-bold">{averageXP}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-amber-500/20 rounded-xl">
                <Award className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Bài học hoàn thành</p>
                <p className="text-2xl font-bold">1,280</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-500/20 rounded-xl">
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Giờ học TB/ngày</p>
                <p className="text-2xl font-bold">45 phút</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Hoạt động trong tuần</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="name" className="text-sm" />
                <YAxis className="text-sm" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }} 
                />
                <Bar dataKey="students" name="Học sinh" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Subject Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Phân bố theo chủ đề</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={subjectData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {subjectData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              {subjectData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm">{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Monthly Progress */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Tiến độ theo tháng</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyProgress}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" className="text-sm" />
                <YAxis className="text-sm" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="completed" 
                  name="Bài hoàn thành"
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3}
                  dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReportsTab;

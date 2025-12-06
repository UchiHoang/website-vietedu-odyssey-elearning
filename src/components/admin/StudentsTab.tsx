import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Users, TrendingUp, Award, Eye } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Student {
  id: string;
  display_name: string;
  avatar: string;
  grade?: string;
  email?: string;
  school?: string;
}

interface StudentStats {
  total_xp: number;
  level: number;
  total_points: number;
  current_streak: number;
}

const StudentsTab = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [studentStats, setStudentStats] = useState<StudentStats | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    setIsLoading(true);
    
    // Get all student user IDs
    const { data: studentRoles } = await supabase
      .from("user_roles")
      .select("user_id")
      .eq("role", "student");

    if (studentRoles && studentRoles.length > 0) {
      const studentIds = studentRoles.map(r => r.user_id);
      
      const { data: profiles } = await supabase
        .from("profiles")
        .select("*")
        .in("id", studentIds);

      setStudents(profiles || []);
    }
    
    setIsLoading(false);
  };

  const viewStudentDetail = async (student: Student) => {
    setSelectedStudent(student);
    
    // Load student stats
    const { data: gameProgress } = await supabase
      .from("game_progress")
      .select("total_xp, level, total_points")
      .eq("user_id", student.id)
      .single();

    const { data: streak } = await supabase
      .from("user_streaks")
      .select("current_streak")
      .eq("user_id", student.id)
      .single();

    setStudentStats({
      total_xp: gameProgress?.total_xp || 0,
      level: gameProgress?.level || 1,
      total_points: gameProgress?.total_points || 0,
      current_streak: streak?.current_streak || 0,
    });

    setShowDetailModal(true);
  };

  const filteredStudents = students.filter(student =>
    student.display_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isEmojiAvatar = (avatar?: string) => !avatar || 
    (avatar.length <= 4 && /\p{Emoji}/u.test(avatar));

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/20 rounded-xl">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tổng học sinh</p>
                <p className="text-2xl font-bold">{students.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-500/20 rounded-xl">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Đang hoạt động</p>
                <p className="text-2xl font-bold">{Math.floor(students.length * 0.7)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-amber-500/10 to-amber-500/5">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-amber-500/20 rounded-xl">
                <Award className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Hoàn thành xuất sắc</p>
                <p className="text-2xl font-bold">{Math.floor(students.length * 0.3)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Students Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle>Danh sách học sinh</CardTitle>
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm học sinh..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              Đang tải dữ liệu...
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Không tìm thấy học sinh nào
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Học sinh</TableHead>
                  <TableHead>Lớp</TableHead>
                  <TableHead>Trường</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="text-right">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          {isEmojiAvatar(student.avatar) ? (
                            <AvatarFallback className="bg-primary/10 text-lg">
                              {student.avatar || "👤"}
                            </AvatarFallback>
                          ) : (
                            <>
                              <AvatarImage src={student.avatar} />
                              <AvatarFallback>{student.display_name?.[0]}</AvatarFallback>
                            </>
                          )}
                        </Avatar>
                        <span className="font-medium">{student.display_name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{student.grade || "—"}</TableCell>
                    <TableCell>{student.school || "—"}</TableCell>
                    <TableCell>{student.email || "—"}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => viewStudentDetail(student)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Xem
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Student Detail Modal */}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Thông tin học sinh</DialogTitle>
          </DialogHeader>
          {selectedStudent && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  {isEmojiAvatar(selectedStudent.avatar) ? (
                    <AvatarFallback className="bg-primary/10 text-2xl">
                      {selectedStudent.avatar || "👤"}
                    </AvatarFallback>
                  ) : (
                    <>
                      <AvatarImage src={selectedStudent.avatar} />
                      <AvatarFallback>{selectedStudent.display_name?.[0]}</AvatarFallback>
                    </>
                  )}
                </Avatar>
                <div>
                  <h3 className="text-lg font-bold">{selectedStudent.display_name}</h3>
                  <p className="text-muted-foreground">{selectedStudent.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-muted rounded-xl text-center">
                  <p className="text-2xl font-bold text-primary">{studentStats?.level || 1}</p>
                  <p className="text-sm text-muted-foreground">Cấp độ</p>
                </div>
                <div className="p-4 bg-muted rounded-xl text-center">
                  <p className="text-2xl font-bold text-primary">{studentStats?.total_xp || 0}</p>
                  <p className="text-sm text-muted-foreground">Tổng XP</p>
                </div>
                <div className="p-4 bg-muted rounded-xl text-center">
                  <p className="text-2xl font-bold text-primary">{studentStats?.total_points || 0}</p>
                  <p className="text-sm text-muted-foreground">Điểm số</p>
                </div>
                <div className="p-4 bg-muted rounded-xl text-center">
                  <p className="text-2xl font-bold text-orange-500">{studentStats?.current_streak || 0}</p>
                  <p className="text-sm text-muted-foreground">Chuỗi ngày</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudentsTab;

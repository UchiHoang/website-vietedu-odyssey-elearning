import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Users, Plus } from "lucide-react";

const ClassesTab = () => {
  const classes = [
    { id: 1, name: "Lớp 2A", students: 25, subject: "Toán học", progress: 75 },
    { id: 2, name: "Lớp 2B", students: 28, subject: "Toán học", progress: 60 },
    { id: 3, name: "Lớp 3A", students: 30, subject: "Toán học", progress: 45 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Quản lý lớp học</h2>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Tạo lớp mới
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {classes.map((cls) => (
          <Card key={cls.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground">{cls.subject}</span>
              </div>
              <CardTitle className="mt-2">{cls.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>{cls.students} học sinh</span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Tiến độ</span>
                    <span className="font-medium">{cls.progress}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${cls.progress}%` }}
                    />
                  </div>
                </div>

                <Button variant="outline" className="w-full">
                  Xem chi tiết
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ClassesTab;

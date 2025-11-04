export const classes = [
  {
    level: "Mầm non",
    title: "Hành trình đếm bánh chưng cùng chú Cuội",
    ageRange: "3-5",
    image: "/src/assets/class-preschool.png",
    description: "Khám phá số đếm qua câu chuyện dân gian",
    gameRoute: "/classroom/preschool"
  },
  {
    level: "Lớp 1",
    title: "Tí và cuộc đua cùng 12 con giáp",
    ageRange: "6-7",
    image: "/src/assets/class-grade1.png",
    description: "Học toán qua truyện 12 con giáp",
    gameRoute: null
  },
  {
    level: "Lớp 2",
    title: "Trạng Quỳnh đi thi",
    ageRange: "7-8",
    image: "/src/assets/class-grade2.jpg",
    description: "Rèn luyện tư duy logic cùng Trạng Quỳnh",
    gameRoute: "/classroom/trangquynh"
  },
  {
    level: "Lớp 3",
    title: "Săn kho báu sông Hồng",
    ageRange: "8-9",
    image: "/src/assets/class-grade3.jpg",
    description: "Phiêu lưu toán học trên dòng sông Hồng",
    gameRoute: null
  },
  {
    level: "Lớp 4",
    title: "Thám hiểm Cổ Loa thành",
    ageRange: "9-10",
    image: "/src/assets/class-grade4.jpg",
    description: "Khám phá lịch sử qua bài toán",
    gameRoute: null
  },
  {
    level: "Lớp 5",
    title: "Bảo vệ đất nước cùng Trạng Nguyên",
    ageRange: "10-11",
    image: "/src/assets/class-grade5.jpg",
    description: "Toán học nâng cao với tinh thần yêu nước",
    gameRoute: null
  }
];

export const leaderboard = [
  { rank: 1, name: "Mai An", points: 1240, avatar: "👧" },
  { rank: 2, name: "Nam Khoa", points: 1120, avatar: "👦" },
  { rank: 3, name: "Linh Chi", points: 985, avatar: "👧" },
  { rank: 4, name: "Minh Tuấn", points: 920, avatar: "👦" },
  { rank: 5, name: "Hà My", points: 880, avatar: "👧" }
];

export const badges = [
  { id: 1, name: "Bản lĩnh", icon: "⭐️", description: "Hoàn thành 10 bài học" },
  { id: 2, name: "Toán nhỏ", icon: "🌟", description: "Đạt điểm cao trong toán" },
  { id: 3, name: "Khám phá", icon: "🔍", description: "Khám phá 5 chủ đề mới" },
  { id: 4, name: "Kiên trì", icon: "💪", description: "Học liên tục 7 ngày" },
  { id: 5, name: "Thần tốc", icon: "⚡", description: "Hoàn thành nhanh nhất" },
  { id: 6, name: "Sáng tạo", icon: "🎨", description: "Giải bài toán sáng tạo" }
];

export const userProfile = {
  id: "u123",
  name: "Bé Hương",
  level: "Lớp 2",
  points: 320,
  badges: ["⭐️", "🌟"],
  avatar: "👧"
};

export type UserRole = "student" | "teacher" | "admin";

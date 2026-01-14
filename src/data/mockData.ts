// Import images
import preSchoolImg from "@/assets/class-preschool.png";
import grade1Img from "@/assets/class-grade1.png";
import grade2Img from "@/assets/class-grade2.png";
import grade3Img from "@/assets/class-grade3.png";
import grade4Img from "@/assets/class-grade4.png";
import grade5Img from "@/assets/class-grade5.jpg";

export const classes = [
  {
    level: "Mầm non",
    title: "Hành trình chú Cuội đến Cung Trăng",
    ageRange: "3-5",
    image: preSchoolImg,
    description: "Khám phá số đếm qua câu chuyện dân gian",
    gameRoute: "/classroom/preschool",
  },
  {
    level: "Lớp 1",
    title: "Tí và cuộc đua cùng 12 con giáp",
    ageRange: "6-7",
    image: grade1Img,
    description: "Học toán qua truyện 12 con giáp",
    gameRoute: "/classroom/grade1",
  },
  {
    level: "Lớp 2",
    title: "Trạng Quỳnh đi thi",
    ageRange: "7-8",
    image: grade2Img,
    description: "Rèn luyện tư duy logic cùng Trạng Quỳnh",
    gameRoute: "/classroom/trangquynh",
  },
  {
    level: "Lớp 3",
    title: "Sơn Tinh - Thủy Tinh",
    ageRange: "8-9",
    image: grade3Img,
    description: "Cuộc tranh tài giữa Sơn Tinh và Thủy Tinh",
    gameRoute: "/classroom/songhong",
  },
  {
    level: "Lớp 4",
    title: "Thánh Gióng bay về trời",
    ageRange: "9-10",
    image: grade4Img,
    description: "Giúp Gióng ăn no, lớn nhanh, đánh giặc Ân",
    gameRoute: "/classroom/grade4",
  },
  {
    level: "Lớp 5",
    title: "Bảo vệ đất nước cùng Trạng Nguyên",
    ageRange: "10-11",
    image: grade5Img,
    description: "Toán học nâng cao với tinh thần yêu nước",
    gameRoute: "/classroom/grade5",
  },
];

export const leaderboard = [
  { rank: 1, name: "Nguyễn Phú Cường", points: 1240, avatar: "👦" },
  { rank: 2, name: "Đặng Lê Thiên Ân", points: 1120, avatar: "👧" },
  { rank: 3, name: "Võ Hữu Thiên Ngân", points: 985, avatar: "👧" },
  { rank: 4, name: "Nguyễn Trần Ngọc Nhi", points: 920, avatar: "👧" },
  { rank: 5, name: "Quách Quốc Phúc Thịnh", points: 880, avatar: "👦" },
  { rank: 6, name: "Nguyễn Trung Quân", points: 840, avatar: "👦" },
  { rank: 7, name: "Lê Cát Mỹ Anh", points: 800, avatar: "👧" },
  { rank: 8, name: "Mai Anh Khôi", points: 760, avatar: "👦" },
  { rank: 9, name: "Nguyễn Trần Minh Ngọc", points: 720, avatar: "👧" },
  { rank: 10, name: "Nguyễn Bùi Trúc Linh", points: 680, avatar: "👧" },
];

export const badges = [
  {
    id: 1,
    name: "Bản lĩnh",
    icon: "⭐️",
    description: "Hoàn thành 10 bài học",
  },
  {
    id: 2,
    name: "Toán nhỏ",
    icon: "🌟",
    description: "Đạt điểm cao trong toán",
  },
  { id: 3, name: "Khám phá", icon: "🔍", description: "Khám phá 5 chủ đề mới" },
  { id: 4, name: "Kiên trì", icon: "💪", description: "Học liên tục 7 ngày" },
  { id: 5, name: "Thần tốc", icon: "⚡", description: "Hoàn thành nhanh nhất" },
  {
    id: 6,
    name: "Sáng tạo",
    icon: "🎨",
    description: "Giải bài toán sáng tạo",
  },
];

export const userProfile = {
  id: "u123",
  name: "Bé Hương",
  level: "Lớp 2",
  points: 320,
  badges: ["⭐️", "🌟"],
  avatar: "👧",
};

export type UserRole = "student" | "teacher" | "admin";

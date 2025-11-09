import curriculumGrade0 from "@/data/curriculum.grade0.json";
import curriculumGrade1 from "@/data/curriculum.grade1.json";
import curriculumGrade5 from "@/data/curriculum.grade5.json";
import storyGrade0 from "@/data/story.grade0.trangquynh.json";
import storyGrade1 from "@/data/story.grade1.trangquynh.json";
import storyGrade5 from "@/data/story.grade5.trangquynh.json";
import { Story, Curriculum, Question } from "@/types/game";

export interface Activity {
  id: string;
  questions: Question[];
  xpReward?: number;
}

export function loadStory(grade: string = "1"): Story {
  switch (grade) {
    case "0":
      return storyGrade0 as Story;
    case "1":
      return storyGrade1 as Story;
    case "5":
      return storyGrade5 as Story;
    default:
      return storyGrade1 as Story;
  }
}

export function findActivityByRef(
  activityRef: string,
  grade: string = "1"
): Activity | null {
  let curriculum: Curriculum;

  switch (grade) {
    case "0":
      curriculum = curriculumGrade0 as Curriculum;
      break;
    case "1":
      curriculum = curriculumGrade1 as Curriculum;
      break;
    case "5":
      curriculum = curriculumGrade5 as Curriculum;
      break;
    default:
      curriculum = curriculumGrade1 as Curriculum;
  }

  // Parse activityRef format: "gradeX.cY.lZ.aW"
  const parts = activityRef.split(".");
  if (parts.length !== 4) return null;

  const chapterId = parts[1].replace("c", "");
  const lessonId = parts[2].replace("l", "");
  const activityId = parts[3].replace("a", "");

  const chapter = curriculum.chapters.find((ch) => ch.id.includes(chapterId));
  if (!chapter) return null;

  const lesson = chapter.lessons.find((les) => les.id.includes(lessonId));
  if (!lesson) return null;

  return {
    id: activityRef,
    questions: lesson.questions,
    xpReward: 10, // Default XP reward
  };
}

export function getBadgeInfo(badgeId: string | null) {
  if (!badgeId) return null;

  const badges: Record<string, { name: string; description: string }> = {
    "count-helper": {
      name: "Trợ thủ đếm số",
      description: "Giúp chú Cuội đếm bánh chưng",
    },
    "little-wrapper": {
      name: "Gói bánh nhí",
      description: "Gói bánh chưng thành thạo",
    },
    "cuoi-helper": {
      name: "Bạn của Cuội",
      description: "Hoàn thành hành trình với chú Cuội",
    },
    "speed-math": {
      name: "Tính toán nhanh",
      description: "Giải phép tính thần tốc",
    },
    "fast-thinker": {
      name: "Suy nghĩ nhanh",
      description: "Tốc độ tư duy đỉnh cao",
    },
    "memory-math": {
      name: "Nhớ giỏi tính tài",
      description: "Tính toán có nhớ xuất sắc",
    },
    "zodiac-champion": {
      name: "Nhà vô địch",
      description: "Chiến thắng cuộc đua 12 con giáp",
    },
    "decimal-master": {
      name: "Bậc thầy số thập phân",
      description: "Thành thạo số thập phân",
    },
    "wall-calculator": {
      name: "Kỹ sư thành lũy",
      description: "Tính toán xây thành chính xác",
    },
    "supply-master": {
      name: "Quản lý hậu cần",
      description: "Tính toán lương thảo hoàn hảo",
    },
    "measurement-expert": {
      name: "Chuyên gia đo đạc",
      description: "Đo đạc diện tích chuẩn xác",
    },
    "country-protector": {
      name: "Bảo vệ tổ quốc",
      description: "Hoàn thành sứ mệnh bảo vệ đất nước",
    },
  };

  return (
    badges[badgeId] || { name: "Huy hiệu", description: "Hoàn thành thử thách" }
  );
}

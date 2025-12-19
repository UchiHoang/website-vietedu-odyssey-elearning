import { supabase } from "@/integrations/supabase/client";

// Re-use interface từ framework cũ
export interface Question {
  id: string;
  type: "multiple-choice" | "matching-pairs" | "drag-drop" | "fill-blank" | "counting" | "interactive-choice";
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface Activity {
  id: string;
  title: string;
  duration?: number;
  questions: Question[];
  xpReward?: number;
  timerSec?: number;
}

export interface StoryNode {
  id: string;
  order: number;
  title: string;
  mathTopic: string;
  objective: string;
  cutscene: any[];
  activityRef: string;
  badgeOnComplete?: string;
  assets?: {
    bg?: string;
    sprite_main_idle?: string;
    sprite_main_cheer?: string;
    icon?: string;
  };
}

export interface StoryData {
  meta: {
    storyPackId: string;
    title: string;
    description: string;
  };
  prologue: any[];
  nodes: StoryNode[];
}

export const loadGrade5Story = async (): Promise<StoryData> => {
  // bạn đã upload story.grade5.trangquynh.json vào bảng storyGrade5
  const { data, error } = await supabase
    .from("storyGrade5" as any) 
    .select("*")
    .limit(1);

  if (error) throw new Error(error.message);
  if (!data || data.length === 0) throw new Error("No story data found");
  return (data[0] as any).metadata as unknown as StoryData;
};

export const loadGrade5Curriculum = async (): Promise<any> => {
  const { data, error } = await supabase
    .from("curriculumGrade5" as any) // Đảm bảo bảng này tồn tại
    .select("*")
    .limit(1);  

  if (error) throw new Error(error.message);
  if (!data || data.length === 0) throw new Error("No curriculum data found");
  return (data[0] as any).metadata;
};

export const findActivityByRef = (activityRef: string, curriculum: any): Activity | null => {
  console.log("Looking for activityRef:", activityRef);
  console.log("Curriculum structure:", curriculum);
  
  // Try different parsing patterns
  const parts = activityRef.split("."); // grade5.c1.l1.a1
  
  if (parts.length !== 4) {
    console.error("Invalid activityRef format:", activityRef);
    return null;
  }
  
  // Extract chapter and lesson numbers
  const chapterId = parts[1]; // "c1"
  const lessonId = parts[2]; // "l1"
  
  console.log("Looking for chapter:", chapterId, "lesson:", lessonId);
  
  // Find the chapter
  const chapter = curriculum.chapters?.find((chap: any) => chap.id === chapterId || chap.id === "c1");
  
  if (!chapter) {
    console.error("Chapter not found:", chapterId);
    console.log("Available chapters:", curriculum.chapters?.map((c: any) => c.id));
    return null;
  }
  
  // Find the lesson
  const lesson = chapter.lessons?.find((les: any) => 
    les.id === lessonId || 
    les.id === `lesson-${lessonId.replace('l', '')}` ||
    les.id.includes(lessonId)
  );
  
  if (!lesson) {
    console.error("Lesson not found:", lessonId);
    console.log("Available lessons:", chapter.lessons?.map((l: any) => l.id));
    return null;
  }
  
  console.log("Found lesson:", lesson);
  
  // Create activity from lesson
  return {
    id: activityRef,
    title: lesson.title,
    duration: lesson.duration,
    questions: lesson.questions.map((q: any) => ({
      id: q.id,
      type: q.type as any,
      question: q.question,
      options: q.options,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation
    })),
    xpReward: 15,
    timerSec: lesson.duration ? lesson.duration * 60 : undefined // Convert minutes to seconds
  };
};

export const getBadgeInfo = (badgeId: string) => {
  const badges: Record<string, { name: string; icon: string; description: string }> = {
    "decimal-master": {
      name: "Trạng Nguyên Số Thập Phân",
      icon: "/assets/user/icon_badge.png",
      description: "Am hiểu về các con số thập phân"
    },
    "wall-calculator": {
      name: "Kỹ Sư Thành Lũy",
      icon: "/assets/user/icon_puzzle.png",
      description: "Tính toán chính xác chiều dài thành"
    },
    "supply-master": {
      name: "Đại Thần Quân Lương",
      icon: "/assets/user/icon_sack.png",
      description: "Quản lý lương thảo tài tình"
    },
    "country-protector": {
      name: "Hộ Quốc Trạng Nguyên",
      icon: "/assets/user/icon_badge.png",
      description: "Người bảo vệ bờ cõi bằng trí tuệ"
    }
  };
  return badges[badgeId] || { name: "Huy hiệu", icon: "/assets/user/icon_badge.png", description: "Hoàn thành thử thách" };
};
//import storyData from "@/data/story.grade3.songhong.json";
//import curriculumData from "@/data/curriculum.grade3.json";
import { supabase } from "@/integrations/supabase/client";

export interface Question {
  id: string;
  type: "multiple-choice" | "matching-pairs" | "drag-drop" | "fill-blank" | "counting";
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
    alt?: {
      bg?: string;
      sprite_main_idle?: string;
      sprite_main_cheer?: string;
      icon?: string;
    };
  };
}

export interface StoryData {
  meta: {
    storyPackId: string;
    title: string;
    locale: string;
    description: string;
  };
  prologue: any[];
  nodes: StoryNode[];
}

export const loadStory = async (): Promise<StoryData> => {
  const { data, error } = await supabase
    .from("storyGrade3" as any)
    .select("*")
    .limit(1);

  if (error) throw new Error(error.message);
  if (!data || data.length === 0) throw new Error("No story data found");

  return data[0].metadata as unknown as StoryData;
};

export const loadCurriculum = async (): Promise<any> => {
  const { data, error } = await supabase
    .from("curriculumGrade3" as any)
    .select("*")
    .limit(1);  

  if (error) {
    throw new Error(error.message);
  }

  console.log("Fetched data:", data);

  if (Array.isArray(data) && data.length > 0) {
    return data[0].metadata;
  }

  throw new Error("No curriculum data found");
};


export const findActivityByRef = (activityRef: string, curriculum: any): Activity | null => {
  // Parse activityRef like "grade3.c1.l1.a1"
  const parts = activityRef.split(".");
  
  if (parts.length < 4) return null;
  
  const chapterIndex = parseInt(parts[1].replace("c", "")) - 1;
  const lessonIndex = parseInt(parts[2].replace("l", "")) - 1;
  
  //const curriculum = curriculumData as any;
  
  if (!curriculum.chapters || !curriculum.chapters[chapterIndex]) {
    return createFallbackActivity(activityRef);
  }
  
  const chapter = curriculum.chapters[chapterIndex];
  if (!chapter.lessons || !chapter.lessons[lessonIndex]) {
    return createFallbackActivity(activityRef);
  }
  
  const lesson = chapter.lessons[lessonIndex];
  
  return {
    id: activityRef,
    title: lesson.title || "Bài học",
    duration: lesson.duration || 120,
    questions: lesson.questions || [],
    xpReward: 10,
    timerSec: lesson.timerSec
  };
};

const createFallbackActivity = (ref: string): Activity => {
  return {
    id: ref,
    title: "Đang cập nhật",
    questions: [
      {
        id: "fallback1",
        type: "multiple-choice",
        question: "6 × 7 = ?",
        options: ["40", "42", "44", "46"],
        correctAnswer: 1,
        explanation: "6 × 7 = 42"
      }
    ],
    xpReward: 10
  };
};

export const getBadgeInfo = (badgeId: string) => {
  const badges: Record<string, { name: string; icon: string; description: string }> = {
    "multiplication-master": {
      name: "Huy hiệu Nhân giỏi",
      icon: "/assets/user/icon_badge.png",
      description: "Hoàn thành thử thách phép nhân"
    },
    "division-master": {
      name: "Huy hiệu Chia giỏi",
      icon: "/assets/user/icon_badge.png",
      description: "Hoàn thành thử thách phép chia"
    },
    "geometry-master": {
      name: "Huy hiệu Hình học",
      icon: "/assets/user/icon_badge.png",
      description: "Hoàn thành thử thách hình học"
    },
    "treasure-hunter": {
      name: "Huy hiệu Thợ săn kho báu",
      icon: "/assets/user/icon_badge.png",
      description: "Hoàn thành hành trình săn kho báu"
    },
    "grade3-master": {
      name: "Huy hiệu Giỏi toán lớp 3",
      icon: "/assets/user/icon_badge.png",
      description: "Hoàn thành tất cả thử thách lớp 3"
    }
  };
  
  return badges[badgeId] || {
    name: "Huy hiệu",
    icon: "/assets/user/icon_badge.png",
    description: "Hoàn thành thử thách"
  };
};


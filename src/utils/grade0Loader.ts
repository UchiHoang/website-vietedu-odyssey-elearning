import storyData from "@/data/story.grade0.trangquynh.json";
import curriculumData from "@/data/curriculum.grade0.json";

export interface Question {
  id: string;
  type: string;
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

export const loadStory = (): StoryData => {
  return storyData as StoryData;
};

export const findActivityByRef = (activityRef: string): Activity | null => {
  // Parse activityRef like "grade0.c1.l1.a1"
  const parts = activityRef.split(".");
  
  if (parts.length < 4) return null;
  
  const chapterIndex = parseInt(parts[1].replace("c", "")) - 1;
  const lessonIndex = parseInt(parts[2].replace("l", "")) - 1;
  
  const curriculum = curriculumData as any;
  
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
        question: "10 + 5 = ?",
        options: ["15", "20", "25", "30"],
        correctAnswer: 0,
        explanation: "10 + 5 = 15"
      }
    ],
    xpReward: 10
  };
};

export const getBadgeInfo = (badgeId: string) => {
  const badges: Record<string, { name: string; icon: string; description: string }> = {
    "addition-master": {
      name: "Huy hiệu Tính nhanh",
      icon: "/assets/user/icon_badge.png",
      description: "Hoàn thành thử thách phép cộng"
    },
    "subtraction-master": {
      name: "Huy hiệu Tư duy",
      icon: "/assets/user/icon_badge.png",
      description: "Hoàn thành thử thách phép trừ"
    },
    "measurement-master": {
      name: "Huy hiệu Đo lường",
      icon: "/assets/user/icon_badge.png",
      description: "Hoàn thành thử thách đo lường"
    },
    "time-master": {
      name: "Huy hiệu Thời gian",
      icon: "/assets/user/icon_clock.png",
      description: "Hoàn thành thử thách về thời gian"
    },
    "money-master": {
      name: "Huy hiệu Tiền tệ",
      icon: "/assets/user/icon_money.png",
      description: "Hoàn thành thử thách về tiền"
    },
    "grade2-master": {
      name: "Huy hiệu Giỏi toán lớp 2",
      icon: "/assets/user/icon_badge.png",
      description: "Hoàn thành tất cả thử thách lớp 2"
    }
  };
  
  return badges[badgeId] || {
    name: "Huy hiệu",
    icon: "/assets/user/icon_badge.png",
    description: "Hoàn thành thử thách"
  };
};

export interface Question {
  id: string;
  type: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface Lesson {
  id: string;
  title: string;
  duration: number;
  questions: Question[];
}

export interface Chapter {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  lessons: Lesson[];
}

export interface Curriculum {
  grade: string;
  chapters: Chapter[];
}

export interface CutsceneFrame {
  speaker: string;
  text: string;
  sprite?: string;
  bg?: string;
}

export interface VoiceLine {
  speaker: string;
  text: string;
}

export interface StoryAssets {
  bg?: string;
  sprite_main_idle?: string;
  sprite_main_cheer?: string;
  sprite_main_think?: string;
  sprite_guard?: string;
  sprite_owner?: string;
  sprite_teacher?: string;
  sprite_clock?: string;
  sprite_fisher?: string;
  sprite_ruler?: string;
  sprite_mother?: string;
  sprite_scale?: string;
  icon?: string;
  alt?: {
    bg?: string;
    sprite_opponent?: string;
    sprite_main_idle?: string;
    sprite_main_think?: string;
    sprite_main_busy?: string;
    sprite_main_cheer?: string;
    sprite_kids?: string;
    icon?: string;
  };
}

export interface StoryNode {
  id: string;
  order: number;
  title: string;
  mathTopic: string;
  objective: string;
  cutscene: CutsceneFrame[];
  voiceLines: VoiceLine[];
  assets: StoryAssets;
  activityRef: string;
  xpOnCorrect: number;
  badgeOnComplete: string | null;
  hint: string;
}

export interface StoryPrologueFrame {
  id: string;
  bg: string;
  sprite: string;
  speaker: string;
  text: string;
}

export interface StoryMeta {
  storyPackId: string;
  title: string;
  layout: string;
  locale: string;
  description: string;
}

export interface Story {
  meta: StoryMeta;
  legalNote: string;
  prologue: StoryPrologueFrame[];
  nodes: StoryNode[];
}

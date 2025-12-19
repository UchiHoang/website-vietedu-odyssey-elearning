import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface GameProgress {
  currentNodeIndex: number;
  completedNodes: string[];
  totalXp: number;
  earnedBadges: string[];
  currentQuestionIndex: number;
  correctAnswers: number;
  incorrectAnswers: number;
}

const STORAGE_KEY = "trangnguyen_progress_v5";

const defaultProgress: GameProgress = {
  currentNodeIndex: 0,
  completedNodes: [],
  totalXp: 0,
  earnedBadges: [],
  currentQuestionIndex: 0,
  correctAnswers: 0,
  incorrectAnswers: 0
};

export const useGrade5Engine = (id: string) => {
  const [progress, setProgress] = useState<GameProgress>(defaultProgress);

  useEffect(() => {
    const loadProgress = async () => {
      // Sử dụng 'as any' cho tên bảng để tránh lỗi đỏ ở .from()
      const { data, error } = await supabase
        .from("progressGrade5" as any)
        .select("*")
        .single();

      if (!error && data) {
        // FIX LỖI Ở ĐÂY: Chuyển qua 'unknown' trước khi ép sang 'GameProgress'
        setProgress(data as unknown as GameProgress);
      }
    };
    loadProgress();
  }, [id]);

  const updateRemoteProgress = async (newProgress: GameProgress) => {
    // Ép kiểu 'as any' cho dữ liệu update nếu cần thiết
    const { error } = await supabase
      .from("progressGrade5" as any)
      .update(newProgress as any)
      .eq("id", Number(id));

    if (error) console.error("Update error:", error);
  };

  const recordAnswer = useCallback((isCorrect: boolean, xpReward: number = 15) => {
    setProgress(prev => {
      const newProgress = {
        ...prev,
        correctAnswers: isCorrect ? prev.correctAnswers + 1 : prev.correctAnswers,
        incorrectAnswers: !isCorrect ? prev.incorrectAnswers + 1 : prev.incorrectAnswers,
        totalXp: isCorrect ? prev.totalXp + xpReward : prev.totalXp
      };
      updateRemoteProgress(newProgress);
      return newProgress;
    });
  }, [id]);

  const nextQuestion = useCallback(() => {
    setProgress(prev => ({
      ...prev,
      currentQuestionIndex: prev.currentQuestionIndex + 1
    }));
  }, []);

  const completeNode = useCallback((nodeId: string, badgeId?: string) => {
    setProgress(prev => {
      const newProgress = {
        ...prev,
        completedNodes: [...prev.completedNodes, nodeId],
        currentNodeIndex: prev.currentNodeIndex + 1,
        currentQuestionIndex: 0,
        correctAnswers: 0,
        incorrectAnswers: 0,
        earnedBadges: badgeId && !prev.earnedBadges.includes(badgeId) 
          ? [...prev.earnedBadges, badgeId] 
          : prev.earnedBadges
      };
      updateRemoteProgress(newProgress);
      return newProgress;
    });
  }, [id]);

  const selectNode = useCallback((nodeIndex: number) => {
    setProgress(prev => ({
      ...prev,
      currentNodeIndex: nodeIndex,
      currentQuestionIndex: 0,
      correctAnswers: 0,
      incorrectAnswers: 0
    }));
  }, []);

  const resetProgress = useCallback(() => {
    setProgress(defaultProgress);
    updateRemoteProgress(defaultProgress);
  }, [id]);

  return {
    progress,
    recordAnswer,
    nextQuestion,
    completeNode,
    resetProgress,
    selectNode
  };
};
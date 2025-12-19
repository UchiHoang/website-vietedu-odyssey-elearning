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

const STORAGE_KEY = "zodiac_progress";

const defaultProgress: GameProgress = {
  currentNodeIndex: 0,
  completedNodes: [],
  totalXp: 0,
  earnedBadges: [],
  currentQuestionIndex: 0,
  correctAnswers: 0,
  incorrectAnswers: 0
};

export const useGameEngine = (id: string) => {

  const [progress, setProgress] = useState<GameProgress | null>(defaultProgress);

  // Load từ backend
  useEffect(() => {
      const loadProgress = async () => {
        const { data, error } = await supabase
          .from("progressGrade1")
          .select("*")
          //.eq("id", id)
          .single();
  
        if (error) {
          console.error(error);
          return;
        }
        if (data) {
          setProgress(data as GameProgress);
        }
      };
      loadProgress();
    }, [id]);
  
    // Update Supabase khi progress thay đổi
    useEffect(() => {
      const updateProgress = async () => {
        const { error } = await supabase
          .from("progressGrade1")
          .update(progress)
          .eq("id", Number(id));
  
        if (error) console.error(error);
      };
      updateProgress();
    }, [progress, id]);

  const awardXp = useCallback((amount: number) => {
    setProgress(prev => ({
      ...prev,
      totalXp: prev.totalXp + amount
    }));
  }, []);

  const awardBadge = useCallback((badgeId: string) => {
    setProgress(prev => {
      if (prev.earnedBadges.includes(badgeId)) return prev;
      return {
        ...prev,
        earnedBadges: [...prev.earnedBadges, badgeId]
      };
    });
  }, []);

  const recordAnswer = useCallback((isCorrect: boolean, xpReward: number = 10) => {
    setProgress(prev => ({
      ...prev,
      correctAnswers: isCorrect ? prev.correctAnswers + 1 : prev.correctAnswers,
      incorrectAnswers: !isCorrect ? prev.incorrectAnswers + 1 : prev.incorrectAnswers
    }));
    
    if (isCorrect) {
      awardXp(xpReward);
    }
  }, [awardXp]);

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
        incorrectAnswers: 0
      };
      return newProgress;
    });
    
    if (badgeId) {
      awardBadge(badgeId);
    }
  }, [awardBadge]);

  const resetProgress = useCallback(() => {
    const newProgress = {
      currentNodeIndex: 0,
      completedNodes: [],
      totalXp: 0,
      earnedBadges: [],
      currentQuestionIndex: 0,
      correctAnswers: 0,
      incorrectAnswers: 0
    };
    setProgress(newProgress);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newProgress));
  }, []);

  const selectNode = useCallback((nodeIndex: number) => {
    setProgress(prev => ({
      ...prev,
      currentNodeIndex: nodeIndex,
      currentQuestionIndex: 0,
      correctAnswers: 0,
      incorrectAnswers: 0
    }));
  }, []);

  return {
    progress,
    awardXp,
    awardBadge,
    recordAnswer,
    nextQuestion,
    completeNode,
    resetProgress,
    selectNode
  };
};

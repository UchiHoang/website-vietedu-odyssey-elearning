import { useState, useEffect, useCallback } from "react";

export interface GameProgress {
  currentNodeIndex: number;
  completedNodes: string[];
  totalXp: number;
  earnedBadges: string[];
  currentQuestionIndex: number;
  correctAnswers: number;
  incorrectAnswers: number;
}

const STORAGE_KEY = "trangquynh_progress";

export const useGameEngine = () => {
  const [progress, setProgress] = useState<GameProgress>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return {
          currentNodeIndex: 0,
          completedNodes: [],
          totalXp: 0,
          earnedBadges: [],
          currentQuestionIndex: 0,
          correctAnswers: 0,
          incorrectAnswers: 0
        };
      }
    }
    return {
      currentNodeIndex: 0,
      completedNodes: [],
      totalXp: 0,
      earnedBadges: [],
      currentQuestionIndex: 0,
      correctAnswers: 0,
      incorrectAnswers: 0
    };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

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

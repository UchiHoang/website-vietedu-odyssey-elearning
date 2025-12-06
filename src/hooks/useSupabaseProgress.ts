import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface UserProgress {
  xp: number;
  points: number;
  level: number;
  currentNode: number;
  completedNodes: string[];
  earnedBadges: string[];
  streak: {
    current: number;
    longest: number;
    totalDays: number;
  };
  leaderboardPoints: number;
  leaderboardRank: number | null;
}

export interface StageResult {
  success: boolean;
  xpEarned: number;
  totalXp: number;
  newLevel: number;
  levelUp: boolean;
  completed: boolean;
  accuracy: number;
  isNewBest: boolean;
  attemptNumber: number;
  badgeEarned: string | null;
}

export interface BadgeResult {
  success: boolean;
  alreadyEarned?: boolean;
  badgeId?: string;
  earnedAt?: string;
  message?: string;
}

const DEFAULT_PROGRESS: UserProgress = {
  xp: 0,
  points: 0,
  level: 1,
  currentNode: 0,
  completedNodes: [],
  earnedBadges: [],
  streak: { current: 0, longest: 0, totalDays: 0 },
  leaderboardPoints: 0,
  leaderboardRank: null,
};

export const useSupabaseProgress = () => {
  const [progress, setProgress] = useState<UserProgress>(DEFAULT_PROGRESS);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user progress from database
  const fetchProgress = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error: rpcError } = await supabase.rpc('get_user_progress');

      if (rpcError) {
        console.error('Error fetching progress:', rpcError);
        setError(rpcError.message);
        return;
      }

      if (data) {
        const progressData = data as Record<string, unknown>;
        setProgress({
          xp: (progressData.xp as number) || 0,
          points: (progressData.points as number) || 0,
          level: (progressData.level as number) || 1,
          currentNode: (progressData.current_node as number) || 0,
          completedNodes: (progressData.completed_nodes as string[]) || [],
          earnedBadges: (progressData.earned_badges as string[]) || [],
          streak: {
            current: ((progressData.streak as Record<string, number>)?.current) || 0,
            longest: ((progressData.streak as Record<string, number>)?.longest) || 0,
            totalDays: ((progressData.streak as Record<string, number>)?.total_days) || 0,
          },
          leaderboardPoints: (progressData.leaderboard_points as number) || 0,
          leaderboardRank: (progressData.leaderboard_rank as number) || null,
        });
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('Failed to load progress');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Complete a stage - atomic operation
  const completeStage = useCallback(async (
    stageId: string,
    courseId: string,
    score: number,
    maxScore: number,
    correctAnswers: number,
    totalQuestions: number,
    timeSpentSeconds: number
  ): Promise<StageResult | null> => {
    try {
      const { data, error: rpcError } = await supabase.rpc('complete_stage', {
        p_stage_id: stageId,
        p_course_id: courseId,
        p_score: score,
        p_max_score: maxScore,
        p_correct_answers: correctAnswers,
        p_total_questions: totalQuestions,
        p_time_spent_seconds: timeSpentSeconds,
      });

      if (rpcError) {
        console.error('Error completing stage:', rpcError);
        toast.error('Không thể lưu tiến độ');
        return null;
      }

      const result = data as Record<string, unknown>;
      const stageResult: StageResult = {
        success: result.success as boolean,
        xpEarned: result.xp_earned as number,
        totalXp: result.total_xp as number,
        newLevel: result.new_level as number,
        levelUp: result.level_up as boolean,
        completed: result.completed as boolean,
        accuracy: result.accuracy as number,
        isNewBest: result.is_new_best as boolean,
        attemptNumber: result.attempt_number as number,
        badgeEarned: result.badge_earned as string | null,
      };

      // Update local state
      setProgress(prev => ({
        ...prev,
        xp: stageResult.totalXp,
        level: stageResult.newLevel,
        points: prev.points + score,
        completedNodes: stageResult.completed && !prev.completedNodes.includes(stageId)
          ? [...prev.completedNodes, stageId]
          : prev.completedNodes,
      }));

      if (stageResult.levelUp) {
        toast.success(`🎉 Lên cấp ${stageResult.newLevel}!`);
      }

      return stageResult;
    } catch (err) {
      console.error('Unexpected error completing stage:', err);
      toast.error('Lỗi khi lưu tiến độ');
      return null;
    }
  }, []);

  // Unlock a badge - atomic with duplicate prevention
  const unlockBadge = useCallback(async (
    badgeId: string,
    badgeName: string,
    badgeDescription?: string,
    badgeIcon?: string
  ): Promise<BadgeResult | null> => {
    try {
      const { data, error: rpcError } = await supabase.rpc('unlock_badge', {
        p_badge_id: badgeId,
        p_badge_name: badgeName,
        p_badge_description: badgeDescription || null,
        p_badge_icon: badgeIcon || '🏆',
      });

      if (rpcError) {
        console.error('Error unlocking badge:', rpcError);
        return null;
      }

      const result = data as Record<string, unknown>;
      const badgeResult: BadgeResult = {
        success: result.success as boolean,
        alreadyEarned: result.already_earned as boolean,
        badgeId: result.badge_id as string,
        earnedAt: result.earned_at as string,
        message: result.message as string,
      };

      if (badgeResult.success) {
        setProgress(prev => ({
          ...prev,
          earnedBadges: prev.earnedBadges.includes(badgeId)
            ? prev.earnedBadges
            : [...prev.earnedBadges, badgeId],
        }));
        toast.success(`🏆 Huy hiệu mới: ${badgeName}`);
      }

      return badgeResult;
    } catch (err) {
      console.error('Unexpected error unlocking badge:', err);
      return null;
    }
  }, []);

  // Update current node position
  const updateCurrentNode = useCallback(async (nodeIndex: number) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error: updateError } = await supabase
        .from('game_progress')
        .update({ current_node: nodeIndex, updated_at: new Date().toISOString() })
        .eq('user_id', user.id);

      if (updateError) {
        console.error('Error updating current node:', updateError);
        return;
      }

      setProgress(prev => ({ ...prev, currentNode: nodeIndex }));
    } catch (err) {
      console.error('Unexpected error:', err);
    }
  }, []);

  // Reset progress (for testing/admin)
  const resetProgress = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase
        .from('game_progress')
        .update({
          total_xp: 0,
          total_points: 0,
          level: 1,
          current_node: 0,
          completed_nodes: [],
          earned_badges: [],
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id);

      setProgress(DEFAULT_PROGRESS);
      toast.success('Đã đặt lại tiến độ');
    } catch (err) {
      console.error('Error resetting progress:', err);
    }
  }, []);

  // Get stage history
  const getStageHistory = useCallback(async (stageId?: string, courseId?: string) => {
    try {
      let query = supabase
        .from('stage_history')
        .select('*')
        .order('created_at', { ascending: false });

      if (stageId) query = query.eq('stage_id', stageId);
      if (courseId) query = query.eq('course_id', courseId);

      const { data, error: queryError } = await query.limit(50);

      if (queryError) {
        console.error('Error fetching stage history:', queryError);
        return [];
      }

      return data || [];
    } catch (err) {
      console.error('Unexpected error:', err);
      return [];
    }
  }, []);

  // Get best scores
  const getBestScores = useCallback(async (courseId?: string) => {
    try {
      let query = supabase
        .from('user_best_scores')
        .select('*')
        .order('last_played_at', { ascending: false });

      if (courseId) query = query.eq('course_id', courseId);

      const { data, error: queryError } = await query;

      if (queryError) {
        console.error('Error fetching best scores:', queryError);
        return [];
      }

      return data || [];
    } catch (err) {
      console.error('Unexpected error:', err);
      return [];
    }
  }, []);

  // Load progress on mount - with deduplication
  useEffect(() => {
    let mounted = true;
    
    const loadProgress = async () => {
      if (!mounted) return;
      await fetchProgress();
    };
    
    loadProgress();
    
    return () => {
      mounted = false;
    };
  }, [fetchProgress]);

  return {
    progress,
    isLoading,
    error,
    fetchProgress,
    completeStage,
    unlockBadge,
    updateCurrentNode,
    resetProgress,
    getStageHistory,
    getBestScores,
  };
};

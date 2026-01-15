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
        
        // Handle authentication errors
        if (rpcError.code === 'PGRST301' || rpcError.message?.includes('Not authenticated')) {
          setError('Phiên đăng nhập đã hết hạn');
          toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
          return;
        }
        
        const msg = rpcError.message || 'Không thể tải tiến độ';
        setError(msg);
        toast.error(msg);
        return;
      }

      if (data) {
        const progressData = data as Record<string, unknown>;
        
        // Safely parse completed_nodes and earned_badges
        let completedNodes: string[] = [];
        let earnedBadges: string[] = [];
        
        try {
          if (Array.isArray(progressData.completed_nodes)) {
            completedNodes = progressData.completed_nodes as string[];
          } else if (typeof progressData.completed_nodes === 'string') {
            completedNodes = JSON.parse(progressData.completed_nodes);
          }
        } catch (e) {
          console.warn('Error parsing completed_nodes:', e);
          completedNodes = [];
        }
        
        try {
          if (Array.isArray(progressData.earned_badges)) {
            earnedBadges = progressData.earned_badges as string[];
          } else if (typeof progressData.earned_badges === 'string') {
            earnedBadges = JSON.parse(progressData.earned_badges);
          }
        } catch (e) {
          console.warn('Error parsing earned_badges:', e);
          earnedBadges = [];
        }
        
        setProgress({
          xp: (progressData.xp as number) || 0,
          points: (progressData.points as number) || 0,
          level: (progressData.level as number) || 1,
          currentNode: (progressData.current_node as number) || 0,
          completedNodes,
          earnedBadges,
          streak: {
            current: ((progressData.streak as Record<string, number>)?.current) || 0,
            longest: ((progressData.streak as Record<string, number>)?.longest) || 0,
            totalDays: ((progressData.streak as Record<string, number>)?.total_days) || 0,
          },
          leaderboardPoints: (progressData.leaderboard_points as number) || 0,
          leaderboardRank: (progressData.leaderboard_rank as number) || null,
        });
      } else {
        // No data returned - might be first time user
        setProgress(DEFAULT_PROGRESS);
      }
    } catch (err) {
      console.error('Unexpected error fetching progress:', err);
      setError('Không thể tải tiến độ');
      // Set default progress on error to prevent UI from breaking
      setProgress(DEFAULT_PROGRESS);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Complete a stage - atomic operation with retry and timeout
  const completeStage = useCallback(async (
    stageId: string,
    courseId: string,
    score: number,
    maxScore: number,
    correctAnswers: number,
    totalQuestions: number,
    timeSpentSeconds: number
  ): Promise<StageResult | null> => {
    const MAX_RETRIES = 3;
    const TIMEOUT_MS = 30000; // 30 seconds timeout
    
    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      try {
        // Create a timeout promise
        const timeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error('Request timeout')), TIMEOUT_MS);
        });

        // Race between RPC call and timeout
        const rpcPromise = supabase.rpc('complete_stage', {
          p_stage_id: stageId,
          p_course_id: courseId,
          p_score: score,
          p_max_score: maxScore,
          p_correct_answers: correctAnswers,
          p_total_questions: totalQuestions,
          p_time_spent_seconds: timeSpentSeconds,
        });

        type RpcError = { code?: string; message?: string } | null;

        const rpcResult = (await Promise.race([
          rpcPromise,
          timeoutPromise,
        ])) as { data: unknown; error: unknown };

        const data = rpcResult.data;
        const rpcError = rpcResult.error as RpcError;

        if (rpcError) {
          console.error(`Error completing stage (attempt ${attempt + 1}/${MAX_RETRIES}):`, rpcError);
          
          // Don't retry on authentication errors
          if (rpcError.code === 'PGRST301' || rpcError.message?.includes('Not authenticated')) {
            toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
            return null;
          }
          
          // Retry on network errors or server errors
          if (attempt < MAX_RETRIES - 1 && (
            rpcError.code === 'PGRST301' || 
            rpcError.message?.includes('network') ||
            rpcError.message?.includes('timeout') ||
            rpcError.code?.startsWith('5')
          )) {
            // Wait before retrying (exponential backoff)
            await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
            continue;
          }
          
          toast.error('Không thể lưu tiến độ. Vui lòng kiểm tra kết nối mạng.');
          return null;
        }

        if (!data) {
          console.error('No data returned from complete_stage');
          if (attempt < MAX_RETRIES - 1) {
            await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
            continue;
          }
          toast.error('Không nhận được phản hồi từ server.');
          return null;
        }

        const result = data as Record<string, unknown>;
        
        // Validate response structure
        if (typeof result.success !== 'boolean') {
          console.error('Invalid response structure:', result);
          if (attempt < MAX_RETRIES - 1) {
            await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
            continue;
          }
          toast.error('Dữ liệu phản hồi không hợp lệ.');
          return null;
        }

        const stageResult: StageResult = {
          success: result.success as boolean,
          xpEarned: (result.xp_earned as number) || 0,
          totalXp: (result.total_xp as number) || 0,
          newLevel: (result.new_level as number) || 1,
          levelUp: (result.level_up as boolean) || false,
          completed: (result.completed as boolean) || false,
          accuracy: (result.accuracy as number) || 0,
          isNewBest: (result.is_new_best as boolean) || false,
          attemptNumber: (result.attempt_number as number) || 1,
          badgeEarned: (result.badge_earned as string) || null,
        };

        // If RPC executed but function returned failure, treat it as an error.
        if (!stageResult.success) {
          const errorMessage =
            (result.error as string) ||
            'Không thể lưu tiến độ (server trả về success=false).';
          console.error('complete_stage returned success=false:', { stageId, courseId, result });
          toast.error(errorMessage);
          return null;
        }

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
        console.error(`Unexpected error completing stage (attempt ${attempt + 1}/${MAX_RETRIES}):`, err);
        
        // Don't retry on timeout if it's the last attempt
        if (attempt === MAX_RETRIES - 1) {
          if (err instanceof Error && err.message === 'Request timeout') {
            toast.error('Yêu cầu quá chậm. Vui lòng kiểm tra kết nối mạng và thử lại.');
          } else {
            toast.error('Lỗi khi lưu tiến độ. Vui lòng thử lại.');
          }
          return null;
        }
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
      }
    }
    
    return null;
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

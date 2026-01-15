import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// ============================================
// TypeScript Interfaces
// ============================================

export interface GlobalState {
  user_id: string;
  total_xp: number;
  global_level: number;
  coins: number;
  avatar_config: Record<string, unknown>;
  unlocked_badges: unknown[];
  created_at: string;
  updated_at: string;
}

export interface CourseState {
  id?: string;
  user_id?: string;
  course_id: string;
  current_node: number;
  completed_nodes: unknown[];
  total_stars: number;
  total_xp?: number; // Course-specific XP (riêng từng course)
  extra_data: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
}

export interface FullGameState {
  success: boolean;
  globals: GlobalState;
  course: CourseState;
  error?: string;
}

export interface CompleteStagePayload {
  nodeIndex: number;
  score: number;
  stars: number;
  xpReward: number;
  gameSpecificData?: Record<string, unknown>;
}

export interface CompleteStageResult {
  success: boolean;
  globals: {
    total_xp: number;
    global_level: number;
    coins: number;
  };
  course: {
    course_id: string;
    current_node: number;
    completed_nodes: unknown[];
    total_stars: number;
    total_xp?: number; // Course-specific XP
    extra_data: Record<string, unknown>;
  };
  error?: string;
}

// ============================================
// Hook: useGameProgress
// ============================================

export const useGameProgress = (courseId: string) => {
  const queryClient = useQueryClient();

  // Query: Lấy full game state
  const stateQuery = useQuery({
    queryKey: ["game-state", courseId],
    queryFn: async (): Promise<FullGameState> => {
      try {
        const { data, error } = await supabase.rpc("get_full_game_state", {
          p_course_id: courseId,
        });

        if (error) {
          console.error("Error fetching game state:", error);
          // Return default state thay vì throw để không crash app
          return {
            success: false,
            globals: {
              user_id: "",
              total_xp: 0,
              global_level: 1,
              coins: 0,
              avatar_config: {},
              unlocked_badges: [],
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
            course: {
              course_id: courseId,
              current_node: 0,
              completed_nodes: [],
              total_stars: 0,
              extra_data: {},
            },
            error: error.message,
          };
        }

        if (!data) {
          console.warn("No data returned from get_full_game_state");
          // Return default state
          return {
            success: false,
            globals: {
              user_id: "",
              total_xp: 0,
              global_level: 1,
              coins: 0,
              avatar_config: {},
              unlocked_badges: [],
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
            course: {
              course_id: courseId,
              current_node: 0,
              completed_nodes: [],
              total_stars: 0,
              extra_data: {},
            },
            error: "No data returned",
          };
        }

        if (!data.success) {
          const errorMsg = (data as { error?: string })?.error || "Không thể tải tiến độ";
          console.warn("get_full_game_state returned success=false:", errorMsg);
          // Return default state với error message
          return {
            success: false,
            globals: {
              user_id: "",
              total_xp: 0,
              global_level: 1,
              coins: 0,
              avatar_config: {},
              unlocked_badges: [],
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
            course: {
              course_id: courseId,
              current_node: 0,
              completed_nodes: [],
              total_stars: 0,
              extra_data: {},
            },
            error: errorMsg,
          };
        }

        return data as FullGameState;
      } catch (err) {
        console.error("Unexpected error in queryFn:", err);
        // Return default state để không crash
        return {
          success: false,
          globals: {
            user_id: "",
            total_xp: 0,
            global_level: 1,
            coins: 0,
            avatar_config: {},
            unlocked_badges: [],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          course: {
            course_id: courseId,
            current_node: 0,
            completed_nodes: [],
            total_stars: 0,
            extra_data: {},
          },
          error: err instanceof Error ? err.message : "Unknown error",
        };
      }
    },
    staleTime: 30_000, // Cache 30 giây
    retry: 2,
  });

  // Mutation: Hoàn thành stage
  const completeStage = useMutation({
    mutationFn: async (payload: CompleteStagePayload): Promise<CompleteStageResult> => {
      const { nodeIndex, score, stars, xpReward, gameSpecificData } = payload;

      const { data, error } = await supabase.rpc("complete_stage", {
        p_course_id: courseId,
        p_node_index: nodeIndex,
        p_score: score,
        p_stars: stars,
        p_xp_reward: xpReward,
        p_game_specific_data: gameSpecificData || {},
      });

      if (error) {
        console.error("Error completing stage:", error);
        toast.error("Không thể lưu kết quả. Vui lòng thử lại.");
        throw error;
      }

      if (!data || !(data as { success?: boolean }).success) {
        const errorMsg = (data as { error?: string })?.error || "Lưu kết quả thất bại";
        toast.error(errorMsg);
        throw new Error(errorMsg);
      }

      const result = data as CompleteStageResult;
      
      // Show success feedback
      if (result.globals.global_level > (stateQuery.data?.globals.global_level || 1)) {
        toast.success(`🎉 Level Up! Bạn đã đạt Level ${result.globals.global_level}!`);
      } else {
        toast.success(`+${xpReward} XP | +${stars} ⭐`);
      }

      return result;
    },
    onSuccess: (result, variables) => {
      // Hợp nhất tiến độ để tránh hạ cấp current_node/completed_nodes khi chơi lại màn cũ
      queryClient.setQueryData<FullGameState | undefined>(
        ["game-state", courseId],
        (prev) => {
          const prevCourse = prev?.course;
          const prevGlobals = prev?.globals;

          // nodeIndex được gửi từ mutate payload, fallback từ result.course.current_node - 1
          const completedIndex = typeof variables?.nodeIndex === "number"
            ? variables.nodeIndex
            : Math.max((result.course?.current_node ?? 1) - 1, 0);

          const prevCurrent = prevCourse?.current_node ?? 0;
          const rpcCurrent = result.course?.current_node ?? completedIndex + 1;
          const newCurrent = Math.max(prevCurrent, rpcCurrent, completedIndex + 1);

          const mergeCompleted = (incoming?: unknown[], existing?: unknown[]) => {
            const merged = new Set<number | string>();
            (existing ?? []).forEach((item) => merged.add(item as number | string));
            (incoming ?? []).forEach((item) => merged.add(item as number | string));
            merged.add(completedIndex as number);
            return Array.from(merged);
          };

          const mergedCompletedNodes = mergeCompleted(
            (result.course?.completed_nodes as unknown[]) ?? [],
            (prevCourse?.completed_nodes as unknown[]) ?? []
          );

          const mergedCourse: CourseState = {
            ...prevCourse,
            ...result.course,
            current_node: newCurrent,
            completed_nodes: mergedCompletedNodes,
            total_stars: result.course?.total_stars ?? prevCourse?.total_stars ?? 0,
            total_xp: result.course?.total_xp ?? prevCourse?.total_xp,
          };

          const mergedGlobals: GlobalState = {
            ...prevGlobals,
            ...result.globals,
          };

          return {
            success: true,
            globals: mergedGlobals,
            course: mergedCourse,
          };
        }
      );

      // Invalidate và refetch state nền để đồng bộ server
      queryClient.invalidateQueries({ queryKey: ["game-state", courseId] });
    },
  });

  // Helper: Update current node (không cần complete stage)
  const updateCurrentNode = useMutation({
    mutationFn: async (nodeIndex: number) => {
      // TODO: Có thể tạo RPC riêng nếu cần
      // Hiện tại chỉ update local state
      return nodeIndex;
    },
  });

  // Helper: Reset progress (chỉ reset course, không reset globals)
  const resetCourseProgress = useMutation({
    mutationFn: async () => {
      // TODO: Tạo RPC reset_course_progress nếu cần
      queryClient.invalidateQueries({ queryKey: ["game-state", courseId] });
    },
  });

  // Safe access với fallback values
  const safeData = stateQuery.data || {
    success: false,
    globals: {
      user_id: "",
      total_xp: 0,
      global_level: 1,
      coins: 0,
      avatar_config: {},
      unlocked_badges: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    course: {
      course_id: courseId,
      current_node: 0,
      completed_nodes: [],
      total_stars: 0,
      extra_data: {},
    },
  };

  return {
    // State - luôn có giá trị, không bao giờ null/undefined
    globals: safeData.globals,
    course: safeData.course,
    isLoading: stateQuery.isLoading,
    error: stateQuery.error,
    
    // Mutations
    completeStage,
    updateCurrentNode,
    resetCourseProgress,
    
    // Refetch
    refetch: stateQuery.refetch,
  };
};


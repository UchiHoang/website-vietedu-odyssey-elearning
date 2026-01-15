export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      curriculumGrade0: {
        Row: {
          id: number
          metadata: Json
        }
        Insert: {
          id?: number
          metadata: Json
        }
        Update: {
          id?: number
          metadata?: Json
        }
        Relationships: []
      }
      curriculumGrade1: {
        Row: {
          id: number
          metadata: Json
        }
        Insert: {
          id?: number
          metadata: Json
        }
        Update: {
          id?: number
          metadata?: Json
        }
        Relationships: []
      }
      daily_activity: {
        Row: {
          activity_date: string
          created_at: string
          id: string
          lessons_completed: number
          points_earned: number
          time_spent_minutes: number
          user_id: string
          xp_earned: number
        }
        Insert: {
          activity_date?: string
          created_at?: string
          id?: string
          lessons_completed?: number
          points_earned?: number
          time_spent_minutes?: number
          user_id: string
          xp_earned?: number
        }
        Update: {
          activity_date?: string
          created_at?: string
          id?: string
          lessons_completed?: number
          points_earned?: number
          time_spent_minutes?: number
          user_id?: string
          xp_earned?: number
        }
        Relationships: []
      }
      game_progress: {
        Row: {
          completed_nodes: Json
          created_at: string
          current_node: number
          earned_badges: Json
          id: string
          level: number
          total_points: number
          total_xp: number
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_nodes?: Json
          created_at?: string
          current_node?: number
          earned_badges?: Json
          id?: string
          level?: number
          total_points?: number
          total_xp?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_nodes?: Json
          created_at?: string
          current_node?: number
          earned_badges?: Json
          id?: string
          level?: number
          total_points?: number
          total_xp?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      leaderboard: {
        Row: {
          created_at: string
          id: string
          points: number
          rank: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          points?: number
          rank?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          points?: number
          rank?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: string | null
          avatar: string | null
          birth_date: string | null
          class_name: string | null
          created_at: string
          display_name: string
          district: string | null
          email: string | null
          grade: string | null
          id: string
          phone: string | null
          province: string | null
          school: string | null
          updated_at: string
          ward: string | null
        }
        Insert: {
          address?: string | null
          avatar?: string | null
          birth_date?: string | null
          class_name?: string | null
          created_at?: string
          display_name: string
          district?: string | null
          email?: string | null
          grade?: string | null
          id: string
          phone?: string | null
          province?: string | null
          school?: string | null
          updated_at?: string
          ward?: string | null
        }
        Update: {
          address?: string | null
          avatar?: string | null
          birth_date?: string | null
          class_name?: string | null
          created_at?: string
          display_name?: string
          district?: string | null
          email?: string | null
          grade?: string | null
          id?: string
          phone?: string | null
          province?: string | null
          school?: string | null
          updated_at?: string
          ward?: string | null
        }
        Relationships: []
      }
      progressGrade0: {
        Row: {
          completedNodes: Json | null
          correctAnswers: number | null
          currentNodeIndex: number | null
          currentQuestionIndex: number | null
          earnedBadges: Json | null
          id: number
          incorrectAnswers: number | null
          totalXp: number | null
        }
        Insert: {
          completedNodes?: Json | null
          correctAnswers?: number | null
          currentNodeIndex?: number | null
          currentQuestionIndex?: number | null
          earnedBadges?: Json | null
          id?: number
          incorrectAnswers?: number | null
          totalXp?: number | null
        }
        Update: {
          completedNodes?: Json | null
          correctAnswers?: number | null
          currentNodeIndex?: number | null
          currentQuestionIndex?: number | null
          earnedBadges?: Json | null
          id?: number
          incorrectAnswers?: number | null
          totalXp?: number | null
        }
        Relationships: []
      }
      progressGrade1: {
        Row: {
          completedNodes: Json | null
          correctAnswers: number | null
          currentNodeIndex: number | null
          currentQuestionIndex: number | null
          earnedBadges: Json | null
          id: number
          incorrectAnswers: number | null
          totalXp: number | null
        }
        Insert: {
          completedNodes?: Json | null
          correctAnswers?: number | null
          currentNodeIndex?: number | null
          currentQuestionIndex?: number | null
          earnedBadges?: Json | null
          id?: number
          incorrectAnswers?: number | null
          totalXp?: number | null
        }
        Update: {
          completedNodes?: Json | null
          correctAnswers?: number | null
          currentNodeIndex?: number | null
          currentQuestionIndex?: number | null
          earnedBadges?: Json | null
          id?: number
          incorrectAnswers?: number | null
          totalXp?: number | null
        }
        Relationships: []
      }
      stage_history: {
        Row: {
          attempt_number: number
          completed: boolean
          correct_answers: number
          course_id: string
          created_at: string
          id: string
          max_score: number
          score: number
          stage_id: string
          time_spent_seconds: number
          total_questions: number
          user_id: string
          xp_earned: number
        }
        Insert: {
          attempt_number?: number
          completed?: boolean
          correct_answers?: number
          course_id?: string
          created_at?: string
          id?: string
          max_score?: number
          score?: number
          stage_id: string
          time_spent_seconds?: number
          total_questions?: number
          user_id: string
          xp_earned?: number
        }
        Update: {
          attempt_number?: number
          completed?: boolean
          correct_answers?: number
          course_id?: string
          created_at?: string
          id?: string
          max_score?: number
          score?: number
          stage_id?: string
          time_spent_seconds?: number
          total_questions?: number
          user_id?: string
          xp_earned?: number
        }
        Relationships: []
      }
      storyGrade0: {
        Row: {
          id: number
          metadata: Json
        }
        Insert: {
          id?: number
          metadata: Json
        }
        Update: {
          id?: number
          metadata?: Json
        }
        Relationships: []
      }
      storyGrade1: {
        Row: {
          id: number
          metadata: Json
        }
        Insert: {
          id?: number
          metadata: Json
        }
        Update: {
          id?: number
          metadata?: Json
        }
        Relationships: []
      }
      user_achievements: {
        Row: {
          achievement_description: string | null
          achievement_icon: string
          achievement_id: string
          achievement_name: string
          earned_at: string
          id: string
          user_id: string
        }
        Insert: {
          achievement_description?: string | null
          achievement_icon?: string
          achievement_id: string
          achievement_name: string
          earned_at?: string
          id?: string
          user_id: string
        }
        Update: {
          achievement_description?: string | null
          achievement_icon?: string
          achievement_id?: string
          achievement_name?: string
          earned_at?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      user_best_scores: {
        Row: {
          best_accuracy: number
          best_score: number
          course_id: string
          first_completed_at: string | null
          id: string
          last_played_at: string
          stage_id: string
          total_attempts: number
          updated_at: string
          user_id: string
        }
        Insert: {
          best_accuracy?: number
          best_score?: number
          course_id?: string
          first_completed_at?: string | null
          id?: string
          last_played_at?: string
          stage_id: string
          total_attempts?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          best_accuracy?: number
          best_score?: number
          course_id?: string
          first_completed_at?: string | null
          id?: string
          last_played_at?: string
          stage_id?: string
          total_attempts?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_streaks: {
        Row: {
          created_at: string
          current_streak: number
          id: string
          last_activity_date: string | null
          longest_streak: number
          total_learning_days: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_streak?: number
          id?: string
          last_activity_date?: string | null
          longest_streak?: number
          total_learning_days?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_streak?: number
          id?: string
          last_activity_date?: string | null
          longest_streak?: number
          total_learning_days?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_level_from_xp: { Args: { p_xp: number }; Returns: number }
      complete_stage: {
        Args: {
          p_correct_answers: number
          p_course_id: string
          p_max_score: number
          p_score: number
          p_stage_id: string
          p_time_spent_seconds: number
          p_total_questions: number
        }
        Returns: Json
      }
      get_public_profile: {
        Args: { profile_id: string }
        Returns: {
          avatar: string
          display_name: string
          grade: string
          id: string
          school: string
        }[]
      }
      get_user_progress: { Args: never; Returns: Json }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      unlock_badge: {
        Args: {
          p_badge_description?: string
          p_badge_icon?: string
          p_badge_id: string
          p_badge_name: string
        }
        Returns: Json
      }
      update_user_streak: { Args: { p_user_id: string }; Returns: undefined }
    }
    Enums: {
      app_role: "student" | "teacher" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["student", "teacher", "admin"],
    },
  },
} as const

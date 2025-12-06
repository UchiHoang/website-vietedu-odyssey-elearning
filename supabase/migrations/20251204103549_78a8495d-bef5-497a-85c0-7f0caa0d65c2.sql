
-- =============================================
-- 1. CREATE STAGE HISTORY TABLE
-- =============================================
CREATE TABLE public.stage_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  stage_id text NOT NULL,
  course_id text NOT NULL DEFAULT 'grade2-trangquynh',
  score integer NOT NULL DEFAULT 0,
  max_score integer NOT NULL DEFAULT 100,
  correct_answers integer NOT NULL DEFAULT 0,
  total_questions integer NOT NULL DEFAULT 0,
  time_spent_seconds integer NOT NULL DEFAULT 0,
  xp_earned integer NOT NULL DEFAULT 0,
  completed boolean NOT NULL DEFAULT false,
  attempt_number integer NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now(),
  
  CONSTRAINT score_range CHECK (score >= 0 AND score <= max_score),
  CONSTRAINT positive_values CHECK (correct_answers >= 0 AND total_questions >= 0 AND time_spent_seconds >= 0 AND xp_earned >= 0)
);

-- Index for fast lookups
CREATE INDEX idx_stage_history_user_stage ON public.stage_history(user_id, stage_id);
CREATE INDEX idx_stage_history_user_course ON public.stage_history(user_id, course_id);
CREATE INDEX idx_stage_history_created ON public.stage_history(created_at DESC);

-- Enable RLS
ALTER TABLE public.stage_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own stage history"
ON public.stage_history FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own stage history"
ON public.stage_history FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- =============================================
-- 2. CREATE USER BEST SCORES TABLE (aggregated)
-- =============================================
CREATE TABLE public.user_best_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  stage_id text NOT NULL,
  course_id text NOT NULL DEFAULT 'grade2-trangquynh',
  best_score integer NOT NULL DEFAULT 0,
  best_accuracy numeric(5,2) NOT NULL DEFAULT 0,
  total_attempts integer NOT NULL DEFAULT 0,
  first_completed_at timestamptz,
  last_played_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  
  UNIQUE(user_id, stage_id, course_id)
);

CREATE INDEX idx_user_best_scores_user ON public.user_best_scores(user_id);

ALTER TABLE public.user_best_scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own best scores"
ON public.user_best_scores FOR SELECT
USING (auth.uid() = user_id);

-- =============================================
-- 3. LEVEL CALCULATION FUNCTION (pure, no side effects)
-- =============================================
CREATE OR REPLACE FUNCTION public.calculate_level_from_xp(p_xp integer)
RETURNS integer
LANGUAGE plpgsql
IMMUTABLE
SET search_path = public
AS $$
BEGIN
  -- Level formula: level = floor(sqrt(xp / 100)) + 1
  -- Level 1: 0-99 XP, Level 2: 100-399 XP, Level 3: 400-899 XP, etc.
  RETURN GREATEST(1, FLOOR(SQRT(p_xp::numeric / 100)) + 1)::integer;
END;
$$;

-- =============================================
-- 4. COMPLETE STAGE RPC (atomic transaction)
-- =============================================
CREATE OR REPLACE FUNCTION public.complete_stage(
  p_stage_id text,
  p_course_id text,
  p_score integer,
  p_max_score integer,
  p_correct_answers integer,
  p_total_questions integer,
  p_time_spent_seconds integer
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid := auth.uid();
  v_xp_earned integer;
  v_completed boolean;
  v_accuracy numeric;
  v_attempt_number integer;
  v_current_xp integer;
  v_new_xp integer;
  v_new_level integer;
  v_old_level integer;
  v_is_new_best boolean := false;
  v_badge_earned text := null;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Calculate accuracy and XP
  v_accuracy := CASE WHEN p_total_questions > 0 
    THEN (p_correct_answers::numeric / p_total_questions) * 100 
    ELSE 0 END;
  v_completed := v_accuracy >= 60; -- 60% to pass
  v_xp_earned := CASE 
    WHEN v_accuracy >= 90 THEN 30
    WHEN v_accuracy >= 70 THEN 20
    WHEN v_accuracy >= 60 THEN 10
    ELSE 5
  END;

  -- Get current attempt number
  SELECT COALESCE(MAX(attempt_number), 0) + 1 INTO v_attempt_number
  FROM public.stage_history
  WHERE user_id = v_user_id AND stage_id = p_stage_id AND course_id = p_course_id;

  -- Insert stage history
  INSERT INTO public.stage_history (
    user_id, stage_id, course_id, score, max_score, 
    correct_answers, total_questions, time_spent_seconds,
    xp_earned, completed, attempt_number
  ) VALUES (
    v_user_id, p_stage_id, p_course_id, p_score, p_max_score,
    p_correct_answers, p_total_questions, p_time_spent_seconds,
    v_xp_earned, v_completed, v_attempt_number
  );

  -- Update or insert best score
  INSERT INTO public.user_best_scores (
    user_id, stage_id, course_id, best_score, best_accuracy, 
    total_attempts, first_completed_at, last_played_at
  ) VALUES (
    v_user_id, p_stage_id, p_course_id, p_score, v_accuracy,
    1, CASE WHEN v_completed THEN now() ELSE NULL END, now()
  )
  ON CONFLICT (user_id, stage_id, course_id) DO UPDATE SET
    best_score = GREATEST(user_best_scores.best_score, EXCLUDED.best_score),
    best_accuracy = GREATEST(user_best_scores.best_accuracy, EXCLUDED.best_accuracy),
    total_attempts = user_best_scores.total_attempts + 1,
    first_completed_at = COALESCE(user_best_scores.first_completed_at, 
      CASE WHEN v_completed THEN now() ELSE NULL END),
    last_played_at = now(),
    updated_at = now()
  RETURNING (best_score = p_score) INTO v_is_new_best;

  -- Get current XP and level
  SELECT total_xp, level INTO v_current_xp, v_old_level
  FROM public.game_progress
  WHERE user_id = v_user_id;

  v_new_xp := COALESCE(v_current_xp, 0) + v_xp_earned;
  v_new_level := calculate_level_from_xp(v_new_xp);

  -- Update game progress atomically
  UPDATE public.game_progress
  SET 
    total_xp = v_new_xp,
    total_points = total_points + p_score,
    level = v_new_level,
    completed_nodes = CASE 
      WHEN v_completed AND NOT (completed_nodes ? p_stage_id)
      THEN completed_nodes || jsonb_build_array(p_stage_id)
      ELSE completed_nodes
    END,
    updated_at = now()
  WHERE user_id = v_user_id;

  -- Update leaderboard
  UPDATE public.leaderboard
  SET points = points + p_score, updated_at = now()
  WHERE user_id = v_user_id;

  -- Update daily activity
  INSERT INTO public.daily_activity (user_id, xp_earned, points_earned, lessons_completed, time_spent_minutes)
  VALUES (v_user_id, v_xp_earned, p_score, CASE WHEN v_completed THEN 1 ELSE 0 END, CEIL(p_time_spent_seconds / 60.0))
  ON CONFLICT (user_id, activity_date) DO UPDATE SET
    xp_earned = daily_activity.xp_earned + EXCLUDED.xp_earned,
    points_earned = daily_activity.points_earned + EXCLUDED.points_earned,
    lessons_completed = daily_activity.lessons_completed + EXCLUDED.lessons_completed,
    time_spent_minutes = daily_activity.time_spent_minutes + EXCLUDED.time_spent_minutes;

  -- Update streak
  PERFORM update_user_streak(v_user_id);

  -- Check for level-up badge
  IF v_new_level > COALESCE(v_old_level, 1) THEN
    v_badge_earned := 'level_' || v_new_level;
  END IF;

  RETURN jsonb_build_object(
    'success', true,
    'xp_earned', v_xp_earned,
    'total_xp', v_new_xp,
    'new_level', v_new_level,
    'level_up', v_new_level > COALESCE(v_old_level, 1),
    'completed', v_completed,
    'accuracy', v_accuracy,
    'is_new_best', COALESCE(v_is_new_best, false),
    'attempt_number', v_attempt_number,
    'badge_earned', v_badge_earned
  );
END;
$$;

-- =============================================
-- 5. UNLOCK BADGE RPC (with duplicate prevention)
-- =============================================
CREATE OR REPLACE FUNCTION public.unlock_badge(
  p_badge_id text,
  p_badge_name text,
  p_badge_description text DEFAULT NULL,
  p_badge_icon text DEFAULT '🏆'
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid := auth.uid();
  v_already_earned boolean;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Check if already earned (prevent duplicates)
  SELECT EXISTS(
    SELECT 1 FROM public.user_achievements 
    WHERE user_id = v_user_id AND achievement_id = p_badge_id
  ) INTO v_already_earned;

  IF v_already_earned THEN
    RETURN jsonb_build_object(
      'success', false,
      'already_earned', true,
      'message', 'Badge already earned'
    );
  END IF;

  -- Insert achievement
  INSERT INTO public.user_achievements (
    user_id, achievement_id, achievement_name, 
    achievement_description, achievement_icon
  ) VALUES (
    v_user_id, p_badge_id, p_badge_name,
    p_badge_description, p_badge_icon
  );

  -- Update game_progress earned_badges
  UPDATE public.game_progress
  SET earned_badges = earned_badges || jsonb_build_array(p_badge_id),
      updated_at = now()
  WHERE user_id = v_user_id
    AND NOT (earned_badges ? p_badge_id);

  RETURN jsonb_build_object(
    'success', true,
    'badge_id', p_badge_id,
    'earned_at', now()
  );
END;
$$;

-- =============================================
-- 6. GET USER PROGRESS RPC (clean fetch)
-- =============================================
CREATE OR REPLACE FUNCTION public.get_user_progress()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid := auth.uid();
  v_progress record;
  v_streak record;
  v_leaderboard record;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  SELECT * INTO v_progress FROM public.game_progress WHERE user_id = v_user_id;
  SELECT * INTO v_streak FROM public.user_streaks WHERE user_id = v_user_id;
  SELECT * INTO v_leaderboard FROM public.leaderboard WHERE user_id = v_user_id;

  RETURN jsonb_build_object(
    'xp', COALESCE(v_progress.total_xp, 0),
    'points', COALESCE(v_progress.total_points, 0),
    'level', COALESCE(v_progress.level, 1),
    'current_node', COALESCE(v_progress.current_node, 0),
    'completed_nodes', COALESCE(v_progress.completed_nodes, '[]'::jsonb),
    'earned_badges', COALESCE(v_progress.earned_badges, '[]'::jsonb),
    'streak', jsonb_build_object(
      'current', COALESCE(v_streak.current_streak, 0),
      'longest', COALESCE(v_streak.longest_streak, 0),
      'total_days', COALESCE(v_streak.total_learning_days, 0)
    ),
    'leaderboard_points', COALESCE(v_leaderboard.points, 0),
    'leaderboard_rank', v_leaderboard.rank
  );
END;
$$;

-- =============================================
-- 7. ADD UNIQUE CONSTRAINT FOR DAILY ACTIVITY
-- =============================================
ALTER TABLE public.daily_activity 
ADD CONSTRAINT unique_user_daily_activity UNIQUE (user_id, activity_date);

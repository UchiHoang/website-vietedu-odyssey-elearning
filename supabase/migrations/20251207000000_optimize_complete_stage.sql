-- =============================================
-- OPTIMIZE complete_stage FUNCTION
-- Improve performance + robustness (no dependency on UNIQUE(user_id))
-- =============================================

-- Note:
-- This migration only re-defines the RPC function.
-- It does NOT create tables. Ensure tables exist:
--   - public.stage_history, public.user_best_scores, public.game_progress,
--     public.leaderboard, public.daily_activity

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
  v_current_xp integer := 0;
  v_new_xp integer;
  v_new_level integer;
  v_old_level integer := 1;
  v_is_new_best boolean := false;
  v_badge_earned text := null;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Basic validation
  IF p_total_questions <= 0 OR p_score < 0 OR p_max_score <= 0 THEN
    RAISE EXCEPTION 'Invalid input parameters';
  END IF;

  -- Calculate accuracy and XP
  v_accuracy := CASE WHEN p_total_questions > 0
    THEN ROUND((p_correct_answers::numeric / p_total_questions) * 100, 2)
    ELSE 0 END;

  v_completed := v_accuracy >= 60; -- 60% to pass
  v_xp_earned := CASE
    WHEN v_accuracy >= 90 THEN 30
    WHEN v_accuracy >= 70 THEN 20
    WHEN v_accuracy >= 60 THEN 10
    ELSE 5
  END;

  -- Attempt number
  SELECT COALESCE(MAX(attempt_number), 0) + 1 INTO v_attempt_number
  FROM public.stage_history
  WHERE user_id = v_user_id AND stage_id = p_stage_id AND course_id = p_course_id;

  -- Insert stage history (always)
  INSERT INTO public.stage_history (
    user_id, stage_id, course_id, score, max_score,
    correct_answers, total_questions, time_spent_seconds,
    xp_earned, completed, attempt_number
  ) VALUES (
    v_user_id, p_stage_id, p_course_id, p_score, p_max_score,
    p_correct_answers, p_total_questions, p_time_spent_seconds,
    v_xp_earned, v_completed, v_attempt_number
  );

  -- Best score
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
    first_completed_at = COALESCE(
      user_best_scores.first_completed_at,
      CASE WHEN v_completed THEN now() ELSE NULL END
    ),
    last_played_at = now(),
    updated_at = now()
  RETURNING (best_score = p_score) INTO v_is_new_best;

  -- Ensure a game_progress row exists (robust even without UNIQUE(user_id))
  PERFORM 1 FROM public.game_progress WHERE user_id = v_user_id;
  IF NOT FOUND THEN
    INSERT INTO public.game_progress (user_id)
    VALUES (v_user_id);
  END IF;

  -- Read current XP/level (if multiple rows exist, pick the most recently updated)
  SELECT COALESCE(total_xp, 0), COALESCE(level, 1)
  INTO v_current_xp, v_old_level
  FROM public.game_progress
  WHERE user_id = v_user_id
  ORDER BY updated_at DESC NULLS LAST, created_at DESC NULLS LAST
  LIMIT 1;

  v_new_xp := v_current_xp + v_xp_earned;
  v_new_level := calculate_level_from_xp(v_new_xp);

  -- Update the latest game_progress row
  UPDATE public.game_progress
  SET
    total_xp = v_new_xp,
    total_points = COALESCE(total_points, 0) + p_score,
    level = v_new_level,
    completed_nodes = CASE
      WHEN v_completed AND (completed_nodes IS NULL OR NOT (completed_nodes ? p_stage_id))
      THEN COALESCE(completed_nodes, '[]'::jsonb) || jsonb_build_array(p_stage_id)
      ELSE completed_nodes
    END,
    updated_at = now()
  WHERE id = (
    SELECT id FROM public.game_progress
    WHERE user_id = v_user_id
    ORDER BY updated_at DESC NULLS LAST, created_at DESC NULLS LAST
    LIMIT 1
  );

  -- Ensure leaderboard row exists (robust even without UNIQUE(user_id))
  PERFORM 1 FROM public.leaderboard WHERE user_id = v_user_id;
  IF NOT FOUND THEN
    INSERT INTO public.leaderboard (user_id, points)
    VALUES (v_user_id, 0);
  END IF;

  UPDATE public.leaderboard
  SET points = COALESCE(points, 0) + p_score,
      updated_at = now()
  WHERE user_id = v_user_id;

  -- Daily activity upsert (requires UNIQUE(user_id, activity_date) which you already have)
  INSERT INTO public.daily_activity (
    user_id, activity_date, xp_earned, points_earned,
    lessons_completed, time_spent_minutes
  )
  VALUES (
    v_user_id, CURRENT_DATE, v_xp_earned, p_score,
    CASE WHEN v_completed THEN 1 ELSE 0 END,
    GREATEST(1, CEIL(p_time_spent_seconds / 60.0))
  )
  ON CONFLICT (user_id, activity_date) DO UPDATE SET
    xp_earned = daily_activity.xp_earned + EXCLUDED.xp_earned,
    points_earned = daily_activity.points_earned + EXCLUDED.points_earned,
    lessons_completed = daily_activity.lessons_completed + EXCLUDED.lessons_completed,
    time_spent_minutes = daily_activity.time_spent_minutes + EXCLUDED.time_spent_minutes;

  -- Streak update should not fail the whole RPC
  BEGIN
    PERFORM update_user_streak(v_user_id);
  EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'Error updating streak: %', SQLERRM;
  END;

  IF v_new_level > v_old_level THEN
    v_badge_earned := 'level_' || v_new_level;
  END IF;

  RETURN jsonb_build_object(
    'success', true,
    'xp_earned', v_xp_earned,
    'total_xp', v_new_xp,
    'new_level', v_new_level,
    'level_up', v_new_level > v_old_level,
    'completed', v_completed,
    'accuracy', v_accuracy,
    'is_new_best', COALESCE(v_is_new_best, false),
    'attempt_number', v_attempt_number,
    'badge_earned', v_badge_earned
  );
EXCEPTION
  WHEN OTHERS THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', SQLERRM
    );
END;
$$;

COMMENT ON FUNCTION public.complete_stage IS
'Optimized stage completion RPC; robust even if user_id is not unique (but unique is recommended).';



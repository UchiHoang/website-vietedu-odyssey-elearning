-- =============================================
-- Fix get_user_progress to be deterministic if duplicate rows exist
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

  -- If duplicates exist for any reason, always pick the most recently updated row
  SELECT *
  INTO v_progress
  FROM public.game_progress
  WHERE user_id = v_user_id
  ORDER BY updated_at DESC NULLS LAST, created_at DESC NULLS LAST
  LIMIT 1;

  SELECT *
  INTO v_streak
  FROM public.user_streaks
  WHERE user_id = v_user_id;

  SELECT *
  INTO v_leaderboard
  FROM public.leaderboard
  WHERE user_id = v_user_id
  ORDER BY updated_at DESC NULLS LAST, created_at DESC NULLS LAST
  LIMIT 1;

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

COMMENT ON FUNCTION public.get_user_progress IS
'Deterministic progress fetch (picks latest updated row if duplicates exist).';



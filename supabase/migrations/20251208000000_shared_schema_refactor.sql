-- ============================================
-- SHARED SCHEMA REFACTOR - Game E-learning Platform
-- Tách biệt Global Progress và Course-Specific Progress
-- ============================================

-- 1. Bảng Global Progress (Gắn với user)
CREATE TABLE IF NOT EXISTS public.game_globals (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  total_xp BIGINT NOT NULL DEFAULT 0,
  global_level INT NOT NULL DEFAULT 1,
  coins BIGINT NOT NULL DEFAULT 0,
  avatar_config JSONB NOT NULL DEFAULT '{}',
  unlocked_badges JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Bảng Course Progress (Gắn với từng game/môn học)
CREATE TABLE IF NOT EXISTS public.course_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id TEXT NOT NULL, -- Ví dụ: 'grade1_math', 'grade2_trangquynh', 'grade4_giong'
  current_node INT NOT NULL DEFAULT 0,
  completed_nodes JSONB NOT NULL DEFAULT '[]', -- Array of node IDs/indexes
  total_stars INT NOT NULL DEFAULT 0,
  extra_data JSONB NOT NULL DEFAULT '{}', -- Mở rộng cho từng game cụ thể
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_user_course UNIQUE (user_id, course_id)
);

-- 3. Bảng Level History (Analytics)
CREATE TABLE IF NOT EXISTS public.level_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id TEXT NOT NULL,
  node_index INT NOT NULL,
  score NUMERIC NOT NULL DEFAULT 0,
  stars INT NOT NULL DEFAULT 0,
  duration_seconds INT NOT NULL DEFAULT 0,
  passed BOOLEAN NOT NULL DEFAULT TRUE,
  meta JSONB NOT NULL DEFAULT '{}', -- Thông tin bổ sung
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Indexes để tối ưu query
CREATE INDEX IF NOT EXISTS idx_course_progress_user_course 
  ON public.course_progress(user_id, course_id);
CREATE INDEX IF NOT EXISTS idx_level_history_user_course 
  ON public.level_history(user_id, course_id);
CREATE INDEX IF NOT EXISTS idx_level_history_created 
  ON public.level_history(created_at DESC);

-- 5. Trigger: Tự động tạo game_globals khi user mới đăng ký
CREATE OR REPLACE FUNCTION public.ensure_game_globals()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.game_globals(user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_auth_user_created ON auth.users;
CREATE TRIGGER trg_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.ensure_game_globals();

-- 6. RLS Policies
ALTER TABLE public.game_globals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.level_history ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS gg_select_own ON public.game_globals;
DROP POLICY IF EXISTS gg_update_own ON public.game_globals;
DROP POLICY IF EXISTS cp_select_own ON public.course_progress;
DROP POLICY IF EXISTS cp_insert_own ON public.course_progress;
DROP POLICY IF EXISTS cp_update_own ON public.course_progress;
DROP POLICY IF EXISTS lh_select_own ON public.level_history;
DROP POLICY IF EXISTS lh_insert_own ON public.level_history;

-- game_globals policies
CREATE POLICY gg_select_own ON public.game_globals
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY gg_update_own ON public.game_globals
  FOR UPDATE USING (auth.uid() = user_id);

-- course_progress policies
CREATE POLICY cp_select_own ON public.course_progress
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY cp_insert_own ON public.course_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY cp_update_own ON public.course_progress
  FOR UPDATE USING (auth.uid() = user_id);

-- level_history policies
CREATE POLICY lh_select_own ON public.level_history
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY lh_insert_own ON public.level_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 7. RPC Function: complete_stage
-- Drop TẤT CẢ các version cũ của complete_stage (với signature khác)
DO $$ 
DECLARE
  r RECORD;
BEGIN
  FOR r IN 
    SELECT oid::regprocedure 
    FROM pg_proc 
    WHERE proname = 'complete_stage' 
    AND pronamespace = 'public'::regnamespace
  LOOP
    EXECUTE 'DROP FUNCTION IF EXISTS ' || r.oid::regprocedure || ' CASCADE';
  END LOOP;
END $$;

-- Tạo function mới với signature mới
CREATE OR REPLACE FUNCTION public.complete_stage(
  p_course_id TEXT,
  p_node_index INT,
  p_score NUMERIC,
  p_stars INT,
  p_xp_reward INT,
  p_game_specific_data JSONB DEFAULT '{}'::jsonb
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID := auth.uid();
  v_new_total_xp BIGINT;
  v_new_level INT;
  v_current_level INT;
  v_needed_xp INT := 100; -- Công thức: mỗi 100 XP = 1 level
  v_cp_id UUID;
  v_current_node INT;
  v_completed_nodes JSONB;
  v_total_stars INT;
  v_extra_data JSONB;
BEGIN
  -- Kiểm tra authentication
  IF v_user_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Not authenticated');
  END IF;

  -- Đảm bảo có row trong game_globals
  INSERT INTO public.game_globals(user_id)
  VALUES (v_user_id)
  ON CONFLICT (user_id) DO NOTHING;

  -- Cập nhật XP và Coin
  UPDATE public.game_globals
  SET 
    total_xp = total_xp + p_xp_reward,
    coins = coins + p_stars, -- Mỗi sao = 1 coin
    updated_at = NOW()
  WHERE user_id = v_user_id
  RETURNING total_xp, global_level INTO v_new_total_xp, v_current_level;

  -- Tính level mới (mỗi 100 XP = 1 level)
  v_new_level := GREATEST(v_current_level, CEIL(v_new_total_xp::NUMERIC / v_needed_xp));

  -- Nếu level up, cập nhật
  IF v_new_level > v_current_level THEN
    UPDATE public.game_globals
    SET global_level = v_new_level, updated_at = NOW()
    WHERE user_id = v_user_id;
  END IF;

  -- Upsert course_progress
  INSERT INTO public.course_progress(
    user_id, 
    course_id, 
    current_node, 
    completed_nodes, 
    total_stars, 
    extra_data
  )
  VALUES (
    v_user_id,
    p_course_id,
    p_node_index,
    jsonb_build_array(p_node_index),
    p_stars,
    COALESCE(p_game_specific_data, '{}'::jsonb)
  )
  ON CONFLICT (user_id, course_id) DO UPDATE
  SET
    current_node = GREATEST(course_progress.current_node, EXCLUDED.current_node),
    completed_nodes = (
      SELECT jsonb_agg(DISTINCT value)
      FROM jsonb_array_elements(course_progress.completed_nodes || EXCLUDED.completed_nodes)
    ),
    total_stars = course_progress.total_stars + EXCLUDED.total_stars,
    extra_data = course_progress.extra_data || p_game_specific_data,
    updated_at = NOW()
  RETURNING 
    id, 
    current_node, 
    completed_nodes, 
    total_stars, 
    extra_data
  INTO 
    v_cp_id, 
    v_current_node, 
    v_completed_nodes, 
    v_total_stars, 
    v_extra_data;

  -- Lưu lịch sử
  INSERT INTO public.level_history(
    user_id, 
    course_id, 
    node_index, 
    score, 
    stars, 
    duration_seconds, 
    passed, 
    meta
  )
  VALUES (
    v_user_id, 
    p_course_id, 
    p_node_index, 
    p_score, 
    p_stars, 
    0, -- TODO: Tính duration từ frontend
    TRUE, 
    p_game_specific_data
  );

  -- Trả về kết quả
  RETURN jsonb_build_object(
    'success', true,
    'globals', jsonb_build_object(
      'total_xp', v_new_total_xp,
      'global_level', v_new_level,
      'coins', (SELECT coins FROM public.game_globals WHERE user_id = v_user_id)
    ),
    'course', jsonb_build_object(
      'course_id', p_course_id,
      'current_node', v_current_node,
      'completed_nodes', v_completed_nodes,
      'total_stars', v_total_stars,
      'extra_data', v_extra_data
    )
  );
EXCEPTION
  WHEN OTHERS THEN
    RETURN jsonb_build_object('success', false, 'error', SQLERRM);
END;
$$;

-- 8. RPC Function: get_full_game_state
-- Drop function cũ nếu có
DROP FUNCTION IF EXISTS public.get_full_game_state();
DROP FUNCTION IF EXISTS public.get_full_game_state(text);

-- Tạo function mới
CREATE OR REPLACE FUNCTION public.get_full_game_state(p_course_id TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID := auth.uid();
  v_globals JSONB;
  v_course JSONB;
BEGIN
  -- Kiểm tra authentication
  IF v_user_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Not authenticated');
  END IF;

  -- Đảm bảo có row trong game_globals
  INSERT INTO public.game_globals(user_id)
  VALUES (v_user_id)
  ON CONFLICT (user_id) DO NOTHING;

  -- Lấy globals
  SELECT to_jsonb(g.*) INTO v_globals
  FROM public.game_globals g
  WHERE g.user_id = v_user_id;

  -- Lấy course progress (nếu có)
  SELECT to_jsonb(cp.*) INTO v_course
  FROM public.course_progress cp
  WHERE cp.user_id = v_user_id AND cp.course_id = p_course_id;

  -- Nếu chưa có course progress, trả về default
  IF v_course IS NULL THEN
    v_course := jsonb_build_object(
      'course_id', p_course_id,
      'current_node', 0,
      'completed_nodes', jsonb_build_array(),
      'total_stars', 0,
      'extra_data', jsonb_build_object()
    );
  END IF;

  -- Trả về kết quả
  RETURN jsonb_build_object(
    'success', true,
    'globals', v_globals,
    'course', v_course
  );
EXCEPTION
  WHEN OTHERS THEN
    RETURN jsonb_build_object('success', false, 'error', SQLERRM);
END;
$$;

-- 9. Comments
COMMENT ON TABLE public.game_globals IS 'Global progress gắn với user (XP, Level, Coin, Badges)';
COMMENT ON TABLE public.course_progress IS 'Progress theo từng course/game (nodes, stars, extra_data)';
COMMENT ON TABLE public.level_history IS 'Lịch sử từng ván chơi để analytics';
COMMENT ON FUNCTION public.complete_stage IS 'Hoàn thành một stage: cập nhật globals + course progress + lưu history';
COMMENT ON FUNCTION public.get_full_game_state IS 'Lấy toàn bộ state: globals + course progress (trả default nếu chưa có)';


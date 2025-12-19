-- Fix function search_path for any functions missing it
-- Check and update functions that might be missing search_path setting

-- The get_public_profile function was already created with search_path = public
-- Let's ensure all custom functions have proper search_path

-- Re-create update_user_streak with explicit search_path if not set
CREATE OR REPLACE FUNCTION public.update_user_streak(p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_last_date date;
  v_current_streak integer;
  v_longest_streak integer;
  v_today date := CURRENT_DATE;
BEGIN
  SELECT last_activity_date, current_streak, longest_streak 
  INTO v_last_date, v_current_streak, v_longest_streak
  FROM public.user_streaks 
  WHERE user_id = p_user_id;
  
  IF NOT FOUND THEN
    INSERT INTO public.user_streaks (user_id, current_streak, longest_streak, last_activity_date, total_learning_days)
    VALUES (p_user_id, 1, 1, v_today, 1);
    RETURN;
  END IF;
  
  IF v_last_date = v_today THEN
    RETURN;
  END IF;
  
  IF v_last_date = v_today - INTERVAL '1 day' THEN
    v_current_streak := v_current_streak + 1;
  ELSE
    v_current_streak := 1;
  END IF;
  
  IF v_current_streak > v_longest_streak THEN
    v_longest_streak := v_current_streak;
  END IF;
  
  UPDATE public.user_streaks 
  SET current_streak = v_current_streak,
      longest_streak = v_longest_streak,
      last_activity_date = v_today,
      total_learning_days = total_learning_days + 1,
      updated_at = now()
  WHERE user_id = p_user_id;
END;
$$;

-- Update handle_updated_at function with search_path
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;
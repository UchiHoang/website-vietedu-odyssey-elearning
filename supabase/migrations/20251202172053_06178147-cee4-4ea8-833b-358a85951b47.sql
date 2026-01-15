-- Add streak and additional profile fields
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS phone text,
ADD COLUMN IF NOT EXISTS email text,
ADD COLUMN IF NOT EXISTS address text,
ADD COLUMN IF NOT EXISTS ward text,
ADD COLUMN IF NOT EXISTS district text,
ADD COLUMN IF NOT EXISTS province text,
ADD COLUMN IF NOT EXISTS birth_date date,
ADD COLUMN IF NOT EXISTS class_name text;

-- Create user_streaks table for tracking learning streaks
CREATE TABLE public.user_streaks (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    current_streak integer NOT NULL DEFAULT 0,
    longest_streak integer NOT NULL DEFAULT 0,
    last_activity_date date,
    total_learning_days integer NOT NULL DEFAULT 0,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create user_achievements table for storing all achievements
CREATE TABLE public.user_achievements (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    achievement_id text NOT NULL,
    achievement_name text NOT NULL,
    achievement_icon text NOT NULL DEFAULT '🏆',
    achievement_description text,
    earned_at timestamp with time zone NOT NULL DEFAULT now(),
    UNIQUE(user_id, achievement_id)
);

-- Create daily_activity table to track user login/learning activity
CREATE TABLE public.daily_activity (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    activity_date date NOT NULL DEFAULT CURRENT_DATE,
    xp_earned integer NOT NULL DEFAULT 0,
    points_earned integer NOT NULL DEFAULT 0,
    lessons_completed integer NOT NULL DEFAULT 0,
    time_spent_minutes integer NOT NULL DEFAULT 0,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    UNIQUE(user_id, activity_date)
);

-- Enable RLS
ALTER TABLE public.user_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_activity ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_streaks
CREATE POLICY "Users can view their own streak" ON public.user_streaks
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own streak" ON public.user_streaks
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own streak" ON public.user_streaks
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS policies for user_achievements
CREATE POLICY "Users can view their own achievements" ON public.user_achievements
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own achievements" ON public.user_achievements
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS policies for daily_activity
CREATE POLICY "Users can view their own activity" ON public.daily_activity
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own activity" ON public.daily_activity
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own activity" ON public.daily_activity
FOR UPDATE USING (auth.uid() = user_id);

-- Update handle_new_user function to create streak record
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  user_role app_role;
BEGIN
  -- Get role from user metadata, default to student
  user_role := COALESCE(
    (new.raw_user_meta_data->>'role')::app_role,
    'student'::app_role
  );
  
  -- Map 'teacher' to 'admin' role if needed
  IF user_role::text = 'teacher' THEN
    user_role := 'admin'::app_role;
  END IF;
  
  -- Insert into profiles with email
  INSERT INTO public.profiles (id, display_name, avatar, email)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)),
    COALESCE(new.raw_user_meta_data->>'avatar', '👤'),
    new.email
  );
  
  -- Insert user role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (new.id, user_role);
  
  -- Insert initial game progress
  INSERT INTO public.game_progress (user_id)
  VALUES (new.id);
  
  -- Insert initial leaderboard entry
  INSERT INTO public.leaderboard (user_id, points)
  VALUES (new.id, 0);
  
  -- Insert initial streak record
  INSERT INTO public.user_streaks (user_id)
  VALUES (new.id);
  
  RETURN new;
END;
$function$;

-- Function to update streak when user learns
CREATE OR REPLACE FUNCTION public.update_user_streak(p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_last_date date;
  v_current_streak integer;
  v_longest_streak integer;
  v_today date := CURRENT_DATE;
BEGIN
  -- Get current streak info
  SELECT last_activity_date, current_streak, longest_streak 
  INTO v_last_date, v_current_streak, v_longest_streak
  FROM public.user_streaks 
  WHERE user_id = p_user_id;
  
  -- If no record exists, create one
  IF NOT FOUND THEN
    INSERT INTO public.user_streaks (user_id, current_streak, longest_streak, last_activity_date, total_learning_days)
    VALUES (p_user_id, 1, 1, v_today, 1);
    RETURN;
  END IF;
  
  -- If already logged today, do nothing
  IF v_last_date = v_today THEN
    RETURN;
  END IF;
  
  -- Check if continuing streak (yesterday) or new streak
  IF v_last_date = v_today - INTERVAL '1 day' THEN
    v_current_streak := v_current_streak + 1;
  ELSE
    v_current_streak := 1;
  END IF;
  
  -- Update longest streak if needed
  IF v_current_streak > v_longest_streak THEN
    v_longest_streak := v_current_streak;
  END IF;
  
  -- Update the record
  UPDATE public.user_streaks 
  SET current_streak = v_current_streak,
      longest_streak = v_longest_streak,
      last_activity_date = v_today,
      total_learning_days = total_learning_days + 1,
      updated_at = now()
  WHERE user_id = p_user_id;
END;
$function$;

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_streaks_user_id ON public.user_streaks(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON public.user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_activity_user_id_date ON public.daily_activity(user_id, activity_date);
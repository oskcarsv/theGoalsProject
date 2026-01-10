-- Supabase Database Schema for The Goals Project
-- Run this in the Supabase SQL Editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enum types
CREATE TYPE user_role AS ENUM ('user', 'admin');
CREATE TYPE goal_area AS ENUM ('physical_health', 'emotional_health', 'professional', 'personal');
CREATE TYPE goal_status AS ENUM ('active', 'completed', 'abandoned');
CREATE TYPE evidence_status AS ENUM ('pending', 'approved', 'expired');
CREATE TYPE match_status AS ENUM ('pending', 'accepted', 'rejected');

-- Profiles table (extends Supabase auth.users)
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    bio TEXT,
    what_makes_you_different TEXT,
    avatar_url TEXT,
    instagram TEXT,
    linkedin TEXT,
    interests TEXT[] DEFAULT '{}',
    focus_areas goal_area[] DEFAULT '{}',
    role user_role DEFAULT 'user',
    onboarding_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Macro Goals (yearly goals)
CREATE TABLE macro_goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    area goal_area NOT NULL,
    year INTEGER NOT NULL DEFAULT EXTRACT(YEAR FROM NOW()),
    status goal_status DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Micro Goals (weekly goals)
CREATE TABLE micro_goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    macro_goal_id UUID REFERENCES macro_goals(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    week_start DATE NOT NULL,
    week_end DATE NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    normalized_category TEXT, -- For ranking: 'gym', 'reading', 'nutrition', etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Evidence (photos for goals)
CREATE TABLE evidence (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    micro_goal_id UUID NOT NULL REFERENCES micro_goals(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    caption TEXT,
    status evidence_status DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '7 days')
);

-- Weekly Reviews
CREATE TABLE weekly_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    week_start DATE NOT NULL,
    week_end DATE NOT NULL,
    notes TEXT,
    goals_completed INTEGER DEFAULT 0,
    goals_total INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, week_start)
);

-- Rankings (per category, updated weekly)
CREATE TABLE rankings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    category TEXT NOT NULL, -- 'gym', 'reading', etc.
    score INTEGER DEFAULT 0,
    rank INTEGER DEFAULT 0,
    week_start DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, category, week_start)
);

-- Matches (user connections)
CREATE TABLE matches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id_1 UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    user_id_2 UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    compatibility_score INTEGER DEFAULT 0,
    common_goals TEXT[] DEFAULT '{}',
    status match_status DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id_1, user_id_2),
    CHECK (user_id_1 < user_id_2) -- Ensure consistent ordering
);

-- Indexes for better performance
CREATE INDEX idx_macro_goals_user_id ON macro_goals(user_id);
CREATE INDEX idx_macro_goals_year ON macro_goals(year);
CREATE INDEX idx_micro_goals_user_id ON micro_goals(user_id);
CREATE INDEX idx_micro_goals_week ON micro_goals(week_start, week_end);
CREATE INDEX idx_micro_goals_category ON micro_goals(normalized_category);
CREATE INDEX idx_evidence_micro_goal_id ON evidence(micro_goal_id);
CREATE INDEX idx_evidence_expires_at ON evidence(expires_at);
CREATE INDEX idx_rankings_category ON rankings(category);
CREATE INDEX idx_rankings_week ON rankings(week_start);
CREATE INDEX idx_matches_users ON matches(user_id_1, user_id_2);

-- Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE macro_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE micro_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE rankings ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles" ON profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "System can insert profiles" ON profiles
    FOR INSERT WITH CHECK (true);

-- Macro goals policies
CREATE POLICY "Users can view own macro goals" ON macro_goals
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own macro goals" ON macro_goals
    FOR ALL USING (auth.uid() = user_id);

-- Micro goals policies
CREATE POLICY "Users can view own micro goals" ON micro_goals
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own micro goals" ON micro_goals
    FOR ALL USING (auth.uid() = user_id);

-- Evidence policies
CREATE POLICY "Users can view evidence" ON evidence
    FOR SELECT USING (true); -- For weekly reviews

CREATE POLICY "Users can manage own evidence" ON evidence
    FOR ALL USING (auth.uid() = user_id);

-- Weekly reviews policies
CREATE POLICY "Users can view own reviews" ON weekly_reviews
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own reviews" ON weekly_reviews
    FOR ALL USING (auth.uid() = user_id);

-- Rankings policies (everyone can view rankings)
CREATE POLICY "Everyone can view rankings" ON rankings
    FOR SELECT USING (true);

CREATE POLICY "Users can manage own rankings" ON rankings
    FOR ALL USING (auth.uid() = user_id);

-- Matches policies
CREATE POLICY "Users can view own matches" ON matches
    FOR SELECT USING (auth.uid() = user_id_1 OR auth.uid() = user_id_2);

CREATE POLICY "System can create matches" ON matches
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update own matches" ON matches
    FOR UPDATE USING (auth.uid() = user_id_1 OR auth.uid() = user_id_2);

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'avatar_url'
    );
    RETURN NEW;
END;
$$;

-- Trigger for new user signup
CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_macro_goals_updated_at
    BEFORE UPDATE ON macro_goals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_micro_goals_updated_at
    BEFORE UPDATE ON micro_goals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rankings_updated_at
    BEFORE UPDATE ON rankings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to clean up expired evidence (run as a cron job)
CREATE OR REPLACE FUNCTION cleanup_expired_evidence()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    UPDATE evidence
    SET status = 'expired'
    WHERE expires_at < NOW() AND status = 'pending';
    
    -- Optionally delete old expired evidence
    DELETE FROM evidence
    WHERE status = 'expired' AND expires_at < NOW() - INTERVAL '7 days';
END;
$$;

-- Function to calculate and update rankings
CREATE OR REPLACE FUNCTION update_weekly_rankings(week_start_date DATE)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    category_record RECORD;
BEGIN
    -- Get all unique categories with completed goals for this week
    FOR category_record IN 
        SELECT DISTINCT normalized_category as category
        FROM micro_goals
        WHERE week_start = week_start_date
        AND normalized_category IS NOT NULL
        AND completed = true
    LOOP
        -- Update or insert rankings for this category
        INSERT INTO rankings (user_id, category, score, rank, week_start)
        SELECT 
            user_id,
            category_record.category,
            COUNT(*) as score,
            ROW_NUMBER() OVER (ORDER BY COUNT(*) DESC) as rank,
            week_start_date
        FROM micro_goals
        WHERE week_start = week_start_date
        AND normalized_category = category_record.category
        AND completed = true
        GROUP BY user_id
        ON CONFLICT (user_id, category, week_start)
        DO UPDATE SET
            score = EXCLUDED.score,
            rank = EXCLUDED.rank,
            updated_at = NOW();
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Create storage bucket for evidence photos
-- Note: Run this in Supabase dashboard or via API
-- INSERT INTO storage.buckets (id, name, public) VALUES ('evidence', 'evidence', true);

COMMENT ON TABLE profiles IS 'User profiles with personal info and preferences';
COMMENT ON TABLE macro_goals IS 'Yearly/long-term goals';
COMMENT ON TABLE micro_goals IS 'Weekly/short-term goals derived from macro goals';
COMMENT ON TABLE evidence IS 'Photo evidence for goal completion';
COMMENT ON TABLE weekly_reviews IS 'Weekly review summaries';
COMMENT ON TABLE rankings IS 'Leaderboard rankings per category';
COMMENT ON TABLE matches IS 'User connections based on compatibility';

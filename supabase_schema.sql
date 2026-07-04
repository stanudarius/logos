-- Supabase SQL Schema for Logos App

-- 1. Create Profiles Table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 2. Create Vault Cards Table
CREATE TABLE vault_cards (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  card_id TEXT NOT NULL,
  card_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 3. Set up Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE vault_cards ENABLE ROW LEVEL SECURITY;

-- 4. Create Policies for Profiles
CREATE POLICY "Users can view own profile" 
  ON profiles FOR SELECT 
  USING ( auth.uid() = id );

CREATE POLICY "Users can insert own profile" 
  ON profiles FOR INSERT 
  WITH CHECK ( auth.uid() = id );

CREATE POLICY "Users can update own profile" 
  ON profiles FOR UPDATE 
  USING ( auth.uid() = id );

-- 5. Create Policies for Vault Cards
CREATE POLICY "Users can view own vault cards" 
  ON vault_cards FOR SELECT 
  USING ( auth.uid() = user_id );

CREATE POLICY "Users can insert own vault cards" 
  ON vault_cards FOR INSERT 
  WITH CHECK ( auth.uid() = user_id );

CREATE POLICY "Users can delete own vault cards" 
  ON vault_cards FOR DELETE 
  USING ( auth.uid() = user_id );

CREATE POLICY "Users can update own vault cards" 
  ON vault_cards FOR UPDATE 
  USING ( auth.uid() = user_id );

-- 6. Create Feed Cards Table
CREATE TABLE feed_cards (
  id TEXT PRIMARY KEY,
  stack_id TEXT NOT NULL,
  category TEXT,
  topic TEXT,
  philosopher TEXT,
  visual_mood TEXT,
  explore_title TEXT,
  explore_subtext TEXT,
  layout_variant TEXT,
  presentation JSONB
);

-- 7. Set up RLS for Feed Cards
ALTER TABLE feed_cards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view feed cards" 
  ON feed_cards FOR SELECT 
  USING ( true );


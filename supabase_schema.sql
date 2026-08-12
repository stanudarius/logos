-- Supabase SQL Schema for Logos App

-- 1. Create Profiles Table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  has_completed_quiz BOOLEAN DEFAULT false,
  quiz_preferences JSONB
);

-- 2. Create Vault Cards Table
CREATE TABLE vault_cards (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
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

-- 8. Create Constellation Nodes Table
CREATE TABLE constellation_nodes (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  pos_x NUMERIC NOT NULL,
  pos_y NUMERIC NOT NULL,
  group_name TEXT NOT NULL
);

-- 9. Create Constellation Edges Table
CREATE TABLE constellation_edges (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  from_node TEXT REFERENCES constellation_nodes(id) ON DELETE CASCADE,
  to_node TEXT REFERENCES constellation_nodes(id) ON DELETE CASCADE,
  relationship TEXT NOT NULL,
  dashed BOOLEAN DEFAULT false
);

-- 10. Set up RLS for Constellation tables
ALTER TABLE constellation_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE constellation_edges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view constellation nodes" 
  ON constellation_nodes FOR SELECT 
  USING ( true );

CREATE POLICY "Anyone can view constellation edges" 
  ON constellation_edges FOR SELECT 
  USING ( true );

-- 11. Create Indexes
CREATE INDEX IF NOT EXISTS idx_vault_cards_user_id ON vault_cards(user_id);
CREATE INDEX IF NOT EXISTS idx_constellation_edges_from_node ON constellation_edges(from_node);
CREATE INDEX IF NOT EXISTS idx_constellation_edges_to_node ON constellation_edges(to_node);
CREATE INDEX IF NOT EXISTS idx_feed_cards_stack_id_category ON feed_cards(stack_id, category);


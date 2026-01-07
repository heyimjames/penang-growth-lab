-- Case notes table for storing notes from the Chrome extension and web app
CREATE TABLE IF NOT EXISTS case_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  source TEXT DEFAULT 'extension' CHECK (source IN ('extension', 'web', 'manual')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE case_notes ENABLE ROW LEVEL SECURITY;

-- Users can view their own notes
DROP POLICY IF EXISTS "Users can view own notes" ON case_notes;
CREATE POLICY "Users can view own notes" ON case_notes
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- Users can create notes for their own cases
DROP POLICY IF EXISTS "Users can create notes" ON case_notes;
CREATE POLICY "Users can create notes" ON case_notes
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Users can delete their own notes
DROP POLICY IF EXISTS "Users can delete own notes" ON case_notes;
CREATE POLICY "Users can delete own notes" ON case_notes
  FOR DELETE TO authenticated
  USING (user_id = auth.uid());

-- Indexes
CREATE INDEX IF NOT EXISTS idx_case_notes_case_id ON case_notes(case_id);
CREATE INDEX IF NOT EXISTS idx_case_notes_user_id ON case_notes(user_id);
CREATE INDEX IF NOT EXISTS idx_case_notes_created ON case_notes(created_at DESC);

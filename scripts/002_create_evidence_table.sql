-- Create evidence table for file uploads
CREATE TABLE IF NOT EXISTS evidence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- File info
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER,
  storage_path TEXT NOT NULL,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE evidence ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own evidence" 
  ON evidence FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can upload evidence to their cases" 
  ON evidence FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own evidence"
  ON evidence FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own evidence" 
  ON evidence FOR DELETE 
  USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX idx_evidence_case_id ON evidence(case_id);

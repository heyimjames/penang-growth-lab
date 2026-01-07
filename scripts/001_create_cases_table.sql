-- Create the main cases table to store user complaints
CREATE TABLE IF NOT EXISTS cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Case basic info
  title TEXT,
  complaint_text TEXT NOT NULL,
  company_name TEXT NOT NULL,
  company_domain TEXT,
  
  -- Purchase details
  purchase_date DATE,
  purchase_amount DECIMAL(10, 2),
  currency TEXT DEFAULT 'GBP',
  desired_outcome TEXT,
  
  -- AI analysis results
  confidence_score INTEGER,
  identified_issues JSONB,
  legal_basis JSONB,
  company_intel JSONB,
  
  -- Generated letter
  generated_letter TEXT,
  letter_tone TEXT DEFAULT 'assertive',
  
  -- Status tracking
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'analyzing', 'ready', 'sent', 'resolved')),
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE cases ENABLE ROW LEVEL SECURITY;

-- RLS Policies - users can only access their own cases
CREATE POLICY "Users can view their own cases" 
  ON cases FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own cases" 
  ON cases FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cases" 
  ON cases FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cases" 
  ON cases FOR DELETE 
  USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX idx_cases_user_id ON cases(user_id);
CREATE INDEX idx_cases_status ON cases(status);
CREATE INDEX idx_cases_created_at ON cases(created_at DESC);

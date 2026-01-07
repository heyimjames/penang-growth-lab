-- Create the case_messages table for storing chat history per case
CREATE TABLE IF NOT EXISTS case_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Message content
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,

  -- For tool calls and structured data
  tool_invocations JSONB,

  -- Message metadata
  metadata JSONB DEFAULT '{}',

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE case_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies - users can only access messages for their own cases
CREATE POLICY "Users can view messages for their own cases"
  ON case_messages FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create messages for their own cases"
  ON case_messages FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete messages for their own cases"
  ON case_messages FOR DELETE
  USING (auth.uid() = user_id);

-- Create indexes for faster queries
CREATE INDEX idx_case_messages_case_id ON case_messages(case_id);
CREATE INDEX idx_case_messages_created_at ON case_messages(case_id, created_at ASC);

-- Feature requests table for user-submitted feature ideas
CREATE TABLE IF NOT EXISTS feature_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- User submission (original raw input)
  raw_request TEXT NOT NULL,

  -- AI-processed fields (populated by Claude)
  title TEXT,
  description TEXT,
  category TEXT CHECK (category IN ('ui', 'functionality', 'integration', 'performance', 'content')),
  user_problem TEXT,
  proposed_solution TEXT,
  acceptance_criteria JSONB DEFAULT '[]'::JSONB,
  priority_suggestion TEXT CHECK (priority_suggestion IN ('critical', 'high', 'medium', 'low')),

  -- Moderation
  is_relevant BOOLEAN DEFAULT true,
  rejection_reason TEXT,

  -- Status tracking
  status TEXT NOT NULL DEFAULT 'pending_review'
    CHECK (status IN ('pending_review', 'approved', 'planned', 'in_progress', 'shipped', 'rejected')),

  -- Engagement
  vote_count INTEGER DEFAULT 1,

  -- Slack integration
  slack_message_ts TEXT,
  slack_channel_id TEXT,

  -- GitHub integration
  github_issue_url TEXT,
  github_pr_url TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Votes table (one vote per user per request)
CREATE TABLE IF NOT EXISTS feature_request_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  feature_request_id UUID NOT NULL REFERENCES feature_requests(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(feature_request_id, user_id)
);

-- Enable Row Level Security
ALTER TABLE feature_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE feature_request_votes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for feature_requests

-- Anyone authenticated can read approved/shipped/planned/in_progress requests
CREATE POLICY "Read public requests" ON feature_requests
  FOR SELECT TO authenticated
  USING (status IN ('approved', 'planned', 'in_progress', 'shipped'));

-- Users can read their own requests (any status, including pending_review and rejected)
CREATE POLICY "Read own requests" ON feature_requests
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- Users can create requests
CREATE POLICY "Create requests" ON feature_requests
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Users can only update their own pending_review requests (e.g., edit before review)
CREATE POLICY "Update own pending requests" ON feature_requests
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid() AND status = 'pending_review')
  WITH CHECK (user_id = auth.uid());

-- RLS Policies for feature_request_votes

-- Anyone authenticated can read votes (for counting)
CREATE POLICY "Read all votes" ON feature_request_votes
  FOR SELECT TO authenticated
  USING (true);

-- Users can vote once per request
CREATE POLICY "Create vote" ON feature_request_votes
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Users can delete their own vote (unvote)
CREATE POLICY "Delete own vote" ON feature_request_votes
  FOR DELETE TO authenticated
  USING (user_id = auth.uid());

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_feature_requests_status ON feature_requests(status);
CREATE INDEX IF NOT EXISTS idx_feature_requests_votes ON feature_requests(vote_count DESC);
CREATE INDEX IF NOT EXISTS idx_feature_requests_created ON feature_requests(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_feature_requests_user ON feature_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_feature_request_votes_request ON feature_request_votes(feature_request_id);
CREATE INDEX IF NOT EXISTS idx_feature_request_votes_user ON feature_request_votes(user_id);

-- Function to update vote_count when votes change
CREATE OR REPLACE FUNCTION update_feature_request_vote_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE feature_requests
    SET vote_count = vote_count + 1, updated_at = NOW()
    WHERE id = NEW.feature_request_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE feature_requests
    SET vote_count = vote_count - 1, updated_at = NOW()
    WHERE id = OLD.feature_request_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically update vote_count
DROP TRIGGER IF EXISTS trigger_update_vote_count ON feature_request_votes;
CREATE TRIGGER trigger_update_vote_count
  AFTER INSERT OR DELETE ON feature_request_votes
  FOR EACH ROW
  EXECUTE FUNCTION update_feature_request_vote_count();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_feature_request_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at on changes
DROP TRIGGER IF EXISTS trigger_update_feature_request_timestamp ON feature_requests;
CREATE TRIGGER trigger_update_feature_request_timestamp
  BEFORE UPDATE ON feature_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_feature_request_updated_at();

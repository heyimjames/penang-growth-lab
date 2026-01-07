-- Create email tracking table for sent emails
CREATE TABLE IF NOT EXISTS sent_emails (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  letter_id UUID REFERENCES letters(id) ON DELETE SET NULL,

  -- Email details
  recipient_email TEXT NOT NULL,
  recipient_name TEXT,
  subject TEXT NOT NULL,
  body_preview TEXT, -- First 200 chars of body

  -- Tracking
  tracking_id UUID DEFAULT gen_random_uuid(),
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  opened_at TIMESTAMPTZ,
  open_count INTEGER DEFAULT 0,
  clicked_at TIMESTAMPTZ,

  -- Status
  status TEXT NOT NULL DEFAULT 'sent' CHECK (status IN ('pending', 'sent', 'delivered', 'opened', 'bounced', 'failed')),
  error_message TEXT,

  -- Provider details
  provider TEXT DEFAULT 'resend',
  provider_message_id TEXT,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE sent_emails ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own sent emails"
  ON sent_emails FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own sent emails"
  ON sent_emails FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sent emails"
  ON sent_emails FOR UPDATE
  USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_sent_emails_case_id ON sent_emails(case_id);
CREATE INDEX IF NOT EXISTS idx_sent_emails_user_id ON sent_emails(user_id);
CREATE INDEX IF NOT EXISTS idx_sent_emails_tracking_id ON sent_emails(tracking_id);
CREATE INDEX IF NOT EXISTS idx_sent_emails_status ON sent_emails(status);

-- Update trigger for updated_at
CREATE TRIGGER update_sent_emails_updated_at
  BEFORE UPDATE ON sent_emails
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add letter_sent_at tracking to cases if not exists
ALTER TABLE cases ADD COLUMN IF NOT EXISTS emails_sent_count INTEGER DEFAULT 0;

-- Create view for email analytics
CREATE OR REPLACE VIEW email_analytics AS
SELECT
  user_id,
  COUNT(*) as total_sent,
  COUNT(CASE WHEN opened_at IS NOT NULL THEN 1 END) as total_opened,
  COUNT(CASE WHEN status = 'bounced' THEN 1 END) as total_bounced,
  AVG(open_count) as avg_opens,
  AVG(
    CASE WHEN opened_at IS NOT NULL
    THEN EXTRACT(EPOCH FROM (opened_at - sent_at)) / 3600
    END
  ) as avg_hours_to_open
FROM sent_emails
GROUP BY user_id;

COMMENT ON TABLE sent_emails IS 'Tracks emails sent through the platform with open tracking';
COMMENT ON COLUMN sent_emails.tracking_id IS 'UUID used in tracking pixel URL';

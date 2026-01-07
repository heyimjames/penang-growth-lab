-- Add case outcome tracking fields for social proof engine
-- Run this migration to add resolution tracking and testimonial support

-- Add resolution tracking fields to cases table
ALTER TABLE cases ADD COLUMN IF NOT EXISTS resolution_type TEXT CHECK (
  resolution_type IN (
    'full_refund',
    'partial_refund',
    'compensation',
    'apology',
    'replacement',
    'service_credit',
    'rejected',
    'no_response',
    'pending'
  )
);

ALTER TABLE cases ADD COLUMN IF NOT EXISTS resolution_amount DECIMAL(10, 2);
ALTER TABLE cases ADD COLUMN IF NOT EXISTS resolution_days INTEGER; -- Days from case creation to resolution
ALTER TABLE cases ADD COLUMN IF NOT EXISTS company_response_count INTEGER DEFAULT 0;
ALTER TABLE cases ADD COLUMN IF NOT EXISTS escalation_used BOOLEAN DEFAULT FALSE;
ALTER TABLE cases ADD COLUMN IF NOT EXISTS letter_sent_at TIMESTAMPTZ;

-- Add testimonial fields
ALTER TABLE cases ADD COLUMN IF NOT EXISTS testimonial_text TEXT;
ALTER TABLE cases ADD COLUMN IF NOT EXISTS testimonial_approved BOOLEAN DEFAULT FALSE;
ALTER TABLE cases ADD COLUMN IF NOT EXISTS testimonial_shared BOOLEAN DEFAULT FALSE;
ALTER TABLE cases ADD COLUMN IF NOT EXISTS testimonial_submitted_at TIMESTAMPTZ;

-- Create company stats materialized view for fast lookups
CREATE MATERIALIZED VIEW IF NOT EXISTS company_stats AS
SELECT
  company_name,
  company_domain,
  COUNT(*) as total_cases,
  COUNT(CASE WHEN status = 'resolved' THEN 1 END) as resolved_cases,
  COUNT(CASE WHEN resolution_type IN ('full_refund', 'partial_refund', 'compensation', 'replacement', 'service_credit') THEN 1 END) as successful_cases,
  AVG(CASE WHEN resolution_days IS NOT NULL THEN resolution_days END)::INTEGER as avg_resolution_days,
  AVG(CASE WHEN resolution_amount IS NOT NULL THEN resolution_amount END)::DECIMAL(10,2) as avg_resolution_amount,
  MAX(updated_at) as last_case_date
FROM cases
WHERE company_name IS NOT NULL
GROUP BY company_name, company_domain
HAVING COUNT(*) >= 1;

-- Create unique index for fast refresh
CREATE UNIQUE INDEX IF NOT EXISTS company_stats_name_idx ON company_stats (company_name);

-- Create function to refresh company stats
CREATE OR REPLACE FUNCTION refresh_company_stats()
RETURNS TRIGGER AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY company_stats;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to refresh stats on case updates
DROP TRIGGER IF EXISTS refresh_company_stats_trigger ON cases;
CREATE TRIGGER refresh_company_stats_trigger
AFTER INSERT OR UPDATE OR DELETE ON cases
FOR EACH STATEMENT
EXECUTE FUNCTION refresh_company_stats();

-- Create approved testimonials view for public display
CREATE OR REPLACE VIEW public_testimonials AS
SELECT
  c.id,
  c.company_name,
  c.testimonial_text,
  c.resolution_type,
  c.resolution_amount,
  c.resolution_days,
  c.testimonial_submitted_at,
  p.full_name
FROM cases c
LEFT JOIN profiles p ON c.user_id = p.user_id
WHERE c.testimonial_approved = true
  AND c.testimonial_shared = true
  AND c.testimonial_text IS NOT NULL;

-- Add indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_cases_resolution_type ON cases(resolution_type);
CREATE INDEX IF NOT EXISTS idx_cases_testimonial_approved ON cases(testimonial_approved) WHERE testimonial_approved = true;
CREATE INDEX IF NOT EXISTS idx_cases_company_name ON cases(company_name);

COMMENT ON COLUMN cases.resolution_type IS 'Type of resolution achieved: full_refund, partial_refund, compensation, apology, replacement, service_credit, rejected, no_response, pending';
COMMENT ON COLUMN cases.resolution_amount IS 'Amount received in resolution (if applicable)';
COMMENT ON COLUMN cases.resolution_days IS 'Number of days from case creation to resolution';
COMMENT ON COLUMN cases.testimonial_text IS 'User testimonial about their experience';
COMMENT ON COLUMN cases.testimonial_approved IS 'Whether testimonial has been approved for public display';

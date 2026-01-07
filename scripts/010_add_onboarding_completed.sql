-- Add onboarding_completed column to profiles table
-- This tracks whether users have completed the interactive onboarding flow

ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE;

-- Create index for quick lookups
CREATE INDEX IF NOT EXISTS idx_profiles_onboarding_completed ON profiles(onboarding_completed);

-- Comment for documentation
COMMENT ON COLUMN profiles.onboarding_completed IS 'Whether the user has completed the post-signup onboarding flow';

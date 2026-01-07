-- Create user credits table to track credit balances
CREATE TABLE IF NOT EXISTS user_credits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Credit balance
  credits INTEGER NOT NULL DEFAULT 1,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create credit transactions table for audit trail
CREATE TABLE IF NOT EXISTS credit_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Transaction details
  amount INTEGER NOT NULL, -- positive for purchases, negative for usage
  type TEXT NOT NULL CHECK (type IN ('signup_bonus', 'purchase', 'bundle_purchase', 'case_usage', 'refund', 'admin_adjustment')),
  description TEXT,

  -- Reference to related entities
  case_id UUID REFERENCES cases(id) ON DELETE SET NULL,

  -- Payment reference (for purchases)
  payment_provider TEXT, -- 'stripe', 'paypal', etc.
  payment_reference TEXT,

  -- Balance after transaction
  balance_after INTEGER NOT NULL,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE user_credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_credits
CREATE POLICY "Users can view their own credits"
  ON user_credits FOR SELECT
  USING (auth.uid() = user_id);

-- Users cannot directly modify credits (handled by server actions)
-- Only service role can insert/update

-- RLS Policies for credit_transactions
CREATE POLICY "Users can view their own transactions"
  ON credit_transactions FOR SELECT
  USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX idx_user_credits_user_id ON user_credits(user_id);
CREATE INDEX idx_credit_transactions_user_id ON credit_transactions(user_id);
CREATE INDEX idx_credit_transactions_created_at ON credit_transactions(created_at DESC);
CREATE INDEX idx_credit_transactions_type ON credit_transactions(type);

-- Function to initialize credits for new users
CREATE OR REPLACE FUNCTION initialize_user_credits()
RETURNS TRIGGER AS $$
BEGIN
  -- Create credits record with 1 free credit
  INSERT INTO user_credits (user_id, credits)
  VALUES (NEW.id, 1);

  -- Record the signup bonus transaction
  INSERT INTO credit_transactions (user_id, amount, type, description, balance_after)
  VALUES (NEW.id, 1, 'signup_bonus', 'Welcome bonus - 1 free case', 1);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create credits on user signup
DROP TRIGGER IF EXISTS on_auth_user_created_credits ON auth.users;
CREATE TRIGGER on_auth_user_created_credits
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION initialize_user_credits();

-- Function to use a credit (called when creating a case)
CREATE OR REPLACE FUNCTION use_credit(p_user_id UUID, p_case_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  current_credits INTEGER;
BEGIN
  -- Get current credits with lock
  SELECT credits INTO current_credits
  FROM user_credits
  WHERE user_id = p_user_id
  FOR UPDATE;

  -- Check if user has credits
  IF current_credits IS NULL OR current_credits < 1 THEN
    RETURN FALSE;
  END IF;

  -- Deduct credit
  UPDATE user_credits
  SET credits = credits - 1, updated_at = NOW()
  WHERE user_id = p_user_id;

  -- Record transaction
  INSERT INTO credit_transactions (user_id, amount, type, description, case_id, balance_after)
  VALUES (p_user_id, -1, 'case_usage', 'Used for case creation', p_case_id, current_credits - 1);

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to add credits (for purchases)
CREATE OR REPLACE FUNCTION add_credits(
  p_user_id UUID,
  p_amount INTEGER,
  p_type TEXT,
  p_description TEXT DEFAULT NULL,
  p_payment_provider TEXT DEFAULT NULL,
  p_payment_reference TEXT DEFAULT NULL
)
RETURNS INTEGER AS $$
DECLARE
  new_balance INTEGER;
BEGIN
  -- Upsert credits
  INSERT INTO user_credits (user_id, credits)
  VALUES (p_user_id, p_amount)
  ON CONFLICT (user_id)
  DO UPDATE SET
    credits = user_credits.credits + p_amount,
    updated_at = NOW()
  RETURNING credits INTO new_balance;

  -- Record transaction
  INSERT INTO credit_transactions (user_id, amount, type, description, payment_provider, payment_reference, balance_after)
  VALUES (p_user_id, p_amount, p_type, p_description, p_payment_provider, p_payment_reference, new_balance);

  RETURN new_balance;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add updated_at trigger for user_credits
CREATE TRIGGER update_user_credits_updated_at
  BEFORE UPDATE ON user_credits
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

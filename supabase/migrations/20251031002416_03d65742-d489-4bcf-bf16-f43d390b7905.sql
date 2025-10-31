-- Make contact fields optional on affiliates table
-- Only name is required to create an affiliate
ALTER TABLE public.affiliates 
  ALTER COLUMN phone DROP NOT NULL,
  ALTER COLUMN email DROP NOT NULL,
  ALTER COLUMN website DROP NOT NULL,
  ALTER COLUMN company DROP NOT NULL;

-- Remove unique constraint on email since it's now optional
ALTER TABLE public.affiliates DROP CONSTRAINT IF EXISTS affiliates_email_key;
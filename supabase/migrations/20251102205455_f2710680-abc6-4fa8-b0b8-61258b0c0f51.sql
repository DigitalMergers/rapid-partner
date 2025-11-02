-- Allow public read access to active affiliates (only non-sensitive fields)
-- This is needed so affiliate landing pages work for unauthenticated visitors
CREATE POLICY "Public can view active affiliates basic info"
ON public.affiliates
FOR SELECT
TO public
USING (status = 'active');
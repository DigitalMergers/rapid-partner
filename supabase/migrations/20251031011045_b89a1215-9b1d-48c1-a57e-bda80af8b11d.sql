-- Fix leads table RLS policies to protect sensitive data
-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "Allow public read on leads" ON public.leads;
DROP POLICY IF EXISTS "Allow public update on leads" ON public.leads;

-- Keep public INSERT so affiliate landing pages can submit leads (no auth required)
-- This is necessary for the public-facing lead forms to work

-- Only authenticated users can view leads (admin access)
CREATE POLICY "Authenticated users can view all leads"
ON public.leads
FOR SELECT
TO authenticated
USING (true);

-- Only authenticated users can update leads (for status changes)
CREATE POLICY "Authenticated users can update leads"
ON public.leads
FOR UPDATE
TO authenticated
USING (true);

-- Only authenticated users can delete leads
CREATE POLICY "Authenticated users can delete leads"
ON public.leads
FOR DELETE
TO authenticated
USING (true);
-- Create role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'affiliate');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own roles
CREATE POLICY "Users can view own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Policy: Only admins can manage roles
CREATE POLICY "Admins can manage all roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Add user_id column to affiliates table
ALTER TABLE public.affiliates ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- Create public view for affiliates (non-sensitive data only)
CREATE OR REPLACE VIEW public.affiliates_public AS
SELECT 
  id,
  slug,
  first_name,
  last_name,
  created_at
FROM public.affiliates;

-- Update affiliates RLS policies
DROP POLICY IF EXISTS "Allow public read access on affiliates" ON public.affiliates;
DROP POLICY IF EXISTS "Authenticated users can insert affiliates" ON public.affiliates;
DROP POLICY IF EXISTS "Authenticated users can update affiliates" ON public.affiliates;
DROP POLICY IF EXISTS "Authenticated users can delete affiliates" ON public.affiliates;

-- Admins can do everything
CREATE POLICY "Admins full access to affiliates"
ON public.affiliates
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Affiliates can view their own record
CREATE POLICY "Affiliates view own record"
ON public.affiliates
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Update leads RLS policies
DROP POLICY IF EXISTS "Authenticated users can view all leads" ON public.leads;
DROP POLICY IF EXISTS "Authenticated users can update leads" ON public.leads;
DROP POLICY IF EXISTS "Authenticated users can delete leads" ON public.leads;
DROP POLICY IF EXISTS "Allow public insert on leads" ON public.leads;

-- Public can submit leads
CREATE POLICY "Public can insert leads"
ON public.leads
FOR INSERT
WITH CHECK (true);

-- Admins can manage all leads
CREATE POLICY "Admins full access to leads"
ON public.leads
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Affiliates can view their own leads
CREATE POLICY "Affiliates view own leads"
ON public.leads
FOR SELECT
TO authenticated
USING (
  affiliate_id IN (
    SELECT id FROM public.affiliates WHERE user_id = auth.uid()
  )
);

-- Update clicks RLS policies
DROP POLICY IF EXISTS "Authenticated users can read clicks" ON public.clicks;

-- Admins can view all clicks
CREATE POLICY "Admins view all clicks"
ON public.clicks
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Affiliates can view their own clicks
CREATE POLICY "Affiliates view own clicks"
ON public.clicks
FOR SELECT
TO authenticated
USING (
  affiliate_id IN (
    SELECT id FROM public.affiliates WHERE user_id = auth.uid()
  )
);

-- Update conversions RLS policies
DROP POLICY IF EXISTS "Allow public read on conversions" ON public.conversions;

-- Admins can view all conversions
CREATE POLICY "Admins view all conversions"
ON public.conversions
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Affiliates can view their own conversions
CREATE POLICY "Affiliates view own conversions"
ON public.conversions
FOR SELECT
TO authenticated
USING (
  affiliate_id IN (
    SELECT id FROM public.affiliates WHERE user_id = auth.uid()
  )
);

-- Update landing_pages RLS policies
DROP POLICY IF EXISTS "Authenticated users can insert landing_pages" ON public.landing_pages;
DROP POLICY IF EXISTS "Authenticated users can update landing_pages" ON public.landing_pages;
DROP POLICY IF EXISTS "Authenticated users can delete landing_pages" ON public.landing_pages;

-- Admins can manage landing pages
CREATE POLICY "Admins full access to landing_pages"
ON public.landing_pages
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));
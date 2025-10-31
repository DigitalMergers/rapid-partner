-- Update affiliates table policies
DROP POLICY IF EXISTS "Allow public insert on affiliates" ON public.affiliates;
DROP POLICY IF EXISTS "Allow public read access on affiliates" ON public.affiliates;
DROP POLICY IF EXISTS "Allow public update on affiliates" ON public.affiliates;

-- Keep public read access for landing pages
CREATE POLICY "Allow public read access on affiliates"
ON public.affiliates
FOR SELECT
USING (true);

-- Restrict write operations to authenticated users
CREATE POLICY "Authenticated users can insert affiliates"
ON public.affiliates
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update affiliates"
ON public.affiliates
FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can delete affiliates"
ON public.affiliates
FOR DELETE
TO authenticated
USING (true);

-- Update clicks table policies
DROP POLICY IF EXISTS "Allow public insert on clicks" ON public.clicks;
DROP POLICY IF EXISTS "Allow public read on clicks" ON public.clicks;

-- Keep public insert for tracking
CREATE POLICY "Allow public insert on clicks"
ON public.clicks
FOR INSERT
WITH CHECK (true);

-- Restrict read to authenticated users
CREATE POLICY "Authenticated users can read clicks"
ON public.clicks
FOR SELECT
TO authenticated
USING (true);

-- Update landing_pages table policies
DROP POLICY IF EXISTS "Allow public insert on landing_pages" ON public.landing_pages;
DROP POLICY IF EXISTS "Allow public read access on landing_pages" ON public.landing_pages;

-- Keep public read for loading landing page configs
CREATE POLICY "Allow public read access on landing_pages"
ON public.landing_pages
FOR SELECT
USING (true);

-- Restrict write operations to authenticated users
CREATE POLICY "Authenticated users can insert landing_pages"
ON public.landing_pages
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update landing_pages"
ON public.landing_pages
FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can delete landing_pages"
ON public.landing_pages
FOR DELETE
TO authenticated
USING (true);
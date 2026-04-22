
-- 1) Affiliates: drop overly broad public SELECT policy
DROP POLICY IF EXISTS "Public can view active affiliates basic info" ON public.affiliates;

-- 2) Tracking links: drop overly broad public SELECT policy
DROP POLICY IF EXISTS "Public can view tracking_links" ON public.tracking_links;

-- 3) Safe public lookup for an affiliate by slug (only non-sensitive fields)
CREATE OR REPLACE FUNCTION public.get_public_affiliate_by_slug(_slug text)
RETURNS TABLE (
  id uuid,
  slug text,
  first_name text,
  last_name text,
  code text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT a.id, a.slug, a.first_name, a.last_name, a.code
  FROM public.affiliates a
  WHERE a.slug = _slug
    AND a.status = 'active'
  LIMIT 1;
$$;

-- 4) Safe public lookup for a tracking link by short_code (only fields needed to redirect)
CREATE OR REPLACE FUNCTION public.get_tracking_link_for_redirect(_short_code text)
RETURNS TABLE (
  affiliate_id uuid,
  destination_url text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  affiliate_slug text,
  affiliate_code text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    tl.affiliate_id,
    tl.destination_url,
    tl.utm_source,
    tl.utm_medium,
    tl.utm_campaign,
    a.slug AS affiliate_slug,
    a.code AS affiliate_code
  FROM public.tracking_links tl
  LEFT JOIN public.affiliates a ON a.id = tl.affiliate_id
  WHERE tl.short_code = _short_code
  LIMIT 1;
$$;

-- 5) Allow anon + authenticated to call these safe functions
GRANT EXECUTE ON FUNCTION public.get_public_affiliate_by_slug(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_tracking_link_for_redirect(text) TO anon, authenticated;

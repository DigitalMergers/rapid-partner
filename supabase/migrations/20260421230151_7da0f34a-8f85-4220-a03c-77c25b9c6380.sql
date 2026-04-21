CREATE TABLE public.tracking_links (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  short_code text NOT NULL UNIQUE,
  affiliate_id uuid NOT NULL REFERENCES public.affiliates(id) ON DELETE CASCADE,
  destination_url text NOT NULL,
  label text,
  utm_source text NOT NULL DEFAULT 'affiliate',
  utm_medium text NOT NULL DEFAULT 'referral',
  utm_campaign text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_tracking_links_short_code ON public.tracking_links(short_code);
CREATE INDEX idx_tracking_links_affiliate_id ON public.tracking_links(affiliate_id);

ALTER TABLE public.tracking_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins full access to tracking_links"
ON public.tracking_links
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Public can view tracking_links"
ON public.tracking_links
FOR SELECT
TO public
USING (true);
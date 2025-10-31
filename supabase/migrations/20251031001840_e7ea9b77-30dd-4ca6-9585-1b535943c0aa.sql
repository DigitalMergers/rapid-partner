-- Create affiliates table
CREATE TABLE public.affiliates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  website TEXT NOT NULL,
  company TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  code TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create landing_pages table
CREATE TABLE public.landing_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id UUID REFERENCES public.affiliates(id) ON DELETE CASCADE,
  is_template BOOLEAN NOT NULL DEFAULT false,
  name TEXT NOT NULL,
  blocks JSONB NOT NULL,
  theme_overrides JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create clicks table
CREATE TABLE public.clicks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id UUID NOT NULL REFERENCES public.affiliates(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  path TEXT NOT NULL,
  ip TEXT,
  ua TEXT,
  utm JSONB,
  ts TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create leads table
CREATE TABLE public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id UUID NOT NULL REFERENCES public.affiliates(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  website TEXT,
  consented BOOLEAN NOT NULL DEFAULT false,
  payload JSONB,
  ts TIMESTAMPTZ NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'qualified', 'won', 'lost'))
);

-- Create conversions table
CREATE TABLE public.conversions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id UUID NOT NULL REFERENCES public.affiliates(id) ON DELETE CASCADE,
  lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL,
  code TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  ts TIMESTAMPTZ NOT NULL DEFAULT now(),
  notes TEXT
);

-- Enable RLS
ALTER TABLE public.affiliates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.landing_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversions ENABLE ROW LEVEL SECURITY;

-- Public access policies (no auth required for this admin system)
CREATE POLICY "Allow public read access on affiliates" ON public.affiliates FOR SELECT USING (true);
CREATE POLICY "Allow public insert on affiliates" ON public.affiliates FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on affiliates" ON public.affiliates FOR UPDATE USING (true);

CREATE POLICY "Allow public read access on landing_pages" ON public.landing_pages FOR SELECT USING (true);
CREATE POLICY "Allow public insert on landing_pages" ON public.landing_pages FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public insert on clicks" ON public.clicks FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read on clicks" ON public.clicks FOR SELECT USING (true);

CREATE POLICY "Allow public insert on leads" ON public.leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read on leads" ON public.leads FOR SELECT USING (true);
CREATE POLICY "Allow public update on leads" ON public.leads FOR UPDATE USING (true);

CREATE POLICY "Allow public read on conversions" ON public.conversions FOR SELECT USING (true);

-- Create indexes for performance
CREATE INDEX idx_affiliates_code ON public.affiliates(code);
CREATE INDEX idx_affiliates_slug ON public.affiliates(slug);
CREATE INDEX idx_affiliates_email ON public.affiliates(email);
CREATE INDEX idx_clicks_affiliate_id ON public.clicks(affiliate_id);
CREATE INDEX idx_clicks_ts ON public.clicks(ts);
CREATE INDEX idx_leads_affiliate_id ON public.leads(affiliate_id);
CREATE INDEX idx_leads_ts ON public.leads(ts);
CREATE INDEX idx_conversions_affiliate_id ON public.conversions(affiliate_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_affiliates_updated_at
  BEFORE UPDATE ON public.affiliates
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_landing_pages_updated_at
  BEFORE UPDATE ON public.landing_pages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert master template
INSERT INTO public.landing_pages (is_template, name, blocks) VALUES (
  true,
  'Master Landing Template',
  '{"hero": {"title": "Grow Faster With A Verified Partner", "subtitle": "Smart systems, clear ROI, and a real human to help.", "badge": "Your Company"}, "features": [{"title": "Verified Partners", "desc": "We vet affiliates so you don''t have to."}, {"title": "Transparent Tracking", "desc": "Clicks, leads, conversions. No mystery."}, {"title": "Fast Support", "desc": "Real answers, not canned responses."}]}'::jsonb
);
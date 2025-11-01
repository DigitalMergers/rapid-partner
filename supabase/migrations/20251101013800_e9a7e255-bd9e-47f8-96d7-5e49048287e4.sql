-- Drop the public view (security linter flagged it)
-- We'll handle data filtering in the application layer instead
DROP VIEW IF EXISTS public.affiliates_public;
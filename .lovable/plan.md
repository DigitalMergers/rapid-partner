

## Add UTM Link Generator (Additive — Nothing Else Changes)

A new, isolated feature that lets you paste any destination URL, pick an affiliate, and instantly get a trackable short link on your domain. Clicks through that link are logged to the existing `clicks` table and forwarded to the destination with UTM parameters appended. No existing pages, forms, or flows are modified.

### What you'll be able to do

1. Open a new "Tracking Links" page from the admin dashboard
2. Paste any URL (e.g. `https://yourdomain.com/offer` or `https://calendly.com/you/call`)
3. Pick an affiliate from a dropdown
4. Optionally label it ("Webinar promo", "Email blast")
5. Get back a short link like `events.strategicpartner.io/r/abc123`
6. Share it anywhere — every click is logged with affiliate attribution and the visitor lands on the destination with UTMs appended

### How the link works

```text
Visitor clicks:  events.strategicpartner.io/r/abc123

  1. Lookup link abc123 → affiliate "james-theo", destination "https://yourdomain.com/offer"
  2. Insert row into clicks table (affiliate_id, code, path, ua, utm)
  3. Redirect to:
     https://yourdomain.com/offer
       ?utm_source=affiliate
       &utm_medium=referral
       &utm_campaign=james-theo
       &ref=james-theo
       &click_id=<uuid>
```

### What gets built (additive only)

**1. New table `tracking_links`** (migration)
- `id uuid pk`, `short_code text unique`, `affiliate_id uuid`, `destination_url text`, `label text`, `utm_source/medium/campaign text` (with sensible defaults), `created_at timestamptz`
- RLS: admins full access; public SELECT (needed so the redirect can resolve the link)

**2. New page `src/pages/TrackingLinks.tsx`** (route `/admin/links`)
- Form: destination URL, affiliate dropdown, optional label, optional UTM overrides
- Generates short code, inserts row, shows copy-to-clipboard short link
- Table below: all existing links with click counts (joined from `clicks`), copy button, delete button

**3. New page `src/pages/TrackRedirect.tsx`** (route `/r/:shortCode`)
- Lookup link → insert click → `window.location.replace(destination + UTMs)`
- Minimal UI ("Redirecting…") while it runs
- If short code not found: redirect to `/404`

**4. Two new routes added to `src/App.tsx`**
- `/r/:shortCode` → `TrackRedirect`
- `/admin/links` → `TrackingLinks`

**5. Small "Tracking Links" tile added to the Admin Quick Actions grid**
- Links to `/admin/links`. No other Admin changes.

### Build error fix (required to ship anything)

Four files reference `process.env.*` which doesn't exist in Vite. Replace with `import.meta.env.VITE_SUPABASE_URL` in:
- `src/components/CreateAffiliateDialog.tsx:104`
- `src/pages/AffiliateLanding.tsx:159`
- `src/pages/Auth.tsx:105`
- `src/pages/Leads.tsx:78`

Pure mechanical fix, no behavior change.

### Explicitly NOT touched

- Event page builder, affiliate landing pages, lead form, admin KPIs, existing affiliates table — all untouched.

### Technical summary

- Migration: `tracking_links` table + RLS policies (admin ALL, public SELECT)
- New routes in `App.tsx`: `/r/:shortCode`, `/admin/links`
- New components: `TrackingLinks.tsx`, `TrackRedirect.tsx`
- Short code generation: 6-char nanoid-style random string, retry on collision
- UTM defaults: source=`affiliate`, medium=`referral`, campaign=affiliate slug; user can override per link
- Click logging reuses existing `clicks` table + public INSERT policy already in place
- `process.env` → `import.meta.env` in 4 files


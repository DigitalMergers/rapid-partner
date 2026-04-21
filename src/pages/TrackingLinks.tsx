import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft, Copy, Trash2, Link2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

type Affiliate = {
  id: string;
  slug: string;
  first_name: string;
  last_name: string;
};

type TrackingLink = {
  id: string;
  short_code: string;
  destination_url: string;
  label: string | null;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string | null;
  affiliate_id: string;
  created_at: string;
  affiliates?: { slug: string; first_name: string; last_name: string } | null;
};

function generateShortCode(len = 6) {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let out = "";
  for (let i = 0; i < len; i++) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}

export default function TrackingLinks() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
  const [links, setLinks] = useState<TrackingLink[]>([]);
  const [clickCounts, setClickCounts] = useState<Record<string, number>>({});

  const [destination, setDestination] = useState("");
  const [affiliateId, setAffiliateId] = useState<string>("");
  const [label, setLabel] = useState("");
  const [utmSource, setUtmSource] = useState("affiliate");
  const [utmMedium, setUtmMedium] = useState("referral");
  const [utmCampaign, setUtmCampaign] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate("/auth");
  }, [user, loading, navigate]);

  const fetchData = async () => {
    const [{ data: affs }, { data: tls }, { data: clickRows }] = await Promise.all([
      supabase
        .from("affiliates")
        .select("id, slug, first_name, last_name")
        .order("created_at", { ascending: false }),
      supabase
        .from("tracking_links")
        .select("*, affiliates(slug, first_name, last_name)")
        .order("created_at", { ascending: false }),
      supabase.from("clicks").select("path"),
    ]);

    setAffiliates((affs as Affiliate[]) || []);
    setLinks((tls as TrackingLink[]) || []);

    const counts: Record<string, number> = {};
    (clickRows || []).forEach((c: any) => {
      const m = typeof c.path === "string" ? c.path.match(/^\/r\/([^/?#]+)/) : null;
      if (m) counts[m[1]] = (counts[m[1]] || 0) + 1;
    });
    setClickCounts(counts);
  };

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  const baseUrl = window.location.origin;

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination || !affiliateId) {
      toast.error("Destination URL and affiliate are required");
      return;
    }
    try {
      // Validate URL
      new URL(destination);
    } catch {
      toast.error("Destination must be a valid URL (include https://)");
      return;
    }

    setSubmitting(true);
    try {
      // Try a few times in case of short_code collision
      let inserted = null;
      let lastError: any = null;
      for (let attempt = 0; attempt < 5; attempt++) {
        const code = generateShortCode(6);
        const { data, error } = await supabase
          .from("tracking_links")
          .insert({
            short_code: code,
            affiliate_id: affiliateId,
            destination_url: destination,
            label: label || null,
            utm_source: utmSource || "affiliate",
            utm_medium: utmMedium || "referral",
            utm_campaign: utmCampaign || null,
          })
          .select("*, affiliates(slug, first_name, last_name)")
          .maybeSingle();
        if (!error && data) {
          inserted = data;
          break;
        }
        lastError = error;
        // unique violation? retry; otherwise break
        if (error && !`${error.message}`.toLowerCase().includes("duplicate")) break;
      }

      if (!inserted) {
        throw lastError || new Error("Failed to create tracking link");
      }

      toast.success("Tracking link created");
      setDestination("");
      setLabel("");
      setUtmCampaign("");
      await fetchData();

      const url = `${baseUrl}/r/${(inserted as any).short_code}`;
      navigator.clipboard?.writeText(url).catch(() => {});
    } catch (err: any) {
      toast.error(err.message || "Failed to create tracking link");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopy = (shortCode: string) => {
    const url = `${baseUrl}/r/${shortCode}`;
    navigator.clipboard.writeText(url).then(
      () => toast.success("Link copied"),
      () => toast.error("Copy failed"),
    );
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("tracking_links").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete");
      return;
    }
    toast.success("Link deleted");
    fetchData();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }
  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => navigate("/admin")} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </div>

        <div className="glass-panel border border-border rounded-2xl p-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-3">
            <Link2 className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">UTM Link Generator</span>
          </div>
          <h1 className="text-3xl font-extrabold mb-2">Tracking Links</h1>
          <p className="text-muted-foreground mb-6">
            Paste any destination, pick an affiliate, get a trackable short link.
          </p>

          <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="destination">Destination URL</Label>
              <Input
                id="destination"
                placeholder="https://yourdomain.com/offer"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Affiliate</Label>
              <Select value={affiliateId} onValueChange={setAffiliateId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an affiliate" />
                </SelectTrigger>
                <SelectContent>
                  {affiliates.map((a) => (
                    <SelectItem key={a.id} value={a.id}>
                      {a.first_name} {a.last_name} ({a.slug})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="label">Label (optional)</Label>
              <Input
                id="label"
                placeholder="Webinar promo"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="utm_source">UTM Source</Label>
              <Input id="utm_source" value={utmSource} onChange={(e) => setUtmSource(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="utm_medium">UTM Medium</Label>
              <Input id="utm_medium" value={utmMedium} onChange={(e) => setUtmMedium(e.target.value)} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="utm_campaign">UTM Campaign (optional — defaults to affiliate slug)</Label>
              <Input
                id="utm_campaign"
                placeholder="leave blank to use affiliate slug"
                value={utmCampaign}
                onChange={(e) => setUtmCampaign(e.target.value)}
              />
            </div>

            <div className="md:col-span-2">
              <Button
                type="submit"
                disabled={submitting}
                className="bg-gradient-to-r from-primary to-primary-glow"
              >
                {submitting ? "Creating…" : "Generate Tracking Link"}
              </Button>
            </div>
          </form>
        </div>

        <div className="glass-panel border border-border rounded-2xl p-6">
          <h2 className="text-2xl font-bold mb-4">All Tracking Links</h2>
          {links.length === 0 ? (
            <p className="text-muted-foreground">No tracking links yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Short Link</TableHead>
                    <TableHead>Affiliate</TableHead>
                    <TableHead>Destination</TableHead>
                    <TableHead>Label</TableHead>
                    <TableHead className="text-right">Clicks</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {links.map((l) => {
                    const url = `${baseUrl}/r/${l.short_code}`;
                    const aff = l.affiliates;
                    return (
                      <TableRow key={l.id}>
                        <TableCell className="font-mono text-xs">
                          /r/{l.short_code}
                        </TableCell>
                        <TableCell>
                          {aff ? `${aff.first_name} ${aff.last_name}` : "—"}
                          {aff ? (
                            <span className="text-muted-foreground"> ({aff.slug})</span>
                          ) : null}
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          <a
                            href={l.destination_url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-primary hover:underline"
                          >
                            {l.destination_url}
                          </a>
                        </TableCell>
                        <TableCell>{l.label || "—"}</TableCell>
                        <TableCell className="text-right">
                          {clickCounts[l.short_code] || 0}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleCopy(l.short_code)}
                              title={url}
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDelete(l.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
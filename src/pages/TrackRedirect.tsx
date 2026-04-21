import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export default function TrackRedirect() {
  const { shortCode } = useParams<{ shortCode: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    const run = async () => {
      if (!shortCode) {
        navigate("/404", { replace: true });
        return;
      }

      // Lookup link + affiliate
      const { data: link, error } = await supabase
        .from("tracking_links")
        .select("id, short_code, destination_url, utm_source, utm_medium, utm_campaign, affiliate_id, affiliates(slug, code)")
        .eq("short_code", shortCode)
        .maybeSingle();

      if (error || !link) {
        navigate("/404", { replace: true });
        return;
      }

      const affiliate = (link as any).affiliates;
      const slug = affiliate?.slug ?? "";
      const code = affiliate?.code ?? "";
      const campaign = link.utm_campaign || slug || "affiliate";

      // Build click_id we can also pass through
      const clickId =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : Math.random().toString(36).slice(2);

      // Log click (fire-and-forget – don't block redirect)
      supabase
        .from("clicks")
        .insert({
          affiliate_id: link.affiliate_id,
          code: code || slug || "unknown",
          path: `/r/${shortCode}`,
          ua: typeof navigator !== "undefined" ? navigator.userAgent : null,
          utm: {
            utm_source: link.utm_source,
            utm_medium: link.utm_medium,
            utm_campaign: campaign,
            ref: slug,
            click_id: clickId,
            destination: link.destination_url,
          },
        })
        .then(() => {});

      // Append UTMs to destination
      let target: URL;
      try {
        target = new URL(link.destination_url);
      } catch {
        navigate("/404", { replace: true });
        return;
      }
      target.searchParams.set("utm_source", link.utm_source);
      target.searchParams.set("utm_medium", link.utm_medium);
      target.searchParams.set("utm_campaign", campaign);
      if (slug) target.searchParams.set("ref", slug);
      target.searchParams.set("click_id", clickId);

      window.location.replace(target.toString());
    };

    run();
  }, [shortCode, navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <p className="text-muted-foreground">Redirecting…</p>
    </div>
  );
}
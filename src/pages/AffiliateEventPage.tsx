import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { EventPageContent } from "@/components/EventPageContent";
import { z } from "zod";

const eventLeadSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(100),
  lastName: z.string().trim().min(1, "Last name is required").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  company: z.string().trim().max(200).optional().or(z.literal("")),
  website: z
    .string()
    .trim()
    .max(500)
    .refine((v) => v === "" || /^https?:\/\//i.test(v), "Website must start with http(s)://")
    .optional()
    .or(z.literal("")),
});

const AffiliateEventPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [affiliate, setAffiliate] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!slug) return;

      try {
        // Fetch affiliate via SECURITY DEFINER RPC (no PII columns exposed)
        const { data: rows, error: affiliateError } = await supabase.rpc(
          "get_public_affiliate_by_slug",
          { _slug: slug },
        );
        const affiliateData = Array.isArray(rows) ? rows[0] : null;

        if (affiliateError) throw affiliateError;
        if (!affiliateData) {
          navigate("/404");
          return;
        }

        setAffiliate(affiliateData);

        // Track click
        await supabase.from("clicks").insert({
          affiliate_id: affiliateData.id,
          code: affiliateData.code,
          path: window.location.pathname,
          ua: navigator.userAgent,
        });

        document.title = `Event - ${affiliateData.first_name} ${affiliateData.last_name}`;
      } catch (error: any) {
        console.error("Error:", error);
        toast.error("Failed to load event page");
        navigate("/404");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [slug, navigate]);

  const handleSubmit = async (formData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    company: string;
    website: string;
  }) => {
    if (!affiliate) return;

    setIsSubmitting(true);
    try {
      const parsed = eventLeadSchema.safeParse(formData);
      if (!parsed.success) {
        toast.error(parsed.error.issues[0]?.message || "Invalid form data");
        setIsSubmitting(false);
        return;
      }
      const v = parsed.data;
      const { error } = await supabase.from("leads").insert({
        first_name: v.firstName,
        last_name: v.lastName,
        email: v.email,
        phone: v.phone || null,
        company: v.company || null,
        website: v.website || null,
        consented: true,
        affiliate_id: affiliate.id,
        code: affiliate.code,
      });

      if (error) throw error;

      toast.success("Thank you for registering for this event. We look forward to seeing you there!");
    } catch (error: any) {
      console.error("Error:", error);
      toast.error("Failed to submit registration");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="container mx-auto space-y-8">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  if (!affiliate) return null;

  return <EventPageContent onSubmit={handleSubmit} isSubmitting={isSubmitting} />;
};

export default AffiliateEventPage;

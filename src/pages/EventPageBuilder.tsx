import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
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

const EventPageBuilder = () => {
  useEffect(() => {
    document.title = "Event Page Builder - Strategic Partner Network";
  }, []);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    company: string;
    website: string;
  }) => {
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
        code: "event-registration",
        affiliate_id: "00000000-0000-0000-0000-000000000000",
        consented: true
      });

      if (error) throw error;

      toast.success("Registration successful! We'll be in touch soon.");
    } catch (error) {
      console.error("Error submitting registration:", error);
      toast.error("Failed to submit registration. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return <EventPageContent onSubmit={handleSubmit} isSubmitting={isSubmitting} />;
};

export default EventPageBuilder;

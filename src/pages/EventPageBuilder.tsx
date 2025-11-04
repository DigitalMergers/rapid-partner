import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { EventPageContent } from "@/components/EventPageContent";

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
      const { error } = await supabase.from("leads").insert({
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        website: formData.website,
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

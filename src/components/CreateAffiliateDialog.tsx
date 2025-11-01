import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { nanoid } from "nanoid";
import { z } from "zod";

const affiliateSchema = z.object({
  first_name: z.string().trim().min(1, "First name is required").max(100),
  last_name: z.string().trim().min(1, "Last name is required").max(100)
});

interface CreateAffiliateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export const CreateAffiliateDialog = ({ open, onOpenChange, onSuccess }: CreateAffiliateDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
  });

  const generateSlug = (firstName: string, lastName: string) => {
    return `${firstName.toLowerCase()}-${lastName.toLowerCase()}`.replace(/[^a-z0-9-]/g, '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form data
    const validationResult = affiliateSchema.safeParse({
      first_name: formData.first_name,
      last_name: formData.last_name
    });

    if (!validationResult.success) {
      const errors = validationResult.error.errors;
      toast.error(errors[0].message);
      return;
    }

    setLoading(true);

    try {
      const slug = generateSlug(validationResult.data.first_name, validationResult.data.last_name);
      const code = `${slug}-${nanoid(6)}`;

      // Insert affiliate
      const { data: affiliate, error: affiliateError } = await supabase
        .from("affiliates")
        .insert({
          first_name: validationResult.data.first_name,
          last_name: validationResult.data.last_name,
          slug,
          code,
          status: "active",
        })
        .select()
        .single();

      if (affiliateError) throw affiliateError;

      // Get master template
      const { data: template, error: templateError } = await supabase
        .from("landing_pages")
        .select("*")
        .eq("is_template", true)
        .single();

      if (templateError) throw templateError;

      // Create landing page for affiliate
      const { error: pageError } = await supabase
        .from("landing_pages")
        .insert({
          affiliate_id: affiliate.id,
          is_template: false,
          name: `LP - ${validationResult.data.first_name} ${validationResult.data.last_name}`,
          blocks: template.blocks,
        });

      if (pageError) throw pageError;

      // Copy link to clipboard
      const link = `${window.location.origin}/${slug}`;
      await navigator.clipboard.writeText(link);

      toast.success("Affiliate created! Link copied to clipboard.");
      
      setFormData({
        first_name: "",
        last_name: "",
      });
      
      onOpenChange(false);
      onSuccess();
    } catch (error: any) {
      if (process.env.NODE_ENV === 'development') {
        console.error("Error creating affiliate:", error);
      }
      toast.error(error.message || "Failed to create affiliate");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-panel border-border max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl">Create Affiliate</DialogTitle>
          <DialogDescription>
            Just enter the affiliate's name. The system will generate their unique code and landing page automatically.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first_name">First Name *</Label>
              <Input
                id="first_name"
                required
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                className="bg-background/50"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="last_name">Last Name *</Label>
              <Input
                id="last_name"
                required
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                className="bg-background/50"
              />
            </div>
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-primary to-primary-glow"
            >
              {loading ? "Creating..." : "Create Affiliate"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

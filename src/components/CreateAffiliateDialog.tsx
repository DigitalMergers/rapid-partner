import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { nanoid } from "nanoid";

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
    phone: "",
    email: "",
    website: "",
    company: "",
  });

  const generateSlug = (firstName: string, lastName: string) => {
    return `${firstName.toLowerCase()}-${lastName.toLowerCase()}`.replace(/[^a-z0-9-]/g, '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const slug = generateSlug(formData.first_name, formData.last_name);
      const code = `${slug}-${nanoid(6)}`;

      // Insert affiliate
      const { data: affiliate, error: affiliateError } = await supabase
        .from("affiliates")
        .insert({
          ...formData,
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
          name: `LP - ${formData.first_name} ${formData.last_name}`,
          blocks: template.blocks,
        });

      if (pageError) throw pageError;

      // Copy link to clipboard
      const link = `${window.location.origin}/a/${code}`;
      await navigator.clipboard.writeText(link);

      toast.success("Affiliate created! Link copied to clipboard.");
      
      setFormData({
        first_name: "",
        last_name: "",
        phone: "",
        email: "",
        website: "",
        company: "",
      });
      
      onOpenChange(false);
      onSuccess();
    } catch (error: any) {
      console.error("Error creating affiliate:", error);
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
            Enter minimal details. The system generates code, slug, and landing page from the master template.
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
          
          <div className="space-y-2">
            <Label htmlFor="phone">Cell Phone *</Label>
            <Input
              id="phone"
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="bg-background/50"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="bg-background/50"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="website">Website or Social Profile *</Label>
            <Input
              id="website"
              type="url"
              required
              placeholder="https://..."
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              className="bg-background/50"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="company">Company Name *</Label>
            <Input
              id="company"
              required
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className="bg-background/50"
            />
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

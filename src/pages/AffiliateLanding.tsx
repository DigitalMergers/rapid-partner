import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CheckCircle2, Shield, Zap } from "lucide-react";

export default function AffiliateLanding() {
  const { slug } = useParams<{ slug: string }>();
  const [affiliate, setAffiliate] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    website: "",
    company: "",
    consent: false,
  });

  useEffect(() => {
    const fetchAffiliate = async () => {
      if (!slug) return;

      const { data } = await supabase
        .from("affiliates")
        .select("*")
        .eq("slug", slug)
        .eq("status", "active")
        .single();

      if (data) {
        setAffiliate(data);
        // Track click
        await supabase.from("clicks").insert({
          affiliate_id: data.id,
          code: data.code,
          path: window.location.pathname,
          ip: null,
          ua: navigator.userAgent,
        });
      }
    };

    fetchAffiliate();
  }, [slug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.consent) {
      toast.error("Please agree to the terms to continue");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.from("leads").insert({
        affiliate_id: affiliate.id,
        code: affiliate.code,
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        website: formData.website,
        consented: true,
        payload: {
          source_path: window.location.pathname,
          ua: navigator.userAgent,
        },
        status: "new",
      });

      if (error) throw error;

      toast.success("Thanks — you're in. We'll be in touch.");
      
      setFormData({
        first_name: "",
        last_name: "",
        phone: "",
        email: "",
        website: "",
        company: "",
        consent: false,
      });
    } catch (error: any) {
      toast.error("Something went sideways. Try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!affiliate) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-6 py-12 space-y-16">
        {/* Hero Section */}
        <div className="glass-panel border border-border rounded-2xl p-12 relative overflow-hidden animate-fade-in-up">
          <div 
            className="absolute inset-0"
            style={{
              background: "linear-gradient(135deg, rgba(124, 58, 237, 0.15) 0%, rgba(183, 148, 244, 0.1) 100%)",
            }}
          />
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              background: "radial-gradient(800px 800px at 90% -20%, rgba(255, 255, 255, 0.18), transparent 60%)",
            }}
          />
          <div className="relative z-10 text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <span className="text-sm font-medium text-primary">Verified Partner</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Grow Faster With A Verified Partner
            </h1>
            <p className="text-xl text-muted-foreground mb-4">
              Smart systems, clear ROI, and a real human to help.
            </p>
            <p className="text-lg text-primary/80 font-medium">
              Trusted Partner: {affiliate.first_name} {affiliate.last_name}
            </p>
            <div className="mt-8">
              <Button
                size="lg"
                onClick={() => document.getElementById("lead-form")?.scrollIntoView({ behavior: "smooth" })}
                className="bg-gradient-to-r from-primary to-primary-glow shadow-lg hover:shadow-xl transition-all"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: CheckCircle2,
              title: "Verified Partners",
              desc: "We vet affiliates so you don't have to.",
            },
            {
              icon: Zap,
              title: "Transparent Tracking",
              desc: "Clicks, leads, conversions. No mystery.",
            },
            {
              icon: Shield,
              title: "Fast Support",
              desc: "Real answers, not canned responses.",
            },
          ].map((feature, i) => (
            <div key={i} className="glass-panel border border-border rounded-xl p-6 hover-lift">
              <feature.icon className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* Lead Form */}
        <div id="lead-form" className="max-w-2xl mx-auto glass-panel border border-border rounded-2xl p-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">Get Started</h2>
            <p className="text-muted-foreground">
              Complete the form below. Required fields only, no fluff.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
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

            <div className="flex items-start space-x-3 pt-2">
              <Checkbox
                id="consent"
                checked={formData.consent}
                onCheckedChange={(checked) => setFormData({ ...formData, consent: checked as boolean })}
              />
              <Label htmlFor="consent" className="text-sm leading-relaxed cursor-pointer">
                I agree to be contacted by phone, SMS, and email. I consent to the Privacy Policy and Terms.
              </Label>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary to-primary-glow"
              size="lg"
            >
              {loading ? "Submitting..." : "Submit"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

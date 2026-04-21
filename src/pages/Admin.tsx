import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { KPICard } from "@/components/KPICard";
import { CreateAffiliateDialog } from "@/components/CreateAffiliateDialog";
import { AffiliatesTable } from "@/components/AffiliatesTable";
import { Users, MousePointerClick, UserCheck, DollarSign, LogOut, CalendarCheck, Link2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export default function Admin() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [affiliates, setAffiliates] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalAffiliates: 0,
    clicks7d: 0,
    leads7d: 0,
    revenue30d: 0,
  });

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  const fetchData = async () => {
    // Fetch affiliates
    const { data: affiliatesData } = await supabase
      .from("affiliates")
      .select("*")
      .order("created_at", { ascending: false });

    setAffiliates(affiliatesData || []);

    // Calculate stats
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const { count: clicksCount } = await supabase
      .from("clicks")
      .select("*", { count: "exact", head: true })
      .gte("ts", sevenDaysAgo.toISOString());

    const { count: leadsCount } = await supabase
      .from("leads")
      .select("*", { count: "exact", head: true })
      .gte("ts", sevenDaysAgo.toISOString());

    const { data: conversionsData } = await supabase
      .from("conversions")
      .select("amount")
      .gte("ts", thirtyDaysAgo.toISOString());

    const totalRevenue = conversionsData?.reduce((sum, c) => sum + Number(c.amount), 0) || 0;

    setStats({
      totalAffiliates: affiliatesData?.length || 0,
      clicks7d: clicksCount || 0,
      leads7d: leadsCount || 0,
      revenue30d: totalRevenue,
    });
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Failed to log out");
    } else {
      toast.success("Logged out successfully");
      navigate("/auth");
    }
  };

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header with logout */}
        <div className="flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>

        {/* Hero Section */}
        <div className="glass-panel border border-border rounded-2xl p-12 relative overflow-hidden animate-fade-in-up">
          <div 
            className="absolute inset-0 opacity-30"
            style={{
              background: "radial-gradient(1200px 1200px at 80% -10%, rgba(124, 58, 237, 0.25), transparent 60%)",
            }}
          />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
              <span className="text-sm font-medium text-primary">Affiliate Control Room</span>
            </div>
            <h1 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Affiliate Mini-OS
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
              Create affiliates in one click, auto-generate synced landing pages, track clicks, leads, and conversions.
            </p>
            <Button
              onClick={() => setDialogOpen(true)}
              size="lg"
              className="bg-gradient-to-r from-primary to-primary-glow shadow-lg hover:shadow-xl transition-all"
            >
              Create Affiliate
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            label="Affiliates"
            value={stats.totalAffiliates}
            icon={Users}
          />
          <KPICard
            label="Clicks (7d)"
            value={stats.clicks7d}
            icon={MousePointerClick}
          />
          <div 
            onClick={() => navigate("/admin/leads")}
            className="cursor-pointer hover:scale-[1.02] transition-transform"
          >
            <KPICard
              label="Leads (7d)"
              value={stats.leads7d}
              icon={UserCheck}
            />
          </div>
          <KPICard
            label="Revenue (30d)"
            value={`$${stats.revenue30d.toFixed(2)}`}
            icon={DollarSign}
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => navigate("/event")}
            className="glass-panel border border-primary/30 rounded-2xl p-6 text-left hover-lift hover:border-primary transition-all bg-primary/5"
          >
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
              <CalendarCheck className="w-5 h-5 text-primary" />
              Edit Event Page
            </h3>
            <p className="text-muted-foreground">
              Update the master event template that all affiliates share
            </p>
          </button>
          
          <button
            onClick={() => navigate("/admin/leads")}
            className="glass-panel border border-border rounded-2xl p-6 text-left hover-lift hover:border-primary/50 transition-all"
          >
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-primary" />
              View All Leads
            </h3>
            <p className="text-muted-foreground">
              See detailed information about all leads submitted from affiliate pages
            </p>
          </button>

          <button
            onClick={() => navigate("/admin/links")}
            className="glass-panel border border-border rounded-2xl p-6 text-left hover-lift hover:border-primary/50 transition-all"
          >
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
              <Link2 className="w-5 h-5 text-primary" />
              Tracking Links
            </h3>
            <p className="text-muted-foreground">
              Generate trackable UTM short links to any destination URL
            </p>
          </button>
        </div>

        {/* Affiliates Table */}
        <div className="glass-panel border border-border rounded-2xl p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">Affiliates</h2>
            <p className="text-muted-foreground">Manage and monitor performance.</p>
          </div>
          <AffiliatesTable affiliates={affiliates} onUpdate={fetchData} />
        </div>

        {/* Create Dialog */}
        <CreateAffiliateDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onSuccess={fetchData}
        />
      </div>
    </div>
  );
}

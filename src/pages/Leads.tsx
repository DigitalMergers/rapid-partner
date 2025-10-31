import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Mail, Phone, Globe, Building2, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Lead {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  company: string | null;
  website: string | null;
  consented: boolean;
  ts: string;
  status: string;
  code: string;
  affiliate: {
    first_name: string;
    last_name: string;
    code: string;
  };
}

export default function Leads() {
  const navigate = useNavigate();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("leads")
      .select(`
        *,
        affiliate:affiliates!leads_affiliate_id_fkey (
          first_name,
          last_name,
          code
        )
      `)
      .order("ts", { ascending: false });

    if (error) {
      console.error("Error fetching leads:", error);
    } else {
      setLeads(data as any || []);
    }
    setLoading(false);
  };

  const updateLeadStatus = async (leadId: string, newStatus: string) => {
    const { error } = await supabase
      .from("leads")
      .update({ status: newStatus })
      .eq("id", leadId);

    if (error) {
      console.error("Error updating lead status:", error);
    } else {
      fetchLeads();
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "default";
      case "qualified":
        return "secondary";
      case "won":
        return "outline";
      case "lost":
        return "destructive";
      default:
        return "default";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Admin
          </Button>
        </div>

        <div className="glass-panel border border-border rounded-2xl p-8 animate-fade-in-up">
          <div className="mb-6">
            <h1 className="text-4xl font-extrabold mb-2">Leads Submitted</h1>
            <p className="text-xl text-muted-foreground">
              Track all leads captured from affiliate landing pages
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="glass-panel border border-border rounded-xl p-4">
              <p className="text-sm text-muted-foreground mb-1">Total Leads</p>
              <p className="text-2xl font-bold">{leads.length}</p>
            </div>
            <div className="glass-panel border border-border rounded-xl p-4">
              <p className="text-sm text-muted-foreground mb-1">New</p>
              <p className="text-2xl font-bold">{leads.filter(l => l.status === "new").length}</p>
            </div>
            <div className="glass-panel border border-border rounded-xl p-4">
              <p className="text-sm text-muted-foreground mb-1">Qualified</p>
              <p className="text-2xl font-bold">{leads.filter(l => l.status === "qualified").length}</p>
            </div>
            <div className="glass-panel border border-border rounded-xl p-4">
              <p className="text-sm text-muted-foreground mb-1">Won</p>
              <p className="text-2xl font-bold text-success">{leads.filter(l => l.status === "won").length}</p>
            </div>
          </div>

          {/* Leads Table */}
          {loading ? (
            <div className="text-center py-12 text-muted-foreground">Loading leads...</div>
          ) : leads.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No leads submitted yet. Share your affiliate links to start collecting leads!
            </div>
          ) : (
            <div className="rounded-2xl border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead>Lead</TableHead>
                    <TableHead>Contact Info</TableHead>
                    <TableHead>Company Details</TableHead>
                    <TableHead>Affiliate</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leads.map((lead) => (
                    <TableRow key={lead.id} className="border-border hover:bg-muted/50">
                      <TableCell>
                        <div>
                          <p className="font-medium">
                            {lead.first_name} {lead.last_name}
                          </p>
                          {lead.consented && (
                            <div className="flex items-center gap-1 text-xs text-success mt-1">
                              <CheckCircle2 className="w-3 h-3" />
                              Consented
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Mail className="w-3 h-3" />
                            {lead.email}
                          </div>
                          {lead.phone && (
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Phone className="w-3 h-3" />
                              {lead.phone}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1 text-sm">
                          {lead.company && (
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Building2 className="w-3 h-3" />
                              {lead.company}
                            </div>
                          )}
                          {lead.website && (
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Globe className="w-3 h-3" />
                              <a 
                                href={lead.website} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="hover:text-primary underline"
                              >
                                {lead.website.replace(/^https?:\/\//, '').substring(0, 30)}
                              </a>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">
                            {lead.affiliate.first_name} {lead.affiliate.last_name}
                          </p>
                          <code className="text-xs text-muted-foreground">
                            {lead.affiliate.code}
                          </code>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(lead.ts)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(lead.status)}>
                          {lead.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2 justify-end">
                          {lead.status === "new" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateLeadStatus(lead.id, "qualified")}
                            >
                              Qualify
                            </Button>
                          )}
                          {lead.status === "qualified" && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateLeadStatus(lead.id, "won")}
                              >
                                Won
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateLeadStatus(lead.id, "lost")}
                              >
                                Lost
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

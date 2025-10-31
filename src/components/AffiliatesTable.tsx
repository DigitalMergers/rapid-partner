import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Copy } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface Affiliate {
  id: string;
  first_name: string;
  last_name: string;
  email?: string;
  company?: string;
  code: string;
  slug: string;
  status: string;
}

interface AffiliatesTableProps {
  affiliates: Affiliate[];
  onUpdate: () => void;
}

export const AffiliatesTable = ({ affiliates, onUpdate }: AffiliatesTableProps) => {
  const copyLink = async (slug: string) => {
    const link = `${window.location.origin}/${slug}`;
    await navigator.clipboard.writeText(link);
    toast.success("Link copied to clipboard");
  };

  const toggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "paused" : "active";
    
    const { error } = await supabase
      .from("affiliates")
      .update({ status: newStatus })
      .eq("id", id);

    if (error) {
      toast.error("Failed to update status");
      return;
    }

    toast.success(`Affiliate ${newStatus}`);
    onUpdate();
  };

  if (affiliates.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No affiliates yet. Click "Create Affiliate" to get started.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-border hover:bg-transparent">
            <TableHead>Name</TableHead>
            <TableHead>Code</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {affiliates.map((affiliate) => (
            <TableRow key={affiliate.id} className="border-border hover:bg-muted/50">
              <TableCell className="font-medium">
                {affiliate.first_name} {affiliate.last_name}
              </TableCell>
              <TableCell>
                <code className="px-2 py-1 rounded bg-muted text-sm font-mono">
                  {affiliate.code}
                </code>
              </TableCell>
              <TableCell>
                <Badge variant={affiliate.status === "active" ? "default" : "secondary"}>
                  {affiliate.status}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(`/${affiliate.slug}`, '_blank')}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyLink(affiliate.slug)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleStatus(affiliate.id, affiliate.status)}
                  >
                    {affiliate.status === "active" ? "Pause" : "Activate"}
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

type GuideRow = {
  id: string;
  user_id: string;
  full_name: string;
  bio: string | null;
  hunting_areas: string[] | null;
  license_number: string | null;
  approval_status: "pending" | "approved" | "rejected";
  created_at: string;
};

const AdminGuides = () => {
  const [guides, setGuides] = useState<GuideRow[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("guides")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    setGuides((data as GuideRow[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const setStatus = async (id: string, status: "approved" | "rejected") => {
    const { error } = await supabase.from("guides").update({ approval_status: status }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success(`Guide ${status}`);
    load();
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container max-w-4xl">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-foreground-dim hover:text-accent mb-6">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>
        <h1 className="font-display text-3xl font-bold mb-6">Guide approvals</h1>
        {loading ? (
          <p className="text-foreground-dim">Loading…</p>
        ) : guides.length === 0 ? (
          <p className="text-foreground-dim">No guide applications yet.</p>
        ) : (
          <div className="space-y-3">
            {guides.map(g => (
              <div key={g.id} className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold">{g.full_name}</h3>
                    <p className="text-xs text-foreground-dim">License: {g.license_number ?? "—"}</p>
                    {g.bio && <p className="text-sm text-foreground-dim mt-2">{g.bio}</p>}
                    {g.hunting_areas?.length ? (
                      <p className="text-xs text-foreground-dim mt-2">Areas: {g.hunting_areas.join(", ")}</p>
                    ) : null}
                  </div>
                  <div className="text-right">
                    <span className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded ${
                      g.approval_status === "approved" ? "bg-accent/20 text-accent" :
                      g.approval_status === "rejected" ? "bg-destructive/20 text-destructive" :
                      "bg-muted text-foreground-dim"
                    }`}>{g.approval_status}</span>
                  </div>
                </div>
                {g.approval_status !== "approved" && (
                  <div className="flex gap-2 mt-4">
                    <Button size="sm" variant="hunt" onClick={() => setStatus(g.id, "approved")}>Approve</Button>
                    {g.approval_status !== "rejected" && (
                      <Button size="sm" variant="outline" onClick={() => setStatus(g.id, "rejected")}>Reject</Button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminGuides;

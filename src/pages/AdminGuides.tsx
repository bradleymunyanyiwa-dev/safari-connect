import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { ArrowLeft, Mail, Phone, MapPin, Award, Search } from "lucide-react";

type GuideRow = {
  id: string;
  user_id: string;
  full_name: string;
  bio: string | null;
  hunting_areas: string[] | null;
  specialties: string[] | null;
  license_number: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  years_experience: number | null;
  approval_status: "pending" | "approved" | "rejected";
  created_at: string;
};

const STATUSES = ["all", "pending", "approved", "rejected"] as const;
type Filter = (typeof STATUSES)[number];

const statusTone = (s: GuideRow["approval_status"]) => {
  switch (s) {
    case "approved": return "bg-success/20 text-success";
    case "rejected": return "bg-destructive/20 text-destructive";
    default: return "bg-accent/20 text-accent";
  }
};

const AdminGuides = () => {
  const [guides, setGuides] = useState<GuideRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("pending");
  const [query, setQuery] = useState("");

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

  const setStatus = async (id: string, status: "approved" | "rejected" | "pending") => {
    const { error } = await supabase.from("guides").update({ approval_status: status }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success(`Guide ${status}`);
    load();
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return guides.filter((g) => {
      if (filter !== "all" && g.approval_status !== filter) return false;
      if (!q) return true;
      return (
        g.full_name.toLowerCase().includes(q) ||
        (g.license_number ?? "").toLowerCase().includes(q) ||
        (g.contact_email ?? "").toLowerCase().includes(q) ||
        (g.hunting_areas ?? []).join(" ").toLowerCase().includes(q)
      );
    });
  }, [guides, filter, query]);

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6">
      <div className="container max-w-4xl">
        <Link to="/admin" className="inline-flex items-center gap-2 text-sm text-foreground-dim hover:text-accent mb-6">
          <ArrowLeft className="w-4 h-4" /> Dashboard
        </Link>

        <header className="mb-6">
          <p className="text-[10px] uppercase tracking-[0.3em] text-accent font-bold">Admin</p>
          <h1 className="font-display text-3xl font-bold">Guide approvals</h1>
        </header>

        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, license, email, area…"
              className="pl-10"
            />
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {STATUSES.map((s) => (
              <Button
                key={s}
                size="sm"
                variant={filter === s ? "hunt" : "outline"}
                onClick={() => setFilter(s)}
                className="capitalize"
              >
                {s}
              </Button>
            ))}
          </div>
        </div>

        {loading ? (
          <p className="text-foreground-dim">Loading…</p>
        ) : filtered.length === 0 ? (
          <p className="text-foreground-dim text-center py-12">No guide applications match.</p>
        ) : (
          <div className="space-y-3">
            {filtered.map((g) => (
              <div key={g.id} className="bg-card border border-border/60 rounded-xl p-4 shadow-card">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-display text-lg font-bold">{g.full_name}</h3>
                      <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded ${statusTone(g.approval_status)}`}>
                        {g.approval_status}
                      </span>
                    </div>
                    <p className="text-xs text-foreground-dim mt-1">
                      Applied {new Date(g.created_at).toLocaleDateString()}
                      {typeof g.years_experience === "number" && ` · ${g.years_experience} yrs experience`}
                    </p>

                    <div className="grid sm:grid-cols-2 gap-x-4 gap-y-1 mt-3 text-xs text-foreground-dim">
                      {g.license_number && (
                        <span className="flex items-center gap-1.5"><Award className="w-3.5 h-3.5" /> Licence {g.license_number}</span>
                      )}
                      {g.contact_email && (
                        <span className="flex items-center gap-1.5 truncate"><Mail className="w-3.5 h-3.5" /> {g.contact_email}</span>
                      )}
                      {g.contact_phone && (
                        <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> {g.contact_phone}</span>
                      )}
                      {g.hunting_areas?.length ? (
                        <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {g.hunting_areas.join(", ")}</span>
                      ) : null}
                    </div>

                    {g.specialties?.length ? (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {g.specialties.map((s) => (
                          <span key={s} className="text-[10px] uppercase tracking-wider bg-muted text-foreground-dim px-2 py-0.5 rounded-full">
                            {s}
                          </span>
                        ))}
                      </div>
                    ) : null}

                    {g.bio && <p className="text-sm text-foreground-dim mt-3 italic">"{g.bio}"</p>}
                  </div>
                </div>

                <div className="flex gap-2 mt-4 flex-wrap">
                  {g.approval_status !== "approved" && (
                    <Button size="sm" variant="hunt" onClick={() => setStatus(g.id, "approved")}>Approve</Button>
                  )}
                  {g.approval_status !== "rejected" && (
                    <Button size="sm" variant="outline" onClick={() => setStatus(g.id, "rejected")}>Reject</Button>
                  )}
                  {g.approval_status !== "pending" && (
                    <Button size="sm" variant="ghost" onClick={() => setStatus(g.id, "pending")}>Reset to pending</Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminGuides;
